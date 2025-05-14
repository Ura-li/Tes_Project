import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

// GET: Get detail BookingDetails by ID
export async function GET(request, { params }) {
  const bookingDetailId = parseInt(params.BookingDetailId);

  if (isNaN(bookingDetailId)) {
    return NextResponse.json(
      { success: false, message: "Invalid BookingDetail ID" },
      { status: 400 }
    );
  }

  const bookingDetail = await prisma.bookingDetails.findUnique({
    where: { BookingDetailId: bookingDetailId },
    include: {
      resource: true,
      resourceaccount: true,
      subkTechnician: true,
      booking: true,
    },
  });

  if (!bookingDetail) {
    return NextResponse.json(
      {
        success: false,
        message: "BookingDetail not found",
        data: null,
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "Detail BookingDetail",
      data: bookingDetail,
    },
    { status: 200 }
  );
}

// PATCH: Update BookingDetail by ID
export async function PATCH(request, { params }) {
  const bookingDetailId = parseInt(params.BookingDetailId);
  const body = await request.json();

  try {
    const updated = await prisma.bookingDetails.update({
      where: { BookingDetailId: bookingDetailId },
      data: {
        BookingId: body.BookingId,
        ResourceId: body.ResourceId,
        ResourceAccountId: body.ResourceAccountId,
        SubkTechnicianId: body.SubkTechnicianId,
        Name: body.Name,
        Status: body.Status,

        StartTimeCustomerTime: body.StartTimeCustomerTime ? new Date(body.StartTimeCustomerTime) : null,
        EndTimeCustomerTime: body.EndTimeCustomerTime ? new Date(body.EndTimeCustomerTime) : null,
        EstimatedArrivalTimeCustomerTime: body.EstimatedArrivalTimeCustomerTime ? new Date(body.EstimatedArrivalTimeCustomerTime) : null,
        ActualArrivalTimeCustomerTime: body.ActualArrivalTimeCustomerTime ? new Date(body.ActualArrivalTimeCustomerTime) : null,

        StartTimeUserTime: body.StartTimeUserTime ? new Date(body.StartTimeUserTime) : null,
        EndTimeUserTime: body.EndTimeUserTime ? new Date(body.EndTimeUserTime) : null,
        DurationInMinutesUserTime: body.DurationInMinutesUserTime,
        EstimatedArrivalTimeUserTime: body.EstimatedArrivalTimeUserTime ? new Date(body.EstimatedArrivalTimeUserTime) : null,
        ActualArrivalTimeUserTime: body.ActualArrivalTimeUserTime ? new Date(body.ActualArrivalTimeUserTime) : null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "BookingDetail updated successfully",
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 Error updating BookingDetail:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update BookingDetail",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete BookingDetail by ID
export async function DELETE(request, { params }) {
  const bookingDetailId = parseInt(params.BookingDetailId);

  try {
    const deleted = await prisma.bookingDetails.delete({
      where: { BookingDetailId: bookingDetailId },
    });

    return NextResponse.json(
      {
        success: true,
        message: "BookingDetail deleted successfully",
        data: deleted,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete BookingDetail. It may not exist.",
        error: error.message,
      },
      { status: 404 }
    );
  }
}