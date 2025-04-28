import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export async function GET(request) {
    try{
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const caseID = searchParams.get("CaseID") || "";
        
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;

        console.log("Query Params:", { search, page, limit });
         // Initialize search filters
         let whereCondition = {};
         
        //  if (search) {
        //     whereCondition.OR = [...(whereCondition.OR || []), { CaseID: { contains: caseID } }];
        // }
        if (caseID) {
            whereCondition.CaseID = caseID;
        }



        const workorder = await prisma.workorder.findMany({
            where: whereCondition,
            include: {
                caseinformation: true,
            },
        });

        return NextResponse.json({
            success: true,
            message: "List Data Work Order",
            data: workorder
        });
    }catch(err){
        console.error("🔥 ERROR in GET API:", err);

        return NextResponse.json({
            success: false,
            message: "Failed to fetch data",
            error: err.message
        }, { status: 500 });
    }
}