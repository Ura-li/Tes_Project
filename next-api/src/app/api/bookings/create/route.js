import { NextResponse } from "next/server";

import prisma from "../../../../../prisma/client";

export async function POST(req) {
  try {
    const { WOID, CreatedBy } = await req.json()
    
    const woid = parseInt(WOID);
    const createdBy = parseInt(CreatedBy);

    // Validasi input dasar
    if (!woid || !createdBy) {
      return NextResponse.json(
        { error: 'WOID dan CreatedBy wajib diisi.' },
        { status: 400 }
      )
    }

    // Buat entri Booking utama
    const bookings = await prisma.bookings.create({
      data: {
        Name: `Booking WOID ${woid}`,
        WOID: woid,
        ResourceId: 1, // Isi sementara, sesuaikan nanti
        AccountId: 1,  // Isi sementara, sesuaikan nanti
        CreatedBy,
        UpdatedBy: createdBy,
      }
    })

    // Buat data child kosong berdasarkan BookingId
    await prisma.bookingDatesUserTime.create({
      data: { BookingId: bookings.BookingId }
    })

    await prisma.bookingDatesCustomerTime.create({
      data: { BookingId: bookings.BookingId }
    })

    await prisma.slaJeopardy.create({
      data: { BookingId: bookings.BookingId }
    })

    await prisma.bookingDurations.create({
      data: { BookingId: bookings.BookingId }
    })

    await prisma.bookingTimestamps.create({
      data: {
        BookingId: bookings.BookingId,
        Status: 'Created',
        ChangedBy: createdBy,
      }
    })

    await prisma.bookingDetails.create({
      data: { BookingId: bookings.BookingId }
    })

    return NextResponse.json({ message: 'Booking berhasil dibuat', BookingId: bookings.BookingId }, { status: 201 })

  } catch (error) {
    console.error('[BOOKING_CREATE_ERROR]', error)
    return NextResponse.json({ error: 'Terjadi kesalahan saat membuat booking.' }, { status: 500 })
  }
}

export async function GET(request, {params}) {
  const bookingId = parseInt(params.get('BookingId'));

  if (!bookingId) {
    return NextResponse.json({ error: 'BookingId is required' }, { status: 400 });
  }

  const booking = await prisma.bookings.findUnique({
    where: { BookingId: bookingId },
    include: {
      resource: true,
      account: true,
      bookingDatesUserTime: true,
      bookingDatesCustomerTime: true,
      slaJeopardy: true,
      bookingDurations: true,
      bookingTimestamps: true,
    },
  });

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  return NextResponse.json(booking);
}