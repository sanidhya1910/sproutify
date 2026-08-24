import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { generateEventQRId } from "@/lib/qr-utils";
import { requireEventManager } from "@/lib/admin-auth";

// Mirrors the EventType enum in prisma/schema.prisma. Anything unrecognised
// falls back to OTHER rather than throwing a Prisma enum error at the client.
const VALID_TYPES = new Set([
  "CLEANUP",
  "PLANTATION",
  "EWASTE",
  "RESTORATION",
  "COMMUNITY",
  "OTHER",
]);

export async function GET(request) {
  try {
    const prisma = await getPrisma();
    const auth = requireEventManager(request);
    if (auth instanceof NextResponse) return auth;

    const events = await prisma.event.findMany({
      // A host sees only what they created; an admin sees the platform.
      where: auth.isHost ? { creatorId: auth.decoded.userId } : undefined,
      orderBy: {
        date: "desc",
      },
      include: {
        _count: {
          select: {
            registrations: true,
            attendances: true,
          },
        },
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Events fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const prisma = await getPrisma();
    const auth = requireEventManager(request);
    if (auth instanceof NextResponse) return auth;

    const {
      title,
      description,
      location,
      date,
      startTime,
      endTime,
      type,
      expectedVolunteers,
      safetyInstructions,
      isFeatured,
      imageUrl,
    } = await request.json();

    // Validate required fields
    if (
      !title ||
      !description ||
      !location ||
      !date ||
      !startTime ||
      !endTime
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate date is not in the past
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (eventDate < today) {
      return NextResponse.json(
        { message: "Event date cannot be in the past" },
        { status: 400 }
      );
    }

    // Generate unique QR code
    const qrCode = generateEventQRId();

    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        date: new Date(date),
        startTime,
        endTime,
        type: VALID_TYPES.has(type) ? type : 'OTHER',
        expectedVolunteers: expectedVolunteers ? parseInt(expectedVolunteers, 10) : null,
        safetyInstructions,
        // Sitewide featured placement is an admin call, not self-service —
        // a host featuring their own event on the homepage without review
        // would be a moderation hole.
        isFeatured: auth.isAdmin ? !!isFeatured : false,
        imageUrl: imageUrl || null,
        qrCode,
        creatorId: auth.decoded.userId,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Event creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
