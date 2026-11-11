"use client";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

const BASE = "https://www.sacredfallsayurveda.com";
const ART = "https://www.thearthousevictoriafalls.com/";
const crumbs = { "/ayurveda": "Ayurveda Consultations", "/yoga-therapy": "Yoga Therapy", "/food": "Food", "/retreats": "Retreats", "/gallery": "Gallery", "/treatments": "Treatments and Chavutti Uzhichil", "/contact": "Contact" };
const services = {
  "/ayurveda": { name: "Ayurveda consultation", description: "Personal Ayurveda consultations, in person or online, exploring constitution, digestion, sleep, energy and daily routine." },
  "/yoga-therapy": { name: "Yoga therapy", description: "Private yoga therapy sessions adapted to your needs, using poses, breath, relaxation, meditation and mudras." },
  "/treatments": { name: "Chavutti Uzhichil and Ayurvedic treatments", description: "Traditional Kerala Chavutti Uzhichil bodywork and warm herbal oil Ayurvedic treatments." },
  "/retreats": { name: "Ayurveda and yoga retreats and wellness safari experiences", description: "Ayurveda and yoga immersion retreats and wellness safari experiences in Zimbabwe and worldwide." },
};

export default function Schema() {
  const path = (usePathname() || "/").replace(/\/$/, "") || "/";
  if (path.startsWith("/admin")) return null;
  const biz = {
    "@type": ["HealthAndBeautyBusiness", "LocalBusiness"], "@id": BASE + "/#business",
    name: site.name, url: BASE + "/", telephone: site.phone, image: BASE + "/images/hero.jpg", logo: BASE + "/logo.png",
    description: "Ayurveda consultations, yoga therapy, traditional treatments and wellness retreats in Victoria Falls, Zimbabwe.",
    address: { "@type": "PostalAddress", streetAddress: "360 Gibson Road", addressLocality: "Victoria Falls", addressCountry: "ZW" },
    areaServed: ["Victoria Falls", "Zimbabwe"], founder: { "@id": BASE + "/#sara" }, sameAs: [ART],
  };
  const sara = {
    "@type": "Person", "@id": BASE + "/#sara", name: "Sara Norton", jobTitle: "Ayurveda Practitioner, Yoga Teacher and Yoga Therapist",
    worksFor: { "@id": BASE + "/#business" }, url: BASE + "/#about-sara", image: BASE + "/images/sara.jpg",
    knowsAbout: ["Ayurveda", "Yoga therapy", "Chavutti Uzhichil", "Kalarippayattu bodywork"],
  };
  const graph = [biz, sara];
  if (services[path]) graph.push({ "@type": "Service", ...services[path], provider: { "@id": BASE + "/#business" }, areaServed: "Victoria Falls, Zimbabwe", url: BASE + path });
  if (crumbs[path]) graph.push({ "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: BASE + "/" }, { "@type": "ListItem", position: 2, name: crumbs[path], item: BASE + path }] });
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }) }} />;
}
