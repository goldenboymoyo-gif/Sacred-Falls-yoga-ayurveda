"use client";
import { useEffect, useRef, useState, useCallback } from "react";

const ASPECTS = [["Original", 0], ["Square", 1], ["4:3", 4 / 3], ["3:4", 3 / 4], ["16:9", 16 / 9]];

function CropModal({ file, onDone, onCancel }) {
  const [img, setImg] = useState(null);
  const [asp, setAsp] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [off, setOff] = useState({ x: 0, y: 0 });
  const cv = useRef(null), drag = useRef(null);
  const W = typeof window === "undefined" ? 480 : Math.min(480, window.innerWidth - 48);

  useEffect(() => {
    const im = new Image(), u = URL.createObjectURL(file);
    im.onload = () => setImg(im);
    im.onerror = () => onCancel(new Error("Could not read that image"));
    im.src = u;
    return () => URL.revokeObjectURL(u);
  }, [file]);

  const a = img ? (asp || img.width / img.height) : 1;
  const H = Math.round(Math.min(W / a, window.innerHeight * 0.55));
  const FW = Math.round(H * a) > W ? W : Math.round(H * a);
  const FH = Math.round(FW / a);
  const base = img ? Math.max(FW / img.width, FH / img.height) : 1;
  const s = base * zoom;
  const clamp = useCallback((o) => {
    if (!img) return o;
    const mx = Math.max(0, (img.width * s - FW) / 2), my = Math.max(0, (img.height * s - FH) / 2);
    return { x: Math.min(mx, Math.max(-mx, o.x)), y: Math.min(my, Math.max(-my, o.y)) };
  }, [img, s, FW, FH]);
  const o = clamp(off);

  useEffect(() => {
    if (!img || !cv.current) return;
    const c = cv.current, g = c.getContext("2d");
    c.width = FW; c.height = FH;
    g.fillStyle = "#222"; g.fillRect(0, 0, FW, FH);
    g.drawImage(img, FW / 2 + o.x - (img.width * s) / 2, FH / 2 + o.y - (img.height * s) / 2, img.width * s, img.height * s);
  });

  const down = (e) => { drag.current = { x: e.clientX, y: e.clientY, o }; e.currentTarget.setPointerCapture(e.pointerId); };
  const move = (e) => { if (drag.current) setOff({ x: drag.current.o.x + e.clientX - drag.current.x, y: drag.current.o.y + e.clientY - drag.current.y }); };
  const up = () => { drag.current = null; };

  function apply() {
    const k = Math.min(1, 1600 / Math.max(FW / s, FH / s));
    const sw = FW / s, sh = FH / s;
    const sx = img.width / 2 - o.x / s - sw / 2, sy = img.height / 2 - o.y / s - sh / 2;
    const out = document.createElement("canvas");
    out.width = Math.round(sw * k); out.height = Math.round(sh * k);
    out.getContext("2d").drawImage(img, sx, sy, sw, sh, 0, 0, out.width, out.height);
    onDone(out.toDataURL("image/jpeg", 0.86));
  }
  function whole() {
    const k = Math.min(1, 1600 / Math.max(img.width, img.height));
    const out = document.createElement("canvas");
    out.width = Math.round(img.width * k); out.height = Math.round(img.height * k);
    out.getContext("2d").drawImage(img, 0, 0, out.width, out.height);
    onDone(out.toDataURL("image/jpeg", 0.86));
  }

  return (
    <div className="cropback" role="dialog" aria-modal="true">
      <div className="cropbox">
        <h3>Crop photo</h3>
        {!img ? <p>Loading…</p> : (
          <>
            <div className="cropasp">{ASPECTS.map(([l, v]) => <button key={l} type="button" className={asp === v ? "on" : ""} onClick={() => { setAsp(v); setZoom(1); setOff({ x: 0, y: 0 }); }}>{l}</button>)}</div>
            <canvas ref={cv} className="cropcv" style={{ width: FW, height: FH }} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
            <label className="cropzoom">Zoom<input type="range" min="1" max="3" step="0.02" value={zoom} onChange={(e) => setZoom(+e.target.value)} /></label>
            <p className="muted" style={{ fontSize: ".8rem" }}>Drag the photo to move it. Use Zoom to crop closer.</p>
            <div className="row" style={{ justifyContent: "center" }}>
              <button type="button" className="btn" onClick={apply}>Use this crop</button>
              <button type="button" className="backbtn" onClick={whole}>Keep whole photo</button>
              <button type="button" className="backbtn" onClick={() => onCancel()}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// const [cropEl, ask] = useCrop();  ...  const dataUrl = await ask(file) (null if cancelled); render {cropEl}
export default function useCrop() {
  const [job, setJob] = useState(null);
  const ask = useCallback((file) => new Promise((resolve, reject) => setJob({ file, resolve, reject })), []);
  const el = job ? (
    <CropModal file={job.file}
      onDone={(d) => { job.resolve(d); setJob(null); }}
      onCancel={(err) => { err ? job.reject(err) : job.resolve(null); setJob(null); }} />
  ) : null;
  return [el, ask];
}
