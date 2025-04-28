import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET(request, { params }) {
    const { IDUser } = await params
    const idUser = parseInt(IDUser)

    if (isNaN(idUser)) {
        return NextResponse.json({
            success: false,
            message: "Invalid ID User"
        }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { IDUser: idUser}
    })
    if(!user) {
        return NextResponse.json({
            success: false,
            message: "Detail Data User Not Found!",
            data: null
        }, { status: 404 });
    }

    return NextResponse.json({
        success: true,
        message: "Detail Data User Information",
        data: user
    }, { status: 200 });
}