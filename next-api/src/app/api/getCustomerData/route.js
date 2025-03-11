import { NextResponse } from "next/server"
import prisma from "../../../../prisma/client"

export async function GET(req, res) {
    //get search parameter
    const { searchParams } = new URL(request.url);

    //extract query parameter
    const serialNumber = searchParams.get("SerialNumber")
    const productName = searchParams.get("ProductName")
    const first_name = searchParams.get("first_name")
    const last_name = searchParams.get("last_name")
    const email = searchParams.get("email")

    //prisma query filter
    const filters = {
        SerialNumber : serialNumber ? serialNumber : undefined,
    };
    if(serialNumber){
        filters.SerialNumber = { contains: serialNumber }
    }
    if(productName){
        filters.ProductName = { contains: productName }
    }
    //get all data
    const asset_information = await prisma.asset_information.findMany({
        where: Object.keys(filters).length > 0 ? filters : undefined,
        include:
        {
            site_account: true,
            contact_information:true
        }
    });
    return NextResponse.json(
        {
            success: true,
            message: "List Data Asset Information",
            data: asset_information,
        },
        {
            status:200,
        }
    );
}