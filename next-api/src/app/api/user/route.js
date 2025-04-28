import { NextResponse } from "next/server";

import prisma from "../../../../prisma/client";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;

        console.log("Query Params:", { search, page, limit });
         // Initialize search filters
         let whereCondition = {};
         
         if (search) {
            whereCondition.OR = [...(whereCondition.OR || []), { CaseID: { contains: caseID } }];
        }



        const user = await prisma.user.findMany({
            where: whereCondition,
        });

        return NextResponse.json({
            success: true,
            message: "List Data User",
            data: user
        });
    } catch (error) {
        console.error("🔥 ERROR in GET API:", error);

        return NextResponse.json({
            success: false,
            message: "Failed to fetch data",
            error: error.message
        }, { status: 500 });
    }
}

export async function POST(request) {
    const {
        Email,
        Username,
        Password,
        Name,
        Role,
        ProfilePhoto
    } = await request.json();

    const user = await prisma.user.create({
        data:{
            Email: Email,
            Username: Username,
            Password: Password,
            Name: Name,
            Role: Role,
            ProfilePhoto: ProfilePhoto || ""
        }
    })
    return NextResponse.json(
        {
            success: true,
            message: "User Created Successfully!",
            data: user,
        },
        { 
            status: 201
        }
    )
}