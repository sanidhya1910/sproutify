import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const prisma = await getPrisma()
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

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
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const existing = await prisma.event.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 })
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
        expectedVolunteers: expectedVolunteers ? parseInt(expectedVolunteers, 10) : null,
        safetyInstructions,
        isFeatured: !!isFeatured,
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
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const event = await prisma.event.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

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
