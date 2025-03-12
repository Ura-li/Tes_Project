import { NextResponse } from "next/server";

import prisma from "../../../../../prisma/client";

export async function GET(request, { params }) {
    //get params id
    const assetID = parseInt(params.AssetID);
    //get detail post
    const asset_information = await prisma.asset_information.findUnique({
        where: {
            AssetID: assetID,
        },
    });

    if(!asset_information){
        return NextResponse.json(
            {
                success:true,
                message: "Detail Data Asset Information Not Found!",
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
            message: "Detail Data Asset Information",
            data: asset_information,
        },
        {
            status: 200,
        }
    );
}

// update data
export async function PATCH(request, { params }) {
    const assetID = parseInt(params.AssetID);

    const { 
        SerialNumber,
        ProductName,
        ProductNumber,
        ProductLine,
        SiteAccountID,
        ContactID
    } = await request.json();

    //update data
    const asset_information = await prisma.asset_information.update({
        where: {
            AssetID: assetID,
        },
        data: {
            SerialNumber: SerialNumber,
            ProductName: ProductName,
            ProductNumber: ProductNumber,
            ProductLine: ProductLine,
            SiteAccountID: SiteAccountID,
            ContactID: ContactID
        }
    })

    return NextResponse.json(
        {
            success: true,
            message: "Data Asset Information Updated!",
            data: asset_information,
        },
        {
            status: 200,
        }
    )
}

//delete data
export async function DELETE(request, { params }) {
    const assetID = parseInt(params.AssetID);
    
    await prisma.caseinformation.delete(
        {
            where: {
                AssetID: assetID,
            }
        },
        {
            status: 200
        }
    );

    return NextResponse.json({
        success: true,
        message: "Data Asset Information Deleted"
    })
}