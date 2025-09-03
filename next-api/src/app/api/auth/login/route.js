import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z, ZodError } from "zod";

const JWT_SECRET =  process.env.JWT_SECRET || ''

const loginSchema = z.object({
  identifier: z
    .string()
    .min(3, { message: "Identifier is required" })
    .refine(
      (val) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || /^[a-zA-Z0-9_-]{3,30}$/.test(val),
      {
        message: "Identifier must be a valid email or username"
      }
    ),
  password: z
    .string()
    .min(2, { message: "Password must be at least 3 characters" })
})

export async function GET(request) {

     return NextResponse.json({ 
            success: true, 
            message: "Login successful",
            data: {
                message: "Login Berhasil , Selamat datang -.Perid"
            }
        })
}
export async function POST(request) {
    try {
        const body = await request.json();

        const parsed = loginSchema.safeParse(body);

        // Kalau gagal langsung tangani error
        if (!parsed.success) {
            console.log("Zod errors array:", parsed.error.issues);
            const errorMessages = parsed.error.issues.map(err => ({
                field: err.path[0],
                message: err.message
            }));

            return NextResponse.json({
                success: false,
                message: "Validation failed",
                errors: errorMessages
            }, { status: 400 });

        }



        const { identifier, password } = parsed.data

        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // const isEmail = emailRegex.test(identifier);

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { Email: identifier },
                    { Username: identifier}
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