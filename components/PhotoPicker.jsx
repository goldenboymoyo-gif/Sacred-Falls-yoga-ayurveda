"use client";
import { useState, useCallback, useEffect } from "react";
import base from "@/lib/gallery.json";
import { loadContent, mediaUrl } from "./useContent";

const alias = { Gatherings: "In class", Tea: "Nutrition" };
const CATS = ["All", "Yoga", "In class", "In nature", "Nutrition", "Chavutti", "Treatments", "Consultations", "Training in India"];

function Picker({ onDone, multi }) {
  const [cat, setCat] = useState("All");
  const [pick, setPick] = useState([]);
  const [c, setC] = useState(null);
  useEffect(() => { loadContent().then(setC).catch(() => setC({ gallery: { add: [], remove: [], edit: {} } })); }, []);
  const g = (c && c.gallery) || { add: [], remove: [], edit: {} };
  const rm = new Set(g.remove), ed = g.edit || {};
  const all = [...g.add.map((a) => ({ ...a, raw: a.src })), ...base.map((b) => ({ ...b, raw: b.src }))]
    .filter((p) => !rm.has(p.raw))
    .map((p) => ({ ...p, cat: (ed[p.raw] || {}).cat || alias[p.cat] || p.cat }))
    .filter((p) => cat === "All" || p.cat === cat);
  const file = (e) => { const fs = [...(e.target.files || [])]; if (!fs.length) return; if (multi) onDone({ files: fs, srcs: pick }); else onDone({ file: fs[0] }); };
  const tog = (r) => setPick((a) => (a.includes(r) ? a.filter((x) => x !== r) : [...a, r]));
  return (
    <div className="cropback" data-noedit role="dialog" aria-modal="true">
      <div className="cropbox pickbox" data-noedit>
        <h3>{multi ? "Choose photos for the grid" : "Choose a photo"}</h3>
        <div className="row" style={{ justifyContent: "center", marginBottom: ".6rem" }}>
          <label className="btn" style={{ cursor: "pointer" }}>{multi ? "Upload new photos" : "Upload a new photo"}<input type="file" accept="image/*" multiple={!!multi} hidden onChange={file} /></label>
          {multi && <button type="button" className="btn" disabled={!pick.length} onClick={() => onDone({ srcs: pick, files: [] })}>Use {pick.length} selected</button>}
          <button type="button" className="backbtn" onClick={() => onDone(null)}>Cancel</button>
        </div>
        <p className="muted" style={{ fontSize: ".85rem", textAlign: "center" }}>…or pick one from the website gallery:</p>
        <div className="cropasp">{CATS.map((x) => <button key={x} type="button" className={cat === x ? "on" : ""} onClick={() => setCat(x)}>{x}</button>)}</div>
        <div className="pickgrid">
          {!c ? <p>Loading…</p> : all.map((p) => (
            <button type="button" key={p.raw} className={"pickit" + (pick.includes(p.raw) ? " on" : "")} onClick={() => (multi ? tog(p.raw) : onDone({ src: p.raw }))}>
              <img src={mediaUrl(p.src)} alt="" loading="lazy" />{multi && pick.includes(p.raw) && <b className="tick">{pick.indexOf(p.raw) + 1}</b>}
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
  const choose = useCallback((opts) => new Promise((resolve) => setJob({ resolve, multi: !!(opts && opts.multi) })), []);
  const el = job ? <Picker multi={job.multi} onDone={(r) => { job.resolve(r); setJob(null); }} /> : null;
  return [el, choose];
}
