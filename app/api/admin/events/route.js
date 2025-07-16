import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { generateEventQRId } from "@/lib/qr-utils";

export async function GET(request) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const events = await prisma.event.findMany({
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
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      description,
      location,
      date,
      startTime,
      endTime,
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
        expectedVolunteers,
        safetyInstructions,
        isFeatured: !!isFeatured,
        imageUrl: imageUrl || null,
        qrCode,
        creatorId: decoded.userId,
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
