"use client";
// Big, obvious "working" box. <Busy text="Uploading 3 of 20…" pct={15} />
export default function Busy({ text, pct }) {
  if (!text) return null;
  return (
    <div className="busyback" data-noedit role="status" aria-live="polite">
      <div className="busybox" data-noedit>
        <div className="spin" />
        <strong>{text}</strong>
        {typeof pct === "number" && <div className="bar"><i style={{ width: Math.min(100, Math.max(3, pct)) + "%" }} /></div>}
        <small>Please keep this page open until it finishes.</small>
      </div>
    </div>
  );
}
