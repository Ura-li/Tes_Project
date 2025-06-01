import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET =  process.env.JWT_SECRET || ''


export async function GET(request) {

     return NextResponse.json({ 
            success: true, 
            message: "Login successful",
            data: {
                message: "Login Berhasil"
            }
        })
}
export async function POST(request) {
    try {
        const { identifier, password } = await request.json();

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { Email: identifier },
                    {Username: identifier}
                ]
            }
        })

        if(!user){
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }
         // 🔥 Correct way to check password
         const isPasswordValid = await bcrypt.compare(password, user.Password);

         if (!isPasswordValid) {
             return NextResponse.json({ success: false, message: "Incorrect password" }, { status: 401 });
         }

         // 🔥 Generate JWT Token
        const token = jwt.sign(
            {
                id: user.IDUser,
                email: user.Email,
                role: user.Role,
                name: user.Name,
                avatar: user.ProfilePhoto || ""
            },
            JWT_SECRET,
            { expiresIn: '7d' } // token valid for 7 days
        );

        return NextResponse.json({ 
            success: true, 
            message: "Login successful",
            token,
            data: {
              id: user.id,
              name: user.Name,
              email: user.Email,
              role: user.Role,
              profile: user.ProfilePhoto
            }
        })
    }catch(error){
        console.error("🔥 Login Error:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}