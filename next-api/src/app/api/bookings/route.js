import { NextResponse } from "next/server";

import prisma from "../../../../prisma/client";


export async function GET(request) {
  try {
    // Ambil parameter pencarian & pagination dari URL
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('keyword') || '';  // Ambil kata kunci pencarian
    const page = parseInt(searchParams.get('page')) || 1;  // Halaman saat ini
    const limit = parseInt(searchParams.get('limit')) || 10;  // Batas data per halaman

    const woid = searchParams.get('WOID') || '';

    console.log('Query Params:', { search, page, limit });

    const whereCondition = {
      WOID: woid || undefined, // filter by WOID if given
      ...(search && {
        workorder: {
          WorkOrderNumber: { contains: search }, // or any searchable field in workorder
        },
      }),
    };
    

    // Hitung jumlah total data yang cocok dengan pencarian
    const totalCount = await prisma.bookings.count({
      where: whereCondition,
    });
    
    
    // Hitung offset berdasarkan halaman
    const skip = (page - 1) * limit;
    
    const bookings = await prisma.bookings.findMany({
      where: whereCondition,
      include: {
        workorder: true, 
        createdByUser: true,
      },
      skip,
      take: limit,
      orderBy: {
        CreatedAt: "desc",
      },
    });


    return NextResponse.json({
      success: true,
      message: 'List Data Subk Technician',
      data: bookings,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('🔥 ERROR in GET API:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch data',
        error: error.message
      },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  try {
    const { WOID, CreatedBy } = await request.json()

    const woid = WOID
    const createdBy = parseInt(CreatedBy)

    // console.log(CreatedBy)
    // Validasi input dasar
    if (!woid || !createdBy) {
      return NextResponse.json(
        { error: 'WOID dan CreatedBy wajib diisi.' },
        { status: 400 }
      )
    }

    // Buat entri di tabel bookings saja
    const bookings = await prisma.bookings.create({
      data: {
        WOID: woid,
        BookingStatus: 'Schedule',
        CreatedBy: createdBy,
      }
    })

    return NextResponse.json(
      { message: 'Booking berhasil dibuat', BookingId: bookings.BookingId },
      { status: 201 }
    )

  } catch (error) {
    console.error('[BOOKING_CREATE_ERROR]', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat membuat booking.' },
      { status: 500 }
    )
  }
}
