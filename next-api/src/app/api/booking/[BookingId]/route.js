import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

// GET: Get detail Bookings by ID
export async function GET(request, { params }) {
  const bookingId = parseInt(params.BookingId);

  if (isNaN(bookingId)) {
    return NextResponse.json(
      { success: false, message: "Invalid Booking ID" },
      { status: 400 }
    );
  }

  const booking = await prisma.bookings.findUnique({
    where: { BookingId: bookingId },
    include: {
      createdByUser: true,
      workorder: true,
    },
  });

  if (!booking) {
    return NextResponse.json(
      {
        success: false,
        message: "Booking not found",
        data: null,
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "Detail Booking",
      data: booking,
    },
    { status: 200 }
  );
}

export async function PATCH(request, { params }) {
    const bookingId = parseInt(params.BookingId); // ✅ perbaikan
    const body = await request.json();
  
    // if (!body.CreatedBy || !body.WOID) {
    //   return NextResponse.json(
    //     { success: false, message: "CreatedBy and WOID are required." },
    //     { status: 400 }
    //   );
    // }
  
    try {
      const updatedBooking = await prisma.bookings.update({
        where: { BookingId: bookingId },
        data: {
          BookingStatus: body.BookingStatus,
        //   WOID: body.WOID,
          ScheduleJeopardy: body.ScheduleJeopardy,
          ScheduleJeopardyTime: body.ScheduleJeopardyTime ? new Date(body.ScheduleJeopardyTime) : null,
          DoNotDisturb: body.DoNotDisturb,
          CeScheduleChange: body.CeScheduleChange,
        //   CreatedBy: body.CreatedBy,
          TotalBillableDurationInMinutes: body.TotalBillableDurationInMinutes ?? 0,
          TotalInProgressDurationInMinutes: body.TotalInProgressDurationInMinutes ?? 0,
          TotalBreakDurationInMinutes: body.TotalBreakDurationInMinutes ?? 0,
        },
      });
  
      return NextResponse.json(
        {
          success: true,
          message: "Booking updated successfully",
          data: updatedBooking,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("🔥 Error updating Booking:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update Booking",
          error: error.message,
        },
        { status: 500 }
      );
    }
  }

// DELETE: Delete Booking by ID
export async function DELETE(request, { params }) {
  const bookingId = parseInt(params.BookingId);

  try {
    const deleted = await prisma.bookings.delete({
      where: { BookingId: bookingId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Booking deleted successfully",
        data: deleted,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete Booking. It may not exist.",
        error: error.message,
      },
      { status: 404 }
    );
  }
}
