"use client";
import { useEffect, useState } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "";
const fallback = [
  "Ayurveda and yoga retreats",
  "Seasonal cleansing and self care workshops",
  "Ayurvedic cooking demonstrations",
  "Yoga and meditation classes",
  "Private groups and tailored wellness experiences",
];
export default function Events() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    fetch(`${API}/api/events`).then((r) => (r.ok ? r.json() : [])).then((d) => Array.isArray(d) && setEvents(d)).catch(() => {});
  }, []);
  if (!events.length) return <ul className="list">{fallback.map((f) => <li key={f}>{f}</li>)}</ul>;
  return (
    <div className="events">
      {events.map((e, i) => (
        <div className="event" key={i}>
          <div className="when">{e.date}</div>
          <div><h3>{e.title}</h3>{e.location && <p className="muted">{e.location}</p>}{e.description && <p>{e.description}</p>}{e.image && <img className="evimg" src={e.image.startsWith("/api/") ? `${API}${e.image}` : e.image} alt={e.title} loading="lazy" />}{e.link && <p><a className="textlink" href={e.link} target="_blank" rel="noopener noreferrer">More details and booking</a></p>}</div>
        </div>
      ))}
    </div>
  );
}
