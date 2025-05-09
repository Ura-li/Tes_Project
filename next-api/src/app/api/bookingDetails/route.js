import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

// GET: Ambil semua booking details
const toDateOrNull = (value) => {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  };

  
export async function GET(request) {
  try {
    const bookingDetails = await prisma.bookingDetails.findMany({
      orderBy: { BookingDetailId: "asc" },
      include: {
        resource: true,
        resourceaccount: true,
        subkTechnician: true,
        booking: true
      }
    });

    return NextResponse.json({
      success: true,
      status: 200,
      message: "List Data Booking Details",
      data: bookingDetails
    });
  } catch (e) {
    console.error("🔥 ERROR in GET BookingDetails:", e);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch data",
      error: e.message
    }, { status: 500 });
  }
}

// POST: Buat atau update booking detail berdasarkan BookingDetailId
export async function POST(request) {
  try {
    const body = await request.json();

    const {
      BookingDetailId,
      BookingId,
      ResourceId,
      ResourceAccountId,
      SubkTechnicianId,
      Name,
      Status,
      StartTimeCustomerTime,
      EndTimeCustomerTime,
      EstimatedArrivalTimeCustomerTime,
      ActualArrivalTimeCustomerTime,
      StartTimeUserTime,
      EndTimeUserTime,
      DurationInMinutesUserTime,
      EstimatedArrivalTimeUserTime,
      ActualArrivalTimeUserTime,
      ChangedBy
    } = body;

    if (!BookingId || !Name || !Status || ChangedBy == null) {
      return NextResponse.json({
        success: false,
        message: "BookingId, Name, Status, dan ChangedBy wajib diisi."
      }, { status: 400 });
    }

    // Jika BookingDetailId ada, lakukan update
    if (BookingDetailId) {
      const updated = await prisma.bookingDetails.update({
        where: { BookingDetailId },
        data: {
            BookingId,
            ResourceId,
            ResourceAccountId,
            SubkTechnicianId,
            Name,
            Status,
            StartTimeCustomerTime: toDateOrNull(StartTimeCustomerTime),
            EndTimeCustomerTime: toDateOrNull(EndTimeCustomerTime),
            EstimatedArrivalTimeCustomerTime: toDateOrNull(EstimatedArrivalTimeCustomerTime),
            ActualArrivalTimeCustomerTime: toDateOrNull(ActualArrivalTimeCustomerTime),
            StartTimeUserTime: toDateOrNull(StartTimeUserTime),
            EndTimeUserTime: toDateOrNull(EndTimeUserTime),
            DurationInMinutesUserTime,
            EstimatedArrivalTimeUserTime: toDateOrNull(EstimatedArrivalTimeUserTime),
            ActualArrivalTimeUserTime: toDateOrNull(ActualArrivalTimeUserTime),
            ChangedBy,
            ChangedAt: new Date()
        }
      });

      return NextResponse.json({
        success: true,
        message: "Booking detail updated successfully.",
        data: updated
      });
    } else {
      // Jika tidak, buat data baru
      const created = await prisma.bookingDetails.create({
        data: {
          BookingId,
          ResourceId,
          ResourceAccountId,
          SubkTechnicianId,
          Name,
          Status,
          StartTimeCustomerTime: toDateOrNull(StartTimeCustomerTime),
          EndTimeCustomerTime: toDateOrNull(EndTimeCustomerTime),
          EstimatedArrivalTimeCustomerTime: toDateOrNull(EstimatedArrivalTimeCustomerTime),
          ActualArrivalTimeCustomerTime: toDateOrNull(ActualArrivalTimeCustomerTime),
          StartTimeUserTime: toDateOrNull(StartTimeUserTime),
          EndTimeUserTime: toDateOrNull(EndTimeUserTime),
          DurationInMinutesUserTime,
          EstimatedArrivalTimeUserTime: toDateOrNull(EstimatedArrivalTimeUserTime),
          ActualArrivalTimeUserTime: toDateOrNull(ActualArrivalTimeUserTime),
          ChangedBy
        }
      });
      

      return NextResponse.json({
        success: true,
        message: "Booking detail created successfully.",
        data: created
      }, { status: 201 });
    }

  } catch (err) {
    console.error("🔥 ERROR in BookingDetails POST:", err);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
      error: err.message
    }, { status: 500 });
  }
}
