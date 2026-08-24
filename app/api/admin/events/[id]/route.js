import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { requireEventManager, forbidIfNotOwner } from "@/lib/admin-auth";

// Mirrors the EventType enum in prisma/schema.prisma.
const VALID_TYPES = new Set([
  "CLEANUP",
  "PLANTATION",
  "EWASTE",
  "RESTORATION",
  "COMMUNITY",
  "OTHER",
]);

export async function GET(request, { params }) {
  try {
    const prisma = await getPrisma()
    const auth = requireEventManager(request)
    if (auth instanceof NextResponse) return auth

    const event = await prisma.event.findUnique({
      where: {
        id: params.id,
      },
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        attendances: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            registrations: true,
            attendances: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    const forbidden = forbidIfNotOwner(auth, event)
    if (forbidden) return forbidden

    return NextResponse.json(event);
  } catch (error) {
    console.error("Event fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const prisma = await getPrisma()
    const auth = requireEventManager(request)
    if (auth instanceof NextResponse) return auth

    const existing = await prisma.event.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 })
    }

    const forbidden = forbidIfNotOwner(auth, existing)
    if (forbidden) return forbidden

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
    } = await request.json()

    if (!title || !description || !location || !date || !startTime || !endTime) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    if (startTime >= endTime) {
      return NextResponse.json({ message: 'End time must be after start time' }, { status: 400 })
    }

    const event = await prisma.event.update({
      where: { id: params.id },
      data: {
        title,
        description,
        location,
        date: new Date(date),
        startTime,
        endTime,
        type: VALID_TYPES.has(type) ? type : undefined,
        expectedVolunteers: expectedVolunteers ? parseInt(expectedVolunteers, 10) : null,
        safetyInstructions,
        // Same reasoning as create: a host cannot self-feature.
        isFeatured: auth.isAdmin ? !!isFeatured : existing.isFeatured,
        imageUrl: imageUrl || null,
      },
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error('Event update error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const prisma = await getPrisma()
    const auth = requireEventManager(request)
    if (auth instanceof NextResponse) return auth

    const event = await prisma.event.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    const forbidden = forbidIfNotOwner(auth, event)
    if (forbidden) return forbidden

    await prisma.event.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Event deletion error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
