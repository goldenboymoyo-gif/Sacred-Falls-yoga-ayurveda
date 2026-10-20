const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(express.json({ limit: "20kb" }));

const origins = (process.env.ALLOWED_ORIGIN || "").split(",").map((s) => s.trim()).filter(Boolean);
app.use(cors({ origin: (o, cb) => cb(null, !o || origins.length === 0 || origins.includes(o)), methods: ["GET", "POST"] }));

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

  // optional email notification (never blocks the booking)
  if (process.env.RESEND_API_KEY && process.env.BOOKING_TO_EMAIL) {
    const rows = Object.entries(booking).map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v || "-")}</td></tr>`).join("");
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.BOOKING_FROM_EMAIL || "Sacred Falls <onboarding@resend.dev>",
        to: [process.env.BOOKING_TO_EMAIL], reply_to: booking.email,
        subject: `Booking request: ${booking.service} - ${booking.name}`, html: `<h2>New booking request</h2><table cellpadding="6">${rows}</table>`,
      }),
    }).catch(() => {});
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

module.exports = app;
if (require.main === module) app.listen(process.env.PORT || 3001, () => console.log("API on :" + (process.env.PORT || 3001)));
