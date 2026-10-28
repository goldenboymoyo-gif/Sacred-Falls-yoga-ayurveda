"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { API, loadContent, mediaUrl } from "./useContent";
import { nav } from "@/lib/site";
import useCrop from "./Cropper";

const TEXT = "h1,h2,h3,h4,h5,h6,p,li,a,button,span,label,figcaption,blockquote,small,strong,em,dt,dd";
const hash = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };
const skip = (el) => el.closest(".adm,.lightbox,[data-noedit],.sfbar");

// Walk the page and give every text leaf / image a stable key: scope|index|hash(original)
function scan(path) {
  const out = [];
  for (const [scope, root] of [["g", document.querySelector("header")], [path, document.querySelector("main")], ["g", document.querySelector("footer")]]) {
    if (!root) continue;
    let ti = 0, ii = 0;
    root.querySelectorAll(TEXT + ",img").forEach((el) => {
      if (skip(el)) return;
      if (el.tagName === "IMG") {
        if (el.closest(".masonry")) return;
        if (!el.dataset.o) el.dataset.o = el.getAttribute("src");
        out.push({ el, type: "img", key: `${scope}|i${ii++}|${hash(el.dataset.o)}` });
      } else if (!el.children.length && el.textContent.trim()) {
        if (el.dataset.o === undefined) el.dataset.o = el.textContent;
        out.push({ el, type: "text", key: `${scope}|t${ti++}|${hash(el.dataset.o)}` });
      } else if (el.children.length) {
        ti++; // keep indexes stable for mixed elements
      }
    });
  }
  return out;
}
const setText = (el, v) => { if (el.childNodes.length === 1 && el.firstChild.nodeType === 3) el.firstChild.nodeValue = v; else el.textContent = v; };

function shrink(file, max = 1600) {
  return new Promise((resolve, reject) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas"); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url); resolve(c.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => reject(new Error("Could not read that image"));
    img.src = url;
  });
}

export default function SiteEditor() {
  const path = usePathname();
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [edit, setEdit] = useState(false);
  const [msg, setMsg] = useState("");
  const [cropEl, ask] = useCrop();
  const [dirty, setDirty] = useState(0);
  const content = useRef(null);
  const items = useRef([]);
  const sel = useRef(null);
  const pending = useRef({ text: {}, img: {} });
  const hideRef = useRef(null);
  const editRef = useRef(false);
  editRef.current = edit;

  useEffect(() => { try { setToken(sessionStorage.getItem("sfAdminToken")); } catch {} }, []);

  const apply = useCallback(() => {
    const c = content.current; if (!c) return;
    items.current = scan(path);
    if (!hideRef.current) hideRef.current = new Set(c.hide || []);
    const hide = hideRef.current;
    items.current.forEach(({ el, type, key }) => {
      const p = pending.current;
      if (type === "text") {
        const v = key in p.text ? p.text[key] : c.text[key];
        if (v !== undefined && el.textContent !== v && document.activeElement !== el) setText(el, v);
      } else {
        const v = key in p.img ? p.img[key] : c.img[key];
        if (v) { const u = mediaUrl(v); if (el.getAttribute("src") !== u) { el.setAttribute("src", u); el.removeAttribute("srcset"); } }
      }
      const h = hide.has(key);
      el.classList.toggle("sf-hidden", h && !editRef.current);
      el.classList.toggle("sf-ghost", h && editRef.current);
    });
  }, [path]);

  useEffect(() => {
    let alive = true, n = 0;
    loadContent().then((c) => { if (!alive) return; content.current = c; apply(); });
    const iv = setInterval(() => { if (alive && content.current) apply(); if (++n > 6) clearInterval(iv); }, 500);
    return () => { alive = false; clearInterval(iv); };
  }, [path, apply]);

  // edit mode wiring
  useEffect(() => {
    if (!edit) return;
    document.body.classList.add("sfedit");
    apply();
    const els = items.current;
    els.forEach(({ el, type }) => {
      el.classList.add(type === "img" ? "sf-img" : "sf-text");
      if (type === "text") { el.contentEditable = "true"; el.spellcheck = false; }
    });
    const find = (t) => items.current.find((i) => i.el === t || i.el.contains(t));
    const onClick = (e) => {
      if (e.target.closest(".sfbar")) return;
      const it = find(e.target);
      const inSite = e.target.closest("header,main,footer");
      if (inSite) { if (e.target.closest("a,button,label,input,select,textarea,summary") || it) e.preventDefault(); }
      if (!it) return;
      sel.current = it;
      document.querySelectorAll(".sf-sel").forEach((x) => x.classList.remove("sf-sel"));
      it.el.classList.add("sf-sel");
      if (it.type === "img") { e.stopPropagation(); pick(it); }
    };
    const onInput = (e) => {
      const it = items.current.find((i) => i.el === e.target || i.el.contains(e.target));
      if (it && it.type === "text") { pending.current.text[it.key] = it.el.textContent; setDirty((d) => d + 1); }
    };
    const onKey = (e) => { if (e.key === "Enter" && e.target.isContentEditable) { e.preventDefault(); e.target.blur(); } };
    const onPaste = (e) => { if (e.target.isContentEditable) { e.preventDefault(); document.execCommand("insertText", false, (e.clipboardData || window.clipboardData).getData("text/plain")); } };
    document.addEventListener("click", onClick, true);
    document.addEventListener("input", onInput, true);
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("paste", onPaste, true);
    return () => {
      document.body.classList.remove("sfedit");
      document.removeEventListener("click", onClick, true); document.removeEventListener("input", onInput, true);
      document.removeEventListener("keydown", onKey, true); document.removeEventListener("paste", onPaste, true);
      els.forEach(({ el }) => { el.classList.remove("sf-img", "sf-text", "sf-sel"); el.removeAttribute("contenteditable"); });
    };
  }, [edit, path, apply]);

  function pick(it) {
    const inp = document.createElement("input"); inp.type = "file"; inp.accept = "image/*";
    inp.onchange = async () => {
      const f = inp.files && inp.files[0]; if (!f) return;
      setMsg("Uploading photo…");
      try {
        const data = await ask(f); if (!data) { setMsg(""); return; }
        const r = await fetch(`${API}/api/admin/upload`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ data }) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || "Upload failed");
        pending.current.img[it.key] = j.url; it.el.setAttribute("src", mediaUrl(j.url)); it.el.removeAttribute("srcset");
        setDirty((d) => d + 1); setMsg("Photo ready. Press Save to publish.");
      } catch (e) { setMsg(e.message); }
    };
    inp.click();
  }

  function toggleHide() {
    const it = sel.current; if (!it) { setMsg("Click something on the page first."); return; }
    const h = hideRef.current;
    if (h.has(it.key)) h.delete(it.key); else h.add(it.key);
    apply(); setDirty((d) => d + 1);
  }

  async function save() {
    setMsg("Saving…");
    try {
      const g = await fetch(`${API}/api/admin/content`, { headers: { Authorization: `Bearer ${token}` } });
      if (g.status === 401) throw new Error("Session expired, sign in again at /admin");
      const cur = (await g.json()).content;
      const p = pending.current;
      const next = { ...cur, text: { ...cur.text, ...p.text }, img: { ...cur.img, ...p.img },
        hide: [...(hideRef.current || [])] };
      // revert-to-original means no override needed
      Object.keys(next.text).forEach((k) => { const it = items.current.find((i) => i.key === k); if (it && it.el.dataset.o === next.text[k]) delete next.text[k]; });
      const r = await fetch(`${API}/api/admin/content`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ content: next }) });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Save failed");
      content.current = (await r.json()).content; hideRef.current = new Set(content.current.hide);
      pending.current = { text: {}, img: {} };
      setDirty(0); setMsg("Saved. Visitors see it within about a minute.");
    } catch (e) { setMsg(e.message); }
  }

  if (!token) return null;
  const go = (href) => { if (dirty && !confirm("You have unsaved changes. Leave this page?")) return; router.push(href); };
  if (!edit) return <button className="sfbar sffab" onClick={() => setEdit(true)}>Edit this page</button>;
  return (
    <>
    {cropEl}
    <div className="sfbar">
      <select value={nav.some((n) => n.href === path) ? path : ""} onChange={(e) => go(e.target.value)} aria-label="Go to page">
        {!nav.some((n) => n.href === path) && <option value="">Page…</option>}
        {nav.map((n) => <option key={n.href} value={n.href}>{n.label}</option>)}
      </select>
      <span className="sfhint">Click text to edit it. Click a photo to replace it.</span>
      <button onClick={toggleHide}>Hide / show selected</button>
      <button className="go" onClick={save}>Save{dirty ? " •" : ""}</button>
      <a href="/admin">Dashboard</a>
      <button onClick={() => { if (!dirty || confirm("Exit and lose unsaved changes?")) { pending.current = { text: {}, img: {} }; setDirty(0); setEdit(false); location.reload(); } }}>Exit</button>
      {msg && <span className="sfmsg">{msg}</span>}
    </div>
    </>
  );
}
