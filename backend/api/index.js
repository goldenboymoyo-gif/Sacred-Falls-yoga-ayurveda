const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
const small = express.json({ limit: "20kb" }), big = express.json({ limit: "6mb" });
app.use((req, res, next) => (req.path === "/api/admin/upload" ? big : small)(req, res, next));

const origins = (process.env.ALLOWED_ORIGIN || "").split(",").map((s) => s.trim()).filter(Boolean);
app.use(cors({ origin: (o, cb) => cb(null, !o || origins.length === 0 || origins.includes(o)), methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] }));

const GH_API = process.env.GITHUB_API || "https://api.github.com";
const cfg = () => ({ token: process.env.GITHUB_TOKEN, repo: process.env.GITHUB_REPO, branch: process.env.GITHUB_BRANCH || "main" });
const ghFetch = (path, opts = {}) => {
  const { token, repo } = cfg();
  return fetch(`${GH_API}/repos/${repo}/contents/${path}`, {
    ...opts,
    headers: { Authorization: `Bearer ${token}`, "User-Agent": "sacred-falls-api", "X-GitHub-Api-Version": "2022-11-28", ...(opts.headers || {}) },
  });
};

// tiny per-instance rate limit: 5 bookings / 10 min / IP
const hits = new Map();
function limited(ip) {
  const now = Date.now(), win = 10 * 60 * 1000;
  const arr = (hits.get(ip) || []).filter((t) => now - t < win);
  arr.push(now); hits.set(ip, arr);
  return arr.length > 5;
}
const clean = (v, max) => String(v ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/booking", async (req, res) => {
  const b = req.body || {};
  if (b.website) return res.json({ ok: true }); // honeypot
  if (limited(req.ip)) return res.status(429).json({ error: "Too many requests, please try again later" });

  const booking = {
    name: clean(b.name, 100), email: clean(b.email, 150), phone: clean(b.phone, 40),
    service: clean(b.service, 80), format: clean(b.format, 20), when: clean(b.when, 120), message: clean(b.message, 2000),
  };
  if (!booking.name || !/^\S+@\S+\.\S+$/.test(booking.email) || !booking.service)
    return res.status(400).json({ error: "Please fill in your name, email and service" });

  const { token, repo, branch } = cfg();
  if (!token || !repo) return res.status(500).json({ error: "Storage is not configured yet" });

  const now = new Date();
  const id = crypto.randomBytes(4).toString("hex");
  const record = { id, receivedAt: now.toISOString(), ...booking };
  const path = `bookings/${now.toISOString().slice(0, 7)}/${now.toISOString().replace(/[:.]/g, "-")}-${id}.json`;

  try {
    const r = await ghFetch(path, {
      method: "PUT",
      headers: { Accept: "application/vnd.github+json", "Content-Type": "application/json" },
      body: JSON.stringify({ message: `New booking: ${booking.service} (${id})`, branch, content: Buffer.from(JSON.stringify(record, null, 2)).toString("base64") }),
    });
    if (!r.ok) throw new Error(`GitHub ${r.status}`);
  } catch (e) {
    console.error("booking save failed", e.message);
    return res.status(502).json({ error: "Could not save your request" });
  }

  // optional email notification. Awaited: serverless functions freeze once the response is sent.
  if (process.env.RESEND_API_KEY && process.env.BOOKING_TO_EMAIL) {
    const rows = Object.entries(booking).map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v || "-")}</td></tr>`).join("");
    try {
      const er = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        signal: AbortSignal.timeout(8000),
        body: JSON.stringify({
          from: process.env.BOOKING_FROM_EMAIL || "Sacred Falls <onboarding@resend.dev>",
          to: process.env.BOOKING_TO_EMAIL.split(",").map((x) => x.trim()).filter(Boolean), reply_to: booking.email,
          subject: `Booking request: ${booking.service} - ${booking.name}`, html: `<h2>New booking request</h2><table cellpadding="6">${rows}</table>`,
        }),
      });
      if (!er.ok) console.error("booking email failed", er.status, (await er.text()).slice(0, 300));
    } catch (e) { console.error("booking email error", e.message); }
  }
  res.json({ ok: true, id });
});

// Upcoming events: edit data/events.json in the GitHub data repo
app.get("/api/events", async (_req, res) => {
  const { token, repo, branch } = cfg();
  if (!token || !repo) return res.json([]);
  try {
    const r = await ghFetch(`data/events.json?ref=${encodeURIComponent(branch)}`, { headers: { Accept: "application/vnd.github.raw+json" } });
    if (!r.ok) return res.json([]);
    const list = await r.json();
    res.set("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    res.json(Array.isArray(list) ? list.slice(0, 30) : []);
  } catch { res.json([]); }
});


// ---------------------------------------------------------------------------
// Admin (password protected). Data lives in the private GitHub data repo.
// ---------------------------------------------------------------------------
const hash = (x) => crypto.createHash("sha256").update(String(x ?? "")).digest();
const hkey = () => crypto.createHash("sha256").update("sf-admin:" + (process.env.ADMIN_PASSWORD || "")).digest();
const sign = (exp) => `${exp}.${crypto.createHmac("sha256", hkey()).update(String(exp)).digest("base64url")}`;
function verify(token) {
  if (!process.env.ADMIN_PASSWORD) return false;
  const [p, sig] = String(token || "").split(".");
  if (!p || !sig) return false;
  const good = crypto.createHmac("sha256", hkey()).update(p).digest("base64url");
  const a = Buffer.from(sig), b = Buffer.from(good);
  return a.length === b.length && crypto.timingSafeEqual(a, b) && Number(p) > Date.now();
}
const auth = (req, res, next) => (verify((req.headers.authorization || "").replace(/^Bearer /, "")) ? next() : res.status(401).json({ error: "Not signed in" }));

const loginHits = new Map();
function loginLimited(ip) {
  const now = Date.now(), win = 15 * 60 * 1000;
  const arr = (loginHits.get(ip) || []).filter((t) => now - t < win);
  arr.push(now); loginHits.set(ip, arr);
  return arr.length > 10;
}

const JSON_HDR = { Accept: "application/vnd.github+json", "Content-Type": "application/json" };
async function ghList(path) {
  const r = await ghFetch(`${path}?ref=${encodeURIComponent(cfg().branch)}`, { headers: { Accept: "application/vnd.github+json" } });
  if (r.status === 404) return [];
  if (!r.ok) throw new Error("GitHub " + r.status);
  const j = await r.json();
  return Array.isArray(j) ? j : [];
}
async function readRaw(path) {
  const r = await ghFetch(`${path}?ref=${encodeURIComponent(cfg().branch)}`, { headers: { Accept: "application/vnd.github.raw+json" } });
  if (!r.ok) return null;
  try { return await r.json(); } catch { return null; }
}
async function readJson(path, fallback) {
  const r = await ghFetch(`${path}?ref=${encodeURIComponent(cfg().branch)}`, { headers: { Accept: "application/vnd.github+json" } });
  if (r.status === 404) return { data: fallback, sha: null };
  if (!r.ok) throw new Error("GitHub " + r.status);
  const j = await r.json();
  return { data: JSON.parse(Buffer.from(j.content, "base64").toString("utf8")), sha: j.sha };
}
async function writeJson(path, data, sha, message) {
  const r = await ghFetch(path, {
    method: "PUT", headers: JSON_HDR,
    body: JSON.stringify({ message, branch: cfg().branch, content: Buffer.from(JSON.stringify(data, null, 2)).toString("base64"), ...(sha ? { sha } : {}) }),
  });
  if (!r.ok) throw new Error("GitHub " + r.status);
}
const ready = (_q, res, next) => (cfg().token && cfg().repo ? next() : res.status(500).json({ error: "Storage is not configured yet" }));
const fail = (res, e) => { console.error(e.message); res.status(502).json({ error: "Could not reach the data store, please try again" }); };

app.post("/api/admin/login", (req, res) => {
  if (!process.env.ADMIN_PASSWORD) return res.status(503).json({ error: "Admin is not set up yet" });
  if (loginLimited(req.ip)) return res.status(429).json({ error: "Too many attempts, try again later" });
  if (!crypto.timingSafeEqual(hash(req.body && req.body.password), hash(process.env.ADMIN_PASSWORD))) return res.status(401).json({ error: "Wrong password" });
  res.json({ token: sign(Date.now() + 12 * 3600 * 1000) });
});

// ---- bookings ----
const STATUSES = ["new", "confirmed", "done", "archived"];
app.get("/api/admin/bookings", auth, ready, async (_req, res) => {
  try {
    const months = (await ghList("bookings")).filter((d) => d.type === "dir").map((d) => d.name).sort().reverse();
    let files = [];
    for (const m of months) {
      files = files.concat((await ghList("bookings/" + m)).filter((f) => f.name.endsWith(".json")).map((f) => f.path));
      if (files.length >= 100) break;
    }
    files = files.sort().reverse().slice(0, 100);
    const [list, st] = await Promise.all([Promise.all(files.map(readRaw)), readJson("data/booking-status.json", {})]);
    const bookings = list.filter(Boolean).map((b) => ({ ...b, status: st.data[b.id] || "new" }));
    res.json({ bookings });
  } catch (e) { fail(res, e); }
});
app.patch("/api/admin/bookings/:id", auth, ready, async (req, res) => {
  const id = String(req.params.id);
  const status = String((req.body || {}).status);
  if (!/^[a-f0-9]{8}$/.test(id) || !STATUSES.includes(status)) return res.status(400).json({ error: "Invalid request" });
  try {
    const { data, sha } = await readJson("data/booking-status.json", {});
    data[id] = status;
    await writeJson("data/booking-status.json", data, sha, `Booking ${id}: ${status}`);
    res.json({ ok: true });
  } catch (e) { fail(res, e); }
});

// ---- events ----
const t = (v, n) => String(v ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, n);
app.get("/api/admin/events", auth, ready, async (_req, res) => {
  try { const { data } = await readJson("data/events.json", []); res.json({ events: Array.isArray(data) ? data : [] }); } catch (e) { fail(res, e); }
});
app.put("/api/admin/events", auth, ready, async (req, res) => {
  const list = (req.body || {}).events;
  if (!Array.isArray(list) || list.length > 50) return res.status(400).json({ error: "Invalid events" });
  const events = list.map((e) => ({ title: t(e.title, 120), date: t(e.date, 60), location: t(e.location, 120), description: t(e.description, 600), image: t(e.image, 300), link: t(e.link, 300) })).filter((e) => e.title);
  try {
    const { sha } = await readJson("data/events.json", []);
    await writeJson("data/events.json", events, sha, "Update events");
    res.json({ ok: true, events });
  } catch (e) { fail(res, e); }
});

// ---- site contact settings ----
const cleanSettings = (b = {}) => ({
  phone: t(b.phone, 40), email: t(b.email, 120), whatsapp: String(b.whatsapp ?? "").replace(/\D/g, "").slice(0, 20),
  instagram: t(b.instagram, 60).replace(/^@/, "").replace(/[^A-Za-z0-9._]/g, ""),
});
app.get("/api/settings", async (_req, res) => {
  if (!cfg().token || !cfg().repo) return res.json({});
  try {
    const d = await readRaw("data/settings.json");
    res.set("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.json(d && typeof d === "object" ? cleanSettings(d) : {});
  } catch { res.json({}); }
});
app.get("/api/admin/settings", auth, ready, async (_req, res) => {
  try { const { data } = await readJson("data/settings.json", {}); res.json({ settings: cleanSettings(data) }); } catch (e) { fail(res, e); }
});
app.put("/api/admin/settings", auth, ready, async (req, res) => {
  const settings = cleanSettings((req.body || {}).settings);
  try {
    const { sha } = await readJson("data/settings.json", {});
    await writeJson("data/settings.json", settings, sha, "Update contact settings");
    res.json({ ok: true, settings });
  } catch (e) { fail(res, e); }
});

// ---- bookings: edit / add / delete ----
async function findBooking(id) {
  const months = (await ghList("bookings")).filter((d) => d.type === "dir").map((d) => d.name).sort().reverse();
  for (const m of months) {
    const f = (await ghList("bookings/" + m)).find((x) => x.name.endsWith(`-${id}.json`));
    if (f) return f;
  }
  return null;
}
const bookingFields = (b = {}) => ({
  name: t(b.name, 100), email: t(b.email, 150), phone: t(b.phone, 40), service: t(b.service, 80),
  format: t(b.format, 20), when: t(b.when, 120), message: String(b.message ?? "").trim().slice(0, 2000),
});
app.post("/api/admin/bookings", auth, ready, async (req, res) => {
  const f = bookingFields(req.body);
  if (!f.name) return res.status(400).json({ error: "Name is required" });
  const now = new Date(), id = crypto.randomBytes(4).toString("hex");
  const rec = { id, receivedAt: now.toISOString(), ...f };
  try {
    await writeJson(`bookings/${now.toISOString().slice(0, 7)}/${now.toISOString().replace(/[:.]/g, "-")}-${id}.json`, rec, null, `Add booking (${id})`);
    res.json({ ok: true, booking: { ...rec, status: "new" } });
  } catch (e) { fail(res, e); }
});
app.put("/api/admin/bookings/:id", auth, ready, async (req, res) => {
  const id = String(req.params.id);
  if (!/^[a-f0-9]{8}$/.test(id)) return res.status(400).json({ error: "Invalid request" });
  const f = bookingFields(req.body);
  if (!f.name) return res.status(400).json({ error: "Name is required" });
  try {
    const file = await findBooking(id);
    if (!file) return res.status(404).json({ error: "Booking not found" });
    const old = await readRaw(file.path);
    await writeJson(file.path, { ...old, ...f }, file.sha, `Edit booking ${id}`);
    res.json({ ok: true });
  } catch (e) { fail(res, e); }
});
app.delete("/api/admin/bookings/:id", auth, ready, async (req, res) => {
  const id = String(req.params.id);
  if (!/^[a-f0-9]{8}$/.test(id)) return res.status(400).json({ error: "Invalid request" });
  try {
    const file = await findBooking(id);
    if (!file) return res.status(404).json({ error: "Booking not found" });
    const r = await ghFetch(file.path, { method: "DELETE", headers: JSON_HDR, body: JSON.stringify({ message: `Delete booking ${id}`, sha: file.sha, branch: cfg().branch }) });
    if (!r.ok) throw new Error("GitHub " + r.status);
    res.json({ ok: true });
  } catch (e) { fail(res, e); }
});

// ---- whole-site content (text, images, hidden items, gallery) ----
const cleanContent = (b = {}) => {
  const obj = (o, max, vmax) => Object.fromEntries(Object.entries(o && typeof o === "object" ? o : {}).slice(0, max)
    .map(([k, v]) => [String(k).slice(0, 200), String(v ?? "").slice(0, vmax)]));
  const arr = (a, n) => (Array.isArray(a) ? a.slice(0, n) : []);
  const g = b.gallery || {};
  const c = b.certs || {};
  return {
    text: obj(b.text, 1500, 3000),
    img: obj(b.img, 300, 300),
    hide: arr(b.hide, 500).map((k) => String(k).slice(0, 200)),
    gallery: {
      add: arr(g.add, 600).map((x) => ({ src: t(x && x.src, 300), cat: t(x && x.cat, 30) || "In class", desc: t(x && x.desc, 200) })).filter((x) => x.src),
      remove: arr(g.remove, 600).map((x) => t(x, 300)),
      edit: Object.fromEntries(Object.entries(g.edit && typeof g.edit === "object" ? g.edit : {}).slice(0, 800).map(([k, v]) => [t(k, 300), { cat: t(v && v.cat, 30), desc: t(v && v.desc, 200) }])),
    },
    certs: {
      add: arr(c.add, 60).map((x) => ({ src: t(x && x.src, 300), title: t(x && x.title, 200) })).filter((x) => x.src),
      remove: arr(c.remove, 60).map((x) => t(x, 300)),
      edit: Object.fromEntries(Object.entries(c.edit && typeof c.edit === "object" ? c.edit : {}).slice(0, 80).map(([k, v]) => [t(k, 300), t(v, 200)])),
    },
  };
};
app.get("/api/content", async (_req, res) => {
  if (!cfg().token || !cfg().repo) return res.json(cleanContent());
  try {
    const d = await readRaw("data/content.json");
    res.set("Cache-Control", "s-maxage=20, stale-while-revalidate=120");
    res.json(cleanContent(d || {}));
  } catch { res.json(cleanContent()); }
});
app.get("/api/admin/content", auth, ready, async (_req, res) => {
  try { const { data } = await readJson("data/content.json", {}); res.json({ content: cleanContent(data) }); } catch (e) { fail(res, e); }
});
app.put("/api/admin/content", auth, ready, async (req, res) => {
  const content = cleanContent((req.body || {}).content);
  try {
    const { sha } = await readJson("data/content.json", {});
    await writeJson("data/content.json", content, sha, "Update site content");
    res.json({ ok: true, content });
  } catch (e) { fail(res, e); }
});
app.post("/api/admin/upload", auth, ready, async (req, res) => {
  const m = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(String((req.body || {}).data || ""));
  if (!m) return res.status(400).json({ error: "Please choose a JPG, PNG or WebP image" });
  const ext = m[1] === "jpeg" ? "jpg" : m[1];
  const name = `${Date.now()}-${crypto.randomBytes(3).toString("hex")}.${ext}`;
  try {
    const r = await ghFetch(`media/${name}`, { method: "PUT", headers: JSON_HDR, body: JSON.stringify({ message: "Upload " + name, branch: cfg().branch, content: m[2] }) });
    if (!r.ok) throw new Error("GitHub " + r.status);
    res.json({ ok: true, url: `/api/media/${name}` });
  } catch (e) { fail(res, e); }
});
app.get("/api/media/:name", async (req, res) => {
  const n = String(req.params.name);
  if (!/^[\w-]+\.(jpg|png|webp)$/.test(n)) return res.status(404).end();
  try {
    const r = await ghFetch(`media/${n}?ref=${encodeURIComponent(cfg().branch)}`, { headers: { Accept: "application/vnd.github.raw+json" } });
    if (!r.ok) return res.status(404).end();
    res.set({ "Content-Type": { jpg: "image/jpeg", png: "image/png", webp: "image/webp" }[n.split(".")[1]], "Cache-Control": "public, max-age=31536000, immutable", "Cross-Origin-Resource-Policy": "cross-origin" });
    res.send(Buffer.from(await r.arrayBuffer()));
  } catch { res.status(502).end(); }
});

module.exports = app;
if (require.main === module) app.listen(process.env.PORT || 3001, () => console.log("API on :" + (process.env.PORT || 3001)));
