import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

/**
 * Shared role gate for the event-management API surface (events, attendance,
 * dashboard). ADMIN sees and manages everything; ORGANIZER (an NGO host) is
 * scoped to events they created. The platform-wide surfaces — volunteers
 * directory, contact inbox — stay ADMIN-only and don't use this helper.
 *
 * Returns `{ decoded, isAdmin, isHost }` on success, or a NextResponse to
 * return directly on failure — callers do:
 *
 *   const auth = requireEventManager(request)
 *   if (auth instanceof NextResponse) return auth
 */
export function requireEventManager(request) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded || (decoded.role !== "ADMIN" && decoded.role !== "ORGANIZER")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return { decoded, isAdmin: decoded.role === "ADMIN", isHost: decoded.role === "ORGANIZER" };
}

/**
 * A host may only act on events they created. Returns a 403 NextResponse if
 * an ORGANIZER doesn't own `event`, otherwise null. ADMIN always passes.
 */
export function forbidIfNotOwner(auth, event) {
  if (auth.isHost && event.creatorId !== auth.decoded.userId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  return null;
}
