import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export async function GET(request) {
  try {
    // Ambil parameter pencarian & pagination dari URL
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("keyword") || "";  // Ambil kata kunci pencarian
    const page = parseInt(searchParams.get("page") || "1", 10);  // Halaman saat ini
    const limit = parseInt(searchParams.get("limit") || "10", 10);  // Batas data per halaman

    const skip = (page - 1) * limit;

    const where = search
      ? {
        OR: [
          { ResourceId: { contains: search, mode: "insensitive" } },
          { Name: { contains: search, mode: "insensitive" } },
          { ServiceCenterName: { contains: search, mode: "insensitive" } },
          { City: { contains: search, mode: "insensitive" } },
          { StateProvince: { contains: search, mode: "insensitive" } },
          { Country: { contains: search, mode: "insensitive" } },
          { Phone: { contains: search, mode: "insensitive" } },
          { Mobile: { contains: search, mode: "insensitive" } },
          { Email: { contains: search, mode: "insensitive" } },
          ], 
        }
      : {};
    // Hitung jumlah total data yang cocok dengan pencarian
    const totalCount = await prisma.resource.count({ where });

    console.log('Total Data:', totalCount);

    // Ambil data Resources dengan filter dan pagination
    const resources = await prisma.resource.findMany({
      where,
      skip,
      take: limit,
      orderBy: { ResourceId: 'asc',
      },
      include: {
        resourceAccounts: true,
        bookingDetails: true,
        users: true,
      },
    });

    const totalPages = Math.max(1, Math.ceil(totalCount / limit));
    const currentPage = page;
    return NextResponse.json({
      success: true,
      message: 'List Data Resources',
      data: {
      resources,
      totalCount,
      totalPages,
      currentPage,
      pageSize: limit,
      }
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

export async function POST(req) {
    try {
        const body = await req.json();

    const { ResourceId, Name, ServiceCenterName, ResourceCode, ResourceLogo, Phone, Mobile, Fax, Email, City, StateProvince, Country, ZipPostalCode, AddressLine, } = body;

    if (!ResourceId || !Name) {
      return NextResponse.json(
        {
          success: false,
          message: "ResourceId and Name are required fields.",
        },
        { status: 400 }
      );
    }

    const newResource = await prisma.resource.create({
      data: {
        ResourceId,
        Name,
        ServiceCenterName,
        ResourceCode,
        ResourceLogo,
        Phone,
        Mobile,
        Fax,
        Email,
        City,
        StateProvince,
        Country,
        ZipPostalCode,
        AddressLine,
      },
    });

    return NextResponse.json({ success: true, message: "Resource created successfully", data: newResource });
  } catch (error) {
    console.error("🔥 ERROR in POST API:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create resource",
        error: error.message,
      },
      { status: 500 }
    );
  }
}