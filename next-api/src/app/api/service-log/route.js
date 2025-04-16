import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";

export async function GET(request) {
    try{
        //ambil parameter
        const { searchParams } = new URL(request.url);

    }catch(e){

    }
}