import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
    
// ✅ GET all BookingStatus
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase() || "";

    const bookingStatus = await prisma.bookingStatus.findMany({
      where: search
        ? {
            OR: [
              {
                // transform field ke lowercase via Prisma filter
                Description: {
                  contains: search, // tanpa mode
                },
              },
              {
                BookingStatusId: isNaN(parseInt(search))
                  ? undefined
                  : parseInt(search),
              },
            ],
          }
        : undefined,
      orderBy: { BookingStatusId: "asc" },
    });

    return NextResponse.json({ success: true, data: bookingStatus });
  } catch (error) {
    console.error("Error fetching BookingStatus:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch BookingStatus" },
      { status: 500 }
    );
  }
}

// ✅ POST create BookingStatus
export async function POST(req) {
  try {
    const body = await req.json();
    const { Description } = body;

    if (!Description) {
      return NextResponse.json(
        { success: false, message: "Description is required" },
        { status: 400 }
      );
    }

    const newStatus = await prisma.BookingStatus.create({
      data: { Description },
    });

    return NextResponse.json({ success: true, data: newStatus });
  } catch (error) {
    console.error("Error creating BookingStatus:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create BookingStatus" },
      { status: 500 }
    );
  }
}