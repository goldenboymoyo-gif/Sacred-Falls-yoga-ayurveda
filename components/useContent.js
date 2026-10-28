"use client";
import { useEffect, useState } from "react";
export const API = process.env.NEXT_PUBLIC_API_URL || "";
export const empty = { text: {}, img: {}, hide: [], gallery: { add: [], remove: [], edit: {} }, certs: { add: [], remove: [], edit: {} }, layout: {} };
let cache = null;
export function loadContent(force) {
  if (!cache || force) cache = fetch(`${API}/api/content`, { cache: force ? "no-store" : "default" }).then((r) => (r.ok ? r.json() : empty)).catch(() => empty);
  return cache;
}
export const mediaUrl = (u) => (u && u.startsWith("/api/") ? API + u : u);
export default function useContent() {
  const [c, setC] = useState(empty);
  useEffect(() => { loadContent().then(setC); }, []);
  return c;
}
