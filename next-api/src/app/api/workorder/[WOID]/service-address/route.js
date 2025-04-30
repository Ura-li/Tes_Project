import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";


// PATCH: Update atau buat alamat service delivery berdasarkan WOID
export async function PATCH(request, { params }) {
  const { WOID } = params;
  const body = await request.json();

  try {
    // Cari dulu AddressID berdasarkan WOID
    const existingAddress = await prisma.workorder_service_delivery_address.findFirst({
      where: {
        WOID: parseInt(WOID),
      },
    });

    if (!existingAddress) {
      return new Response("Address not found", { status: 404 });
    }

    const updated = await prisma.workorder_service_delivery_address.update({
      where: {
        AddressID: existingAddress.AddressID,
      },
      data: {
        CompanyName: body.CompanyName,
        ContactFirstName: body.ContactFirstName,
        ContactLastName: body.ContactLastName,
        PhoneNumber: body.PhoneNumber,
        Email: body.Email,
        AddressLine1: body.AddressLine1,
        AddressLine2: body.AddressLine2,
        AddressLine3: body.AddressLine3,
        City: body.City,
        StateOrProvince: body.StateOrProvince,
        CountryOrRegion: body.CountryOrRegion,
        PostalCode: body.PostalCode,
        TimeZone: body.TimeZone,
        ServiceTerritory: body.ServiceTerritory,
        BusinessSegment: body.BusinessSegment,
        Longitude: body.Longitude,
        Latitude: body.Latitude,
      },
    });

    return Response.json(updated);
  } catch (error) {
    console.error("[PATCH /service-address] Error", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}


// GET: Ambil data alamat berdasarkan WOID
export async function GET(request, { params }) {
  const { WOID } = params;

  try {
    const data = await prisma.workorder_service_delivery_address.findFirst({
      where: {
        WOID: parseInt(WOID),
      },
    });

    if (!data) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("[GET /service-address]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

