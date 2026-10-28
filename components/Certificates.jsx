"use client";
import { useState } from "react";
import base from "@/lib/certs.json";
import useContent, { mediaUrl } from "./useContent";

export default function Certificates() {
  const ct = useContent();
  const c = ct.certs || { add: [], remove: [], edit: {} };
  const rm = new Set(c.remove || []);
  const list = [...base, ...(c.add || [])].filter((x) => !rm.has(x.src)).map((x) => ({ ...x, title: (c.edit || {})[x.src] || x.title }));
  const [open, setOpen] = useState(null);
  return (
    <>
      <div className="certs">
        {list.map((x) => (
          <figure className="certfig" key={x.src}>
            <button type="button" onClick={() => setOpen(x)} aria-label={`View certificate: ${x.title}`}>
              <img src={mediaUrl(x.src)} alt={`Certificate: ${x.title}`} loading="lazy" />
            </button>
            <figcaption>{x.title}</figcaption>
          </figure>
        ))}
      </div>
      <p className="muted" style={{ marginTop: "1rem" }}><em>We are awaiting further certificates, which will be added here as soon as they are received.</em></p>
      {open && (
        <div className="lightbox" onClick={() => setOpen(null)} role="dialog" aria-modal="true">
          <button className="lb x" onClick={() => setOpen(null)} aria-label="Close">✕</button>
          <img src={mediaUrl(open.src)} alt={open.title} onClick={(e) => e.stopPropagation()} />
          <div className="count">{open.title}</div>
        </div>
      )}
    </>
  );
}
