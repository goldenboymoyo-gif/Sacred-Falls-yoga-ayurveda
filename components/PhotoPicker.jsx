"use client";
import { useState, useCallback, useEffect } from "react";
import base from "@/lib/gallery.json";
import { loadContent, mediaUrl } from "./useContent";

const alias = { Gatherings: "In class", Tea: "Nutrition" };
const CATS = ["All", "Yoga", "In class", "In nature", "Nutrition", "Chavutti", "Treatments", "Consultations"];

function Picker({ onDone }) {
  const [cat, setCat] = useState("All");
  const [c, setC] = useState(null);
  useEffect(() => { loadContent().then(setC).catch(() => setC({ gallery: { add: [], remove: [], edit: {} } })); }, []);
  const g = (c && c.gallery) || { add: [], remove: [], edit: {} };
  const rm = new Set(g.remove), ed = g.edit || {};
  const all = [...g.add.map((a) => ({ ...a, raw: a.src })), ...base.map((b) => ({ ...b, raw: b.src }))]
    .filter((p) => !rm.has(p.raw))
    .map((p) => ({ ...p, cat: (ed[p.raw] || {}).cat || alias[p.cat] || p.cat }))
    .filter((p) => cat === "All" || p.cat === cat);
  const file = (e) => { const f = e.target.files && e.target.files[0]; if (f) onDone({ file: f }); };
  return (
    <div className="cropback" data-noedit role="dialog" aria-modal="true">
      <div className="cropbox pickbox" data-noedit>
        <h3>Choose a photo</h3>
        <div className="row" style={{ justifyContent: "center", marginBottom: ".6rem" }}>
          <label className="btn" style={{ cursor: "pointer" }}>Upload a new photo<input type="file" accept="image/*" hidden onChange={file} /></label>
          <button type="button" className="backbtn" onClick={() => onDone(null)}>Cancel</button>
        </div>
        <p className="muted" style={{ fontSize: ".85rem", textAlign: "center" }}>…or pick one from the website gallery:</p>
        <div className="cropasp">{CATS.map((x) => <button key={x} type="button" className={cat === x ? "on" : ""} onClick={() => setCat(x)}>{x}</button>)}</div>
        <div className="pickgrid">
          {!c ? <p>Loading…</p> : all.map((p) => (
            <button type="button" key={p.raw} className="pickit" onClick={() => onDone({ src: p.raw })}>
              <img src={mediaUrl(p.src)} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// const [pickEl, choose] = usePicker(); const r = await choose() -> {file}|{src}|null
export default function usePicker() {
  const [job, setJob] = useState(null);
  const choose = useCallback(() => new Promise((resolve) => setJob({ resolve })), []);
  const el = job ? <Picker onDone={(r) => { job.resolve(r); setJob(null); }} /> : null;
  return [el, choose];
}
