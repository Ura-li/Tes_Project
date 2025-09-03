import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import bcrypt from "bcrypt";

// 🔹 GET: ambil list user dengan filter search & role
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // 🔹 Kondisi pencarian
    let whereCondition = {};

    if (search) {
      whereCondition.OR = [
        { Email: { contains: search, mode: "insensitive" } },
        { Username: { contains: search, mode: "insensitive" } },
        { Name: { contains: search, mode: "insensitive" } },
        { Phone: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      whereCondition.Role = role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereCondition,
        // skip,
        // take: limit,
        orderBy: { CreatedAt: "desc" },
      }),
      prisma.user.count({ where: whereCondition }),
    ]);

    return NextResponse.json({
      success: true,
      message: "List Data User",
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("🔥 ERROR in GET API:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// 🔹 POST: tambah user baru
export async function POST(req) {
  const {
    Email,
    Username,
    Password,
    Name,
    Role,
    ProfilePhoto,
    Phone,
    Signature,
  } = await req.json();

  try {
    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = await prisma.user.create({
      data: {
        Email,
        Username,
        Password: hashedPassword,
        Name,
        Role: Role || "user",
        ProfilePhoto,
        Phone,       // ✅ sekarang ikut disimpan
        Signature,   // ✅ sekarang ikut disimpan
      },
    });

    return NextResponse.json({ success: true, data: newUser });
  } catch (error) {
    console.error("User creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}