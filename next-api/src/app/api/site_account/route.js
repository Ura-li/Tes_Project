import { NextResponse } from "next/server";

import prisma  from "../../../../prisma/client";

export async function GET() {
    //get all data
    const site_account = await prisma.site_account.findMany();

    return NextResponse.json(
        {
            success: true,
            message: "List Data Site Account",
            data: site_account,
        },
        {
            status:200,
        }
    );
}

export async function POST(request) {
    //get all request
    const { 
        Company,
        Email,
        PrimaryPhone,
        AddressLine1,
        AddressLine2,
        City,
        StateProvince,
        Country,
        ZipPostalCode
    } = await request.json();

    //create data 
    const site_account = await prisma.site_account.create({
        data:{
            Company : Company,
            Email : Email,
            PrimaryPhone : PrimaryPhone,
            AddressLine1 : AddressLine1,
            AddressLine2 : AddressLine2,
            City: City,
            StateProvince: StateProvince,
            Country: Country,
            ZipPostalCode: ZipPostalCode
        },
    });

    return NextResponse.json(
        {
            success: true,
            message: "Site Account Created Successfully!",
            data: site_account,
        },
        { 
            status: 201
        }
    )
}