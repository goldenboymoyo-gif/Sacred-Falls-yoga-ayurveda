"use client";
import { usePathname, useRouter } from "next/navigation";
export default function BackButton() {
  const path = usePathname();
  const router = useRouter();
  if (path === "/") return null;
  const back = () => (window.history.length > 1 ? router.back() : router.push("/"));
  return (
    <div className="wrap backbar">
      <button type="button" className="backbtn" onClick={back}>Back</button>
    </div>
  );
}
