"use client";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
const API = process.env.NEXT_PUBLIC_API_URL || "";
// Contact details: defaults from lib/site.js, overridden by what's saved in the admin dashboard.
export default function useSettings() {
  const [s, setS] = useState(site);
  useEffect(() => {
    if (!API) return;
    fetch(`${API}/api/settings`).then((r) => (r.ok ? r.json() : {})).then((d) => {
      if (d && typeof d === "object") setS((cur) => ({ ...cur, ...Object.fromEntries(Object.entries(d).filter(([, v]) => v)) }));
    }).catch(() => {});
  }, []);
  return s;
}
