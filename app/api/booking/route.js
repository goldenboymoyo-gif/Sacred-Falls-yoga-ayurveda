// Bookings are handled by the Express backend (see /backend). This route is intentionally disabled.
import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json({ error: "Use the booking API" }, { status: 410 });
}
