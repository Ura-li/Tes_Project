import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

// ✅ GET BookingStatus by BookingStatusId
export async function GET(req, { params }) {
  try {
    const { BookingStatusId } = params;
    const status = await prisma.BookingStatus.findUnique({
      where: { BookingStatusId: Number(BookingStatusId) },
    });

    if (!status) {
      return NextResponse.json(
        { success: false, message: "BookingStatus not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: status });
  } catch (error) {
    console.error("Error fetching BookingStatus:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch BookingStatus" },
      { status: 500 }
    );
  }
}

// ✅ PUT update BookingStatus
export async function PUT(req, { params }) {
  try {
    const { BookingStatusId } = params;
    const body = await req.json();
    const { Description } = body;

    const updated = await prisma.BookingStatus.update({
      where: { BookingStatusId: Number(BookingStatusId) },
      data: { Description },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error updating BookingStatus:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update BookingStatus" },
      { status: 500 }
    );
  }
}

// ✅ DELETE BookingStatus
export async function DELETE(req, { params }) {
  try {
    const { BookingStatusId } = params;
    await prisma.BookingStatus.delete({
      where: { BookingStatusId: Number(BookingStatusId) },
    });

    return NextResponse.json({
      success: true,
      message: "BookingStatus deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting BookingStatus:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete BookingStatus" },
      { status: 500 }
    );
  }
}