import { NextResponse } from "next/server";

import prisma from "../../../../../prisma/client";

export async function GET(request, { params }) {
  try {
    const { BookingId } = await params;
    const bookingId = parseInt(BookingId); // Perbaiki format parameter

    if (!bookingId) {
      return NextResponse.json(
        { error: 'BookingId wajib diisi.' },
        { status: 400 }
      )
    }

    const booking = await prisma.bookings.findUnique({
      where: { BookingId: bookingId },
      include: {
        workorder: true, // Relasi ke tabel workorder
        bookingDetails: {
          orderBy: { ChangedAt: 'desc' }, // Urutkan ChangedAt terbaru
          take: 1, // Ambil hanya 1 record
          include: {
            resourceaccount: true,
            resource: true,
            subkTechnician: true,
          }
        }
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking tidak ditemukan.' },
        { status: 404 }
      )
    }

    return NextResponse.json(booking, { status: 200 })

  } catch (error) {
    console.error('[BOOKING_FETCH_ERROR]', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data booking.' },
      { status: 500 }
    )
  }
}

export async function PATCH(request, { params }) {  

  try {
    const { BookingId } = await params;
    const bookingId = parseInt(BookingId); // Perbaiki format parameter
    if (!bookingId) {
      return NextResponse.json(
        { error: 'BookingId wajib diisi.' },
        { status: 400 }
      )
    }
    const body = await request.json();
    const { 
      BookingStatus, 
      ChangedBy,
      DoNotDisturb,
      CeScheduleChange,
      ScheduleJeopardy,
      ScheduleJeopardyTime,
      TotalBillableDurationInMinutes,
      TotalInProgressDurationInMinutes,
      TotalBreakDurationInMinutes,
      bookingDetailsData,
      bookingDetails2Data 
    } = body;

    const changedBy = parseInt(ChangedBy);
    console.log("booking dataID", bookingDetails2Data)
    const bookingDetailToUpdate = bookingDetailsData;
    console.log("booking Detail Data To update ", bookingDetailToUpdate)

    const resourceId = bookingDetailToUpdate?.ResourceId ?? "default-id";
    const accountId = bookingDetailToUpdate?.ResourceAccountId ?? "default-id";
    const subkTechnicianId = bookingDetailToUpdate?.SubkTechnicianId ?? null;

    console.log("Resource ID:", resourceId)
    console.log("booking Changed By", changedBy)


    if (!changedBy || !bookingDetailsData) {
      return NextResponse.json(
        { error: 'BookingId, ChangedBy, dan bookingDetailsData wajib diisi.' },
        { status: 400 }
      );
    }

    const existingResource = await prisma.resource.findUnique({
      where: { ResourceId: resourceId.toString() }
    });
    
    if (!existingResource) {
      return NextResponse.json(
        { error: `ResourceId ${resourceId} not found.` },
        { status: 400 }
      );
    }
    
    // Transaksi: Update Bookings + Insert BookingDetails
    const result = await prisma.$transaction(async (tx) => {
      // Update Bookings
      const updatedBooking = await tx.bookings.update({
        where: { BookingId: bookingId },
        data: {
          BookingStatus: BookingStatus,
          DoNotDisturb: DoNotDisturb,
          CeScheduleChange: CeScheduleChange,
          ScheduleJeopardy: ScheduleJeopardy,
          ScheduleJeopardyTime: ScheduleJeopardyTime,
          TotalBillableDurationInMinutes: TotalBillableDurationInMinutes,
          TotalInProgressDurationInMinutes: TotalInProgressDurationInMinutes,
          TotalBreakDurationInMinutes: TotalBreakDurationInMinutes,
        },
      });

      const existingDetail = await tx.bookingDetails.findFirst({
        where: { BookingId: bookingId },
        orderBy: { ChangedAt: 'desc' }, // use the correct field
      });
      
      
      if (!existingDetail) {
        throw new Error('No bookingDetails found to update.');
      }
      
      // Insert BookingDetails baru
      const updatedBookingDetail = await tx.bookingDetails.update({
        where: { BookingDetailId: existingDetail.BookingDetailId },
        data : {
          ChangedBy: changedBy,
          // ResourceId: resourceId,
          // ResourceAccountId: accountId,
          // SubkTechnicianId: subkTechnicianId,
          Name: "",
          Status: BookingStatus,
          StartTimeCustomerTime: bookingDetailsData.StartTimeCustomerTime,
          EndTimeCustomerTime: bookingDetailsData.EndTimeCustomerTime,
          EstimatedArrivalTimeCustomerTime: bookingDetailsData.EstimatedArrivalTimeCustomerTime,
          ActualArrivalTimeCustomerTime: bookingDetailsData.ActualArrivalTimeCustomerTime,
          StartTimeUserTime: bookingDetailsData.StartTimeUserTime,
          EndTimeUserTime: bookingDetailsData.EndTimeUserTime,
          DurationInMinutesUserTime: bookingDetailsData.DurationInMinutesUserTime,
          EstimatedArrivalTimeUserTime: bookingDetailsData.EstimatedArrivalTimeUserTime,
          ActualArrivalTimeUserTime: bookingDetailsData.ActualArrivalTimeUserTime,
                
          // Relations (use relation names!)
          resource: { connect: { ResourceId: resourceId.toString() } },
          resourceaccount: { connect: { ResourceAccountId: accountId.toString() } },
          subkTechnician: subkTechnicianId 
            ? { connect: { SubkTechnicianId: subkTechnicianId.toString() } }
            : undefined,
          booking: { connect: { BookingId: bookingId } }
        },
      });

      // return { updatedBooking, createdBookingDetail };
      return NextResponse.json(
        {
          message: 'Booking dan BookingDetails berhasil diperbarui.',
          data: { updatedBooking, updatedBookingDetail }
        },
        { status: 200 }
      );
    });

    return result;
 

  } catch (error) {
    console.error('[BOOKING_PATCH_ERROR]', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memperbarui booking.' },
      { status: 500 }
    );
  }
}
