"use client";
import { useState } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "";
export default function BookingForm({ defaultService = "" }) {
  const [state, setState] = useState({ status: "idle", msg: "" });
  async function onSubmit(e) {
    e.preventDefault();
    setState({ status: "sending", msg: "" });
    const data = Object.fromEntries(new FormData(e.target));
    try {
      const res = await fetch(`${API}/api/booking`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setState({ status: "ok", msg: "Thank you. Your request has been sent and Sara will be in touch soon." });
      e.target.reset();
    } catch (err) {
      setState({ status: "err", msg: err.message + ". Please try again or contact Sara directly." });
    }
  }
  return (
    <form className="book" onSubmit={onSubmit}>
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" />
      <div className="two">
        <label>Full name<input name="name" required maxLength={100} /></label>
        <label>Email<input name="email" type="email" required maxLength={150} /></label>
      </div>
      <div className="two">
        <label>Phone / WhatsApp<input name="phone" maxLength={40} /></label>
        <label>I'd like to book
          <select name="service" defaultValue={defaultService} required>
            <option value="" disabled>Choose…</option>
            <option>Ayurveda consultation</option>
            <option>Yoga therapy (private session)</option>
            <option>Retreat or workshop enquiry</option>
            <option>Private group / tailored experience</option>
            <option>Other</option>
          </select>
        </label>
      </div>
      <div className="two">
        <label>Format
          <select name="format" defaultValue="In person"><option>In person</option><option>Online</option></select>
        </label>
        <label>Preferred date / time<input name="when" placeholder="e.g. Weekday mornings" maxLength={120} /></label>
      </div>
      <label>Anything you'd like Sara to know?<textarea name="message" rows={4} maxLength={2000} /></label>
      <button className="btn" disabled={state.status === "sending"}>{state.status === "sending" ? "Sending…" : "Send booking request"}</button>
      {state.msg && <div className={"msg " + (state.status === "ok" ? "ok" : "err")}>{state.msg}</div>}
    </form>
  );
}
