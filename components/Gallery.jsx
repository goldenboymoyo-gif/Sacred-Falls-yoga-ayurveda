"use client";
import { useState, useEffect, useCallback } from "react";
import base from "@/lib/gallery.json";
import useContent, { mediaUrl, API, friendly } from "./useContent";
import useCrop from "./Cropper";
import Busy from "./Busy";
import { shrinkFile } from "@/lib/img";

const cats = ["All", "Yoga", "In class", "In nature", "Nutrition", "Chavutti", "Treatments", "Consultations", "Training in India"];
const alias = { Gatherings: "In class", Tea: "Nutrition" };
const DESC = {
  Yoga: "Yoga practice with Sara Norton",
  "In class": "A yoga class in session",
  "In nature": "Yoga and stillness in nature",
  Nutrition: "Nourishing, home-cooked Ayurvedic food",
  Chavutti: "Chavutti Uzhichil, traditional Kerala bodywork using warm oil and foot pressure",
  Treatments: "An Ayurvedic treatment using warm herbal oil",
  Consultations: "An Ayurveda consultation with Sara",
  "Training in India": "Sara's training in Rishikesh and Kerala, India",
};

export default function Gallery() {
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState(-1);
  const ct0 = useContent();
  const [live, setLive] = useState(null);
  const ct = live || ct0;
  const [adm, setAdm] = useState(false);
  const [sel, setSel] = useState(null);
  const [ncat, setNcat] = useState("In class");
  const [ndesc, setNdesc] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(null); // {text,pct}
  const [cropEl, ask] = useCrop();
  useEffect(() => {
    const f = () => { try { setAdm(!!sessionStorage.getItem("sfAdminToken") && document.body.classList.contains("sfedit")); } catch {} };
    f();
    const mo = new MutationObserver(f); mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);
  const tok = () => sessionStorage.getItem("sfAdminToken");
  async function mutate(fn, ok) {
    setMsg(""); setBusy((b) => b || { text: "Saving…" });
    try {
      const h = { Authorization: `Bearer ${tok()}` };
      const g = await fetch(`${API}/api/admin/content`, { headers: h });
      if (g.status === 401) throw new Error("Session expired, sign in again at /admin");
      const cur = (await g.json()).content;
      cur.gallery = { add: [], remove: [], edit: {}, ...(cur.gallery || {}) };
      fn(cur.gallery);
      const r = await fetch(`${API}/api/admin/content`, { method: "PUT", headers: { ...h, "Content-Type": "application/json" }, body: JSON.stringify({ content: cur }) });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Save failed");
      setLive((await r.json()).content); setMsg(ok);
    } catch (e) { setMsg(friendly(e)); } finally { setBusy(null); }
  }
  async function addPhotos(e) {
    const files = [...e.target.files]; e.target.value = ""; if (!files.length) return;
    try {
      const add = [];
      for (const f of files) {
        const data = await ask(f); if (!data) continue;
        setBusy({ text: "Uploading photo…" });
        const r = await fetch(`${API}/api/admin/upload`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` }, body: JSON.stringify({ data }) });
        const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || "Upload failed");
        add.push({ src: j.url, cat: ncat, desc: ndesc });
      }
      if (add.length) await mutate((g) => { g.add = [...add, ...g.add]; }, `${add.length} photo(s) added to the gallery.`);
      else setMsg("");
    } catch (er) { setMsg(friendly(er)); } finally { setBusy(null); }
  }
  const rm = new Set(ct.gallery.remove);
  const ed = ct.gallery.edit || {};
  const photos = [...base, ...ct.gallery.add.map((a) => ({ ...a, src: mediaUrl(a.src), raw: a.src }))]
    .filter((p) => !rm.has(p.raw || p.src))
    .map((p) => { const e = ed[p.raw || p.src] || {}; const cat = e.cat || alias[p.cat] || p.cat; return { ...p, cat, desc: e.desc || p.desc || DESC[cat] || "Sacred Falls photo" }; });
  const list = photos.filter((p) => cat === "All" || p.cat === cat);
  const shrink = shrinkFile;
  async function bulk(e) {
    const files = [...e.target.files].filter((f) => /^image\//.test(f.type) || /\.(jpe?g|png|webp|gif)$/i.test(f.name)); e.target.value = "";
    if (!files.length) { setMsg("No images found in that selection."); return; }
    const add = []; let i = 0, done = 0, failed = 0;
    setMsg(""); setBusy({ text: `Uploading photo 1 of ${files.length}…`, pct: 3 });
    const worker = async () => {
      while (i < files.length) {
        const f = files[i++];
        try {
          const data = await shrink(f); let last;
          for (let t = 0; t < 3; t++) {
            try {
              const r = await fetch(`${API}/api/admin/upload`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` }, body: JSON.stringify({ data }) });
              const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || "Upload failed");
              add.push({ src: j.url, cat: ncat, desc: ndesc }); last = null; break;
            } catch (x) { last = x; await new Promise((ok) => setTimeout(ok, 700)); }
          }
          if (last) throw last;
        } catch { failed++; }
        ++done; setBusy({ text: `Uploading photo ${Math.min(done + 1, files.length)} of ${files.length}…`, pct: (done / files.length) * 100 });
      }
    };
    await Promise.all([worker(), worker()]);
    setBusy({ text: "Saving to the gallery…", pct: 100 });
    if (add.length) await mutate((g) => { g.add = [...add, ...g.add]; }, `${add.length} photo(s) added and saved${failed ? `, ${failed} failed` : ""}.`);
    else { setBusy(null); setMsg("Upload failed. Check your internet connection and try again."); }
  }
  const selP = sel && photos.find((p) => (p.raw || p.src) === sel);
  const close = useCallback(() => setOpen(-1), []);
  const step = useCallback((d) => setOpen((o) => (o < 0 ? o : (o + d + list.length) % list.length)), [list.length]);

  useEffect(() => {
    if (open < 0) return;
    const k = (e) => { if (e.key === "Escape") close(); if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); };
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [open, close, step]);

  return (
    <>
      {cropEl}<Busy text={busy && busy.text} pct={busy && busy.pct} />
      {adm && (
        <div className="gedit" data-noedit>
          <strong>Gallery editing</strong>
          <select value={ncat} onChange={(e) => setNcat(e.target.value)}>{cats.slice(1).map((c) => <option key={c}>{c}</option>)}</select>
          <input value={ndesc} onChange={(e) => setNdesc(e.target.value)} placeholder="Description for new photos (optional)" maxLength={200} />
          <label className="btn" style={{ cursor: "pointer" }}>Upload a folder<input type="file" accept="image/*" multiple hidden webkitdirectory="" directory="" onChange={bulk} /></label>
          <label className="btn" style={{ cursor: "pointer" }}>Upload many photos<input type="file" accept="image/*" multiple hidden onChange={bulk} /></label>
          <label className="btn" style={{ cursor: "pointer" }}>Add photos (crop each)<input type="file" accept="image/*" multiple hidden onChange={addPhotos} /></label>
          {!selP && <span className="muted">Click a photo below to change its category/description or delete it.</span>}
          {selP && (
            <>
              <img src={selP.src} alt="" style={{ height: 44, borderRadius: 4 }} />
              <select key={sel + "c"} defaultValue={selP.cat} onChange={(e) => mutate((g) => { g.edit = { ...g.edit, [sel]: { cat: e.target.value, desc: selP.desc } }; }, "Category changed.")}>{cats.slice(1).map((c) => <option key={c}>{c}</option>)}</select>
              <input key={sel + "d"} defaultValue={selP.desc} maxLength={200} onBlur={(e) => e.target.value !== selP.desc && mutate((g) => { g.edit = { ...g.edit, [sel]: { cat: selP.cat, desc: e.target.value } }; }, "Description saved.")} />
              <button className="backbtn" onClick={() => { if (confirm("Remove this photo from the gallery?")) { const k = sel; mutate((g) => { const a = g.add.find((x) => x.src === k); if (a) g.add = g.add.filter((x) => x.src !== k); else g.remove = [...g.remove, k]; }, "Photo removed."); setSel(null); } }}>Delete photo</button>
            </>
          )}
          {msg && <span className="sfmsg">{msg}</span>}
        </div>
      )}
      <div className="tabs" data-noedit>
        {cats.map((c) => (
          <button key={c} className={c === cat ? "on" : ""} onClick={() => { setCat(c); setOpen(-1); }}>{c}</button>
        ))}
      </div>
      <div className="masonry">
        {list.map((p, i) => (
          <button className={"gitem" + (adm ? " gedt" : "") + (adm && sel === (p.raw || p.src) ? " gsel" : "")} key={p.src} onClick={() => (adm ? setSel(p.raw || p.src) : setOpen(i))} aria-label={`Open photo ${i + 1}`}>
            <img src={p.src} width={p.w} height={p.h} alt={p.desc} loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
      {open >= 0 && list[open] && (
        <div className="lightbox" onClick={close} role="dialog" aria-modal="true">
          <button className="lb x" onClick={close} aria-label="Close">✕</button>
          <button className="lb prev" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous">‹</button>
          <img src={list[open].src} alt="" onClick={(e) => e.stopPropagation()} />
          <button className="lb next" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next">›</button>
          <div className="count">{open + 1} / {list.length}</div>
        </div>
      )}
    </>
  );
}
