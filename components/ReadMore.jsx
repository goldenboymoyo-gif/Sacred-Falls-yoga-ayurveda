"use client";
import { useState } from "react";
// On phones the text is shortened with a "Read more" button; on larger screens it shows in full.
export default function ReadMore({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={"rm" + (open ? " open" : "")}>
      <div className="rmbody">{children}</div>
      <button type="button" className="rmbtn" data-noedit onClick={() => setOpen(!open)}>{open ? "Show less" : "Read more"}</button>
    </div>
  );
}
