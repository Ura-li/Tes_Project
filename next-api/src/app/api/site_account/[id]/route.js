import { NextResponse } from "next/server";

import prisma from "../../../../../prisma/client";

export async function GET(request, { params }) {
    //get params id
    const siteAccountID = parseInt(params.id);
    //get detail post
    const site_account = await prisma.site_account.findUnique({
        where: {
            SiteAccountID: siteAccountID,
        },
    });

    if(!site_account){
        return NextResponse.json(
            {
                success:true,
                message: "Detail Data Post Not Found!",
                data: null,
            },
            {
                status: 404,
            }
        );
    }

    return NextResponse.json(
        {
            success:true,
            message: "Detail Data Site Account",
            data: site_account,
        },
        {
            status: 200,
        }
    );
}

// update data
export async function PATCH(request, { params }) {
    const siteAccountID = parseInt(params.id);

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

    //update data
    const site_account = await prisma.site_account.update({
        where: {
            SiteAccountID: siteAccountID,
        },
        data: {
            Company : Company,
            Email : Email,
            PrimaryPhone : PrimaryPhone,
            AddressLine1 : AddressLine1,
            AddressLine2 : AddressLine2,
            City: City,
            StateProvince: StateProvince,
            Country: Country,
            ZipPostalCode: ZipPostalCode
        }
    })

    return NextResponse.json(
        {
            success: true,
            message: "Data Site Account Updated!",
            data: site_account,
        },
        {
            status: 200,
        }
    )
}

//delete data
export async function DELETE(request, { params }) {
    const siteAccountID = parseInt(params.id);
    
    await prisma.caseinformation.delete({
        where: {
            SiteAccountID: siteAccountID,
        }
    });

    return NextResponse.json(
        {
        success: true,
        message: "Data Site Account Information Deleted"
        },
        {
            status: 200
        }
    );
}