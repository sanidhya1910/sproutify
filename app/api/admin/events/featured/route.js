import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

// Intentionally public — powers the homepage's featured-events section.
// Only safe, non-PII fields are selected.
export async function GET(request) {
  try {
    const prisma = await getPrisma();
    const events = await prisma.event.findMany({
      where: {
        isFeatured: true,
      },
      orderBy: {
        date: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        location: true,
        date: true,
        startTime: true,
        endTime: true,
        imageUrl: true,
        isFeatured: true,
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
