"use client";
import useSettings from "./useSettings";
export default function ContactDetails() {
  const site = useSettings();
  return (
    <>
      <p><strong>{site.name}</strong><br />{site.location}<br />Consultations available in person and online</p>
      <p>
        {site.email && <>Email: <a href={`mailto:${site.email}`}>{site.email}</a><br /></>}
        {site.phone && <>Telephone and WhatsApp: <a href={site.whatsapp ? `https://wa.me/${site.whatsapp}` : `tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a></>}
        {site.instagram && <><br />Instagram: <a href={`https://instagram.com/${site.instagram}`}>@{site.instagram}</a></>}
      </p>
    </>
  );
}
