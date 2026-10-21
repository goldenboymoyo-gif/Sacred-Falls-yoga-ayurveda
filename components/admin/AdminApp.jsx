"use client";
import { useCallback, useEffect, useState } from "react";
import base from "@/lib/gallery.json";
import { mediaUrl } from "../useContent";

const API = process.env.NEXT_PUBLIC_API_URL || "";
const KEY = "sfAdminToken";
const STATUS = ["new", "confirmed", "done", "archived"];

export default function AdminApp() {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState("bookings");

  useEffect(() => { try { setToken(sessionStorage.getItem(KEY)); } catch {} setReady(true); }, []);
  const logout = useCallback(() => { try { sessionStorage.removeItem(KEY); } catch {} setToken(null); }, []);

  const api = useCallback(async (path, opts = {}) => {
    const r = await fetch(`${API}/api/admin/${path}`, {
      ...opts,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
    if (r.status === 401) { logout(); throw new Error("Please sign in again"); }
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || "Something went wrong");
    return j;
  }, [token, logout]);

  if (!ready) return null;
  if (!token) return <Login onDone={(t) => { try { sessionStorage.setItem(KEY, t); } catch {} setToken(t); }} />;

  return (
    <section className="adm">
      <div className="wrap">
        <div className="admhead">
          <h1>Dashboard</h1>
          <div className="row"><a className="btn" href="/">Edit website</a><button className="backbtn" onClick={logout}>Sign out</button></div>
        </div>
        <div className="tabs">
          {[["bookings", "Bookings"], ["events", "Events"], ["gallery", "Gallery"], ["settings", "Contact details"]].map(([k, l]) => (
            <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>
        {tab === "bookings" && <Bookings api={api} />}
        {tab === "events" && <Events api={api} />}
        {tab === "gallery" && <GalleryAdmin api={api} token={token} />}
        {tab === "settings" && <Settings api={api} />}
      </div>
    </section>
  );
}

function Login({ onDone }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr("");
    try {
      const r = await fetch(`${API}/api/admin/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || "Could not sign in");
      onDone(j.token);
    } catch (e2) { setErr(e2.message); } finally { setBusy(false); }
  }
  return (
    <section className="adm"><div className="wrap narrow">
      <h1>Admin</h1>
      <form className="book" onSubmit={submit}>
        <label>Password<input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" required /></label>
        <button className="btn" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        {err && <div className="msg err">{err}</div>}
      </form>
    </div></section>
  );
}

function useNotice() {
  const [n, setN] = useState(null);
  const show = (type, text) => { setN({ type, text }); setTimeout(() => setN(null), 4000); };
  return [n && <div className={"msg " + (n.type === "ok" ? "ok" : "err")} style={{ margin: "12px 0" }}>{n.text}</div>, show];
}

function Bookings({ api }) {
  const [items, setItems] = useState(null);
  const [filter, setFilter] = useState("active");
  const [q, setQ] = useState("");
  const [note, show] = useNotice();
  const load = useCallback(() => api("bookings").then((d) => setItems(d.bookings)).catch((e) => { setItems([]); show("err", e.message); }), [api]);
  useEffect(() => { load(); }, [load]);

  async function setStatus(id, status) {
    const prev = items;
    setItems(items.map((b) => (b.id === id ? { ...b, status } : b)));
    try { await api(`bookings/${id}`, { method: "PATCH", body: { status } }); } catch (e) { setItems(prev); show("err", e.message); }
  }
  const [editing, setEditing] = useState(null);
  async function remove(b) {
    if (!confirm(`Delete the booking from ${b.name}? This cannot be undone.`)) return;
    try { await api(`bookings/${b.id}`, { method: "DELETE" }); setItems(items.filter((x) => x.id !== b.id)); show("ok", "Deleted."); } catch (e) { show("err", e.message); }
  }
  async function saveBooking(f) {
    try {
      if (f.id) { await api(`bookings/${f.id}`, { method: "PUT", body: f }); setItems(items.map((x) => (x.id === f.id ? { ...x, ...f } : x))); }
      else { const r = await api("bookings", { method: "POST", body: f }); setItems([r.booking, ...items]); }
      setEditing(null); show("ok", "Saved.");
    } catch (e) { show("err", e.message); }
  }
  if (!items) return <p>Loading…</p>;
  const shown = items.filter((b) => (filter === "active" ? b.status !== "archived" : filter === "all" || b.status === filter))
    .filter((b) => !q || JSON.stringify(b).toLowerCase().includes(q.toLowerCase()));
  const count = (s) => items.filter((b) => b.status === s).length;

  return (
    <>
      {note}
      <div className="stats">
        <div><b>{count("new")}</b><span>New</span></div>
        <div><b>{count("confirmed")}</b><span>Confirmed</span></div>
        <div><b>{count("done")}</b><span>Done</span></div>
        <div><b>{items.length}</b><span>Total shown</span></div>
      </div>
      <div className="admbar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="active">All except archived</option>
          <option value="all">Everything</option>
          {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input placeholder="Search name, email, service…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="backbtn" onClick={load}>Refresh</button>
        <button className="btn" onClick={() => setEditing({ name: "", email: "", phone: "", service: "", format: "", when: "", message: "" })}>Add booking</button>
      </div>
      {editing && !editing.id && <BookingForm init={editing} onSave={saveBooking} onCancel={() => setEditing(null)} />}
      {!shown.length && <p className="muted">No bookings here yet.</p>}
      <div className="blist">
        {shown.map((b) => editing && editing.id === b.id ? <BookingForm key={b.id} init={editing} onSave={saveBooking} onCancel={() => setEditing(null)} /> : (
          <div className={"bcard " + b.status} key={b.id}>
            <div className="btop">
              <div><strong>{b.name}</strong><div className="muted small">{new Date(b.receivedAt).toLocaleString()}</div></div>
              <select value={b.status} onChange={(e) => setStatus(b.id, e.target.value)}>{STATUS.map((s) => <option key={s}>{s}</option>)}</select>
            </div>
            <p><b>{b.service}</b>{b.format ? ` · ${b.format}` : ""}{b.when ? ` · ${b.when}` : ""}</p>
            {b.message && <p className="bmsg">{b.message}</p>}
            <p className="small">
              <a href={`mailto:${b.email}`}>{b.email}</a>
              {b.phone && <> · <a href={`https://wa.me/${b.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener">{b.phone}</a></>}
            </p>
            <div className="row"><button className="backbtn" onClick={() => setEditing({ ...b })}>Edit</button><button className="backbtn" onClick={() => remove(b)}>Delete</button></div>
          </div>
        ))}
      </div>
    </>
  );
}

function BookingForm({ init, onSave, onCancel }) {
  const [f, setF] = useState(init);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <div className="bcard">
      <div className="two"><label>Name<input value={f.name} onChange={set("name")} /></label><label>Email<input value={f.email} onChange={set("email")} /></label></div>
      <div className="two"><label>Phone<input value={f.phone || ""} onChange={set("phone")} /></label><label>Service<input value={f.service} onChange={set("service")} /></label></div>
      <div className="two"><label>Format<input value={f.format || ""} placeholder="Online / In person" onChange={set("format")} /></label><label>Preferred time<input value={f.when || ""} onChange={set("when")} /></label></div>
      <label>Message<textarea rows={3} value={f.message || ""} onChange={set("message")} /></label>
      <div className="row"><button className="btn" onClick={() => onSave(f)}>Save</button><button className="backbtn" onClick={onCancel}>Cancel</button></div>
    </div>
  );
}

const CATS = ["Chavutti", "Treatments", "Yoga", "Gatherings", "Treatments", "Consultations", "Tea"];
function GalleryAdmin({ api, token }) {
  const [c, setC] = useState(null);
  const [cat, setCat] = useState("Gatherings");
  const [busy, setBusy] = useState(false);
  const [note, show] = useNotice();
  useEffect(() => { api("content").then((d) => setC(d.content)).catch((e) => show("err", e.message)); }, [api]);
  if (!c) return <p>Loading…</p>;
  const rm = new Set(c.gallery.remove);
  const all = [...c.gallery.add.map((a) => ({ ...a, added: true })), ...base].filter((p) => !rm.has(p.src));
  const del = (p) => setC({ ...c, gallery: p.added ? { ...c.gallery, add: c.gallery.add.filter((a) => a.src !== p.src) } : { ...c.gallery, remove: [...c.gallery.remove, p.src] } });
  const shrink = (file) => new Promise((ok, no) => {
    const im = new Image(), u = URL.createObjectURL(file);
    im.onload = () => { const k = Math.min(1, 1600 / Math.max(im.width, im.height)); const cv = document.createElement("canvas"); cv.width = Math.round(im.width * k); cv.height = Math.round(im.height * k); cv.getContext("2d").drawImage(im, 0, 0, cv.width, cv.height); URL.revokeObjectURL(u); ok(cv.toDataURL("image/jpeg", 0.85)); };
    im.onerror = () => no(new Error("Could not read an image")); im.src = u;
  });
  async function upload(e) {
    const files = [...e.target.files]; e.target.value = ""; if (!files.length) return;
    setBusy(true);
    try {
      const add = [];
      for (const f of files) { const r = await api("upload", { method: "POST", body: { data: await shrink(f) } }); add.push({ src: r.url, cat }); }
      setC((p) => ({ ...p, gallery: { ...p.gallery, add: [...add, ...p.gallery.add] } })); show("ok", `${add.length} photo(s) uploaded. Press Save to publish.`);
    } catch (er) { show("err", er.message); } finally { setBusy(false); }
  }
  async function save() {
    setBusy(true);
    try { const r = await api("content", { method: "PUT", body: { content: c } }); setC(r.content); show("ok", "Saved. The Gallery page will update shortly."); } catch (er) { show("err", er.message); } finally { setBusy(false); }
  }
  return (
    <>
      {note}
      <div className="admbar">
        <select value={cat} onChange={(e) => setCat(e.target.value)}>{CATS.map((x) => <option key={x}>{x}</option>)}</select>
        <label className="btn" style={{ cursor: "pointer" }}>{busy ? "Working…" : "Add photos"}<input type="file" accept="image/*" multiple hidden onChange={upload} disabled={busy} /></label>
        <button className="btn" onClick={save} disabled={busy}>Save changes</button>
      </div>
      <p className="muted">New photos go into the category chosen above. Tap the cross to remove a photo, then Save.</p>
      <div className="agrid">
        {all.map((p) => (
          <div key={p.src} className="aph"><img src={mediaUrl(p.src)} alt="" loading="lazy" /><button onClick={() => del(p)} aria-label="Remove photo">✕</button><span>{p.cat}</span></div>
        ))}
      </div>
    </>
  );
}

const blank = { title: "", date: "", location: "", description: "" };
function Events({ api }) {
  const [list, setList] = useState(null);
  const [busy, setBusy] = useState(false);
  const [note, show] = useNotice();
  useEffect(() => { api("events").then((d) => setList(d.events)).catch((e) => { setList([]); show("err", e.message); }); }, [api]);
  if (!list) return <p>Loading…</p>;
  const set = (i, k, v) => setList(list.map((e, j) => (j === i ? { ...e, [k]: v } : e)));
  const move = (i, d) => { const n = [...list]; const j = i + d; if (j < 0 || j >= n.length) return; [n[i], n[j]] = [n[j], n[i]]; setList(n); };
  async function save() {
    setBusy(true);
    try { const r = await api("events", { method: "PUT", body: { events: list } }); setList(r.events); show("ok", "Saved. The Retreats page will update shortly."); }
    catch (e) { show("err", e.message); } finally { setBusy(false); }
  }
  return (
    <>
      <p className="muted">These appear on the Retreats page under Upcoming Offerings. With none listed, the standard list is shown.</p>
      {note}
      {list.map((e, i) => (
        <div className="bcard" key={i}>
          <div className="two">
            <label>Title<input value={e.title} onChange={(x) => set(i, "title", x.target.value)} maxLength={120} /></label>
            <label>Date<input value={e.date} placeholder="e.g. 12 to 16 March 2027" onChange={(x) => set(i, "date", x.target.value)} maxLength={60} /></label>
          </div>
          <label>Location<input value={e.location} onChange={(x) => set(i, "location", x.target.value)} maxLength={120} /></label>
          <label>Description<textarea rows={3} value={e.description} onChange={(x) => set(i, "description", x.target.value)} maxLength={600} /></label>
          <div className="row" style={{ marginTop: 8 }}>
            <button type="button" className="backbtn" onClick={() => move(i, -1)}>Move up</button>
            <button type="button" className="backbtn" onClick={() => move(i, 1)}>Move down</button>
            <button type="button" className="backbtn" onClick={() => setList(list.filter((_, j) => j !== i))}>Remove</button>
          </div>
        </div>
      ))}
      <div className="row">
        <button type="button" className="backbtn" onClick={() => setList([...list, { ...blank }])}>Add event</button>
        <button type="button" className="btn" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save changes"}</button>
      </div>
    </>
  );
}

function Settings({ api }) {
  const [s, setS] = useState(null);
  const [busy, setBusy] = useState(false);
  const [note, show] = useNotice();
  useEffect(() => { api("settings").then((d) => setS({ phone: "", email: "", whatsapp: "", instagram: "", ...d.settings })).catch((e) => { setS({ phone: "", email: "", whatsapp: "", instagram: "" }); show("err", e.message); }); }, [api]);
  if (!s) return <p>Loading…</p>;
  const set = (k, v) => setS({ ...s, [k]: v });
  async function save(e) {
    e.preventDefault(); setBusy(true);
    try { const r = await api("settings", { method: "PUT", body: { settings: s } }); setS(r.settings); show("ok", "Saved. The site will show the new details within a minute."); }
    catch (er) { show("err", er.message); } finally { setBusy(false); }
  }
  return (
    <form className="book" onSubmit={save} style={{ maxWidth: 560 }}>
      <p className="muted">Shown in the footer and on the Contact page. Leave a field empty to use the default.</p>
      <label>Email<input type="email" value={s.email} onChange={(e) => set("email", e.target.value)} /></label>
      <label>Phone (as displayed)<input value={s.phone} placeholder="+263 77 260 6233" onChange={(e) => set("phone", e.target.value)} /></label>
      <label>WhatsApp number (digits only, with country code)<input value={s.whatsapp} placeholder="263772606233" onChange={(e) => set("whatsapp", e.target.value)} /></label>
      <label>Instagram handle<input value={s.instagram} placeholder="sacredfalls" onChange={(e) => set("instagram", e.target.value)} /></label>
      <button className="btn" disabled={busy}>{busy ? "Saving…" : "Save"}</button>
      {note}
    </form>
  );
}
