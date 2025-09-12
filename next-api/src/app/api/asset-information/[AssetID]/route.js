import { NextResponse } from "next/server";

import prisma from "../../../../../prisma/client";

export async function GET(request, { params }) {
    const { AssetID } = await params
    const assetID = parseInt(AssetID);

    if (isNaN(assetID)) {
        return NextResponse.json({
            success: false,
            message: "Invalid Asset ID"
        }, { status: 400 });
    }

    const asset_information = await prisma.asset_information.findUnique({
        where: { AssetID: assetID },
        include: {
            site_account: true,
            contact_information: true,
            product_information:{
                include: {
                    product_type: true
                }
            },
            WarrantyOTCCode: true
        }
    });

    if (!asset_information) {
        return NextResponse.json({
            success: false,
            message: "Detail Data Asset Information Not Found!",
            data: null
        }, { status: 404 });
    }

    return NextResponse.json({
        success: true,
        message: "Detail Data Asset Information",
        data: asset_information
    }, { status: 200 });
}


// update data
/**
 * TODO 
 * MAKE UPDATE ASSET AND CREATE PRODUCT SEPARATELY
 */
export async function PATCH(request, { params }) {
    const {AssetID} = await params;
    const assetId = parseInt(AssetID);

    try { 
        const body = await request.json();
        const { 
            SerialNumber,  
            ProductNumber, 
            SiteAccountID, 
            ContactID,
            Warranty_Status,
            EOW_Date 
        } = body;

        console.log(body);
        // Validasi input tidak boleh kosong
        // if (!SerialNumber || !ProductName || !ProductNumber || !ProductLine) {
        //     return NextResponse.json({
        //         success: false,
        //         message: "All fields are required!"
        //     }, { status: 400 });
        // }

        // Cek apakah AssetID ada
        const existingAsset = await prisma.asset_information.findUnique({
            where: { AssetID: assetId }
        });

        if (!existingAsset) {
            return NextResponse.json({
                success: false,
                message: "Asset not found!"
            }, { status: 404 });
        }

        // Update data
        const updatedAsset = await prisma.asset_information.update({
            where: { AssetID: assetId },
            data: {
                SerialNumber,
                ProductNumber,
                SiteAccountID: SiteAccountID ? parseInt(SiteAccountID) : null,
                ContactID: ContactID ? parseInt(ContactID) : null,
                Warranty_Status,
                EOW_Date: EOW_Date ? new Date(EOW_Date) : null
            }
        });

        return NextResponse.json({
            success: true,
            message: "Data Asset Information Updated!",
            data: updatedAsset
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to update asset",
            error: error.message
        }, { status: 500 });
    }
}


//delete data
export async function DELETE(request, { params }) {
    const assetID = parseInt(params.AssetID);

    try {
        const deletedAsset = await prisma.asset_information.delete({
            where: {
                AssetID: assetID,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Data Asset Information deleted",
            data: deletedAsset
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Asset not found or already deleted",
            error: error.message
        }, { status: 404 });
    }
}