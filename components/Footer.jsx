"use client";
import Link from "next/link";
import { nav } from "@/lib/site";
import useSettings from "./useSettings";
export default function Footer() {
  const site = useSettings();
  return (
    <>
      {site.whatsapp && <a className="wa" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener">WhatsApp</a>}
      <footer>
        <div className="wrap">
          <div className="fgrid">
            <div><img className="footlogo" src="/logo.png" alt="Sacred Falls Ayurveda and Yoga" /><h3>{site.name}</h3><p>Return to your natural rhythm.</p></div>
            <div><h3>Explore</h3>{nav.map((n) => (<div key={n.href}><Link href={n.href}>{n.label}</Link></div>))}</div>
            <div><h3>Contact</h3>
              <p>{site.location}<br />At <a href="https://www.thearthousevictoriafalls.com/" target="_blank" rel="noopener noreferrer">The Art House</a>, 360 Gibson Road<br />Consultations in person and online
                {site.email && <><br /><a href={`mailto:${site.email}`}>{site.email}</a></>}
                {site.phone && <><br /><a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a></>}
                {site.instagram && <><br /><a href={`https://instagram.com/${site.instagram}`}>@{site.instagram}</a></>}</p></div>
          </div>
          <div className="copy">© {new Date().getFullYear()} {site.name}. All rights reserved.</div>
        </div>
      </footer>
    </>
  );
}
