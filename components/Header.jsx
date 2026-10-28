"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { nav, site } from "@/lib/site";
export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname() || "/";
  const on = (h) => (h === "/" ? path === "/" : path === h || path.startsWith(h + "/"));
  return (
    <header className="top">
      <div className="wrap bar">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <img src="/logo.png" alt="Sacred Falls Ayurveda and Yoga" />
        </Link>
        <button className="burger" aria-label="Menu" onClick={() => setOpen(!open)}>{open ? "✕" : "☰"}</button>
        <nav className={"main" + (open ? " open" : "")}>
          <div className="links">
            {nav.map((n) => (<Link key={n.href} href={n.href} className={on(n.href) ? "active" : undefined} aria-current={on(n.href) ? "page" : undefined} onClick={() => setOpen(false)}>{n.label}</Link>))}
          </div>
          <Link href="/contact#book" className="btn" onClick={() => setOpen(false)}>Book now</Link>
        </nav>
      </div>
    </header>
  );
}
