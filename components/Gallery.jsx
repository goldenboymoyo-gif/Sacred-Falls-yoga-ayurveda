"use client";
import { useState, useEffect, useCallback } from "react";
import base from "@/lib/gallery.json";
import useContent, { mediaUrl } from "./useContent";

const cats = ["All", "Chavutti", "Treatments", "Yoga", "Gatherings", "Consultations", "Tea"];

export default function Gallery() {
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState(-1);
  const ct = useContent();
  const rm = new Set(ct.gallery.remove);
  const photos = [...base, ...ct.gallery.add.map((a) => ({ ...a, src: mediaUrl(a.src), raw: a.src }))].filter((p) => !rm.has(p.raw || p.src));
  const list = photos.filter((p) => cat === "All" || p.cat === cat);
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
      <div className="tabs">
        {cats.map((c) => (
          <button key={c} className={c === cat ? "on" : ""} onClick={() => { setCat(c); setOpen(-1); }}>{c}</button>
        ))}
      </div>
      <div className="masonry">
        {list.map((p, i) => (
          <button className="gitem" key={p.src} onClick={() => setOpen(i)} aria-label={`Open photo ${i + 1}`}>
            <img src={p.src} width={p.w} height={p.h} alt={`${p.cat} photo ${i + 1}`} loading="lazy" decoding="async" />
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
