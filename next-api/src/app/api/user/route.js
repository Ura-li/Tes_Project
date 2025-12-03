import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import crypto from "crypto"; 

// 🔹 GET: ambil list user dengan filter search & role
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const resource = searchParams.get("resource") || "";

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // 🔹 Kondisi pencarian
    let whereCondition = {};

    if (search) {
      whereCondition.OR = [
        { Email: { contains: search } },
        { Username: { contains: search } },
        { Name: { contains: search } },
        { Phone: { contains: search } },
      ];
    }

    if (role) {
      whereCondition.Role = role;
    }
    if(resource) whereCondition.ResourceId = resource;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereCondition,
        // skip,
        // take: limit,
        orderBy: { CreatedAt: "desc" },
        include: {
          resource: {
            // Name: true,
            include : {
              resourceAccounts: true
            }
          }
        }
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
  try {
    let Email, Username, Password, Name, Role, ProfilePhoto, Phone, Signature, ResourceId;

    // 🟢 Cek apakah request FormData (multipart/form-data)
    if (req.headers.get("content-type")?.includes("multipart/form-data")) {
      const formData = await req.formData();
      Email = formData.get("Email");
      Username = formData.get("Username");
      Password = formData.get("Password");
      Name = formData.get("Name");
      Role = formData.get("Role");
      Phone = formData.get("Phone");
      Signature = formData.get("Signature");
      ResourceId = formData.get("ResourceId");

      // ProfilePhoto dari file
      const ProfilePhotoFile = formData.get("ProfilePhoto");
      if (ProfilePhotoFile && ProfilePhotoFile.size > 0) {
        const buffer = Buffer.from(await ProfilePhotoFile.arrayBuffer());
        const ext = path.extname(ProfilePhotoFile.name) || ".png";
        const uniqueName = `${crypto.randomUUID()}${ext}`;
        const uploadPath = path.join(process.cwd(), "public/uploads/profiles", uniqueName);
        fs.writeFileSync(uploadPath, buffer);
        ProfilePhoto = `/uploads/profiles/${uniqueName}`;
      }
    } else {
      // fallback JSON seperti sebelumnya
      const json = await req.json();
      Email = json.Email;
      Username = json.Username;
      Password = json.Password;
      Name = json.Name;
      Role = json.Role;
      ProfilePhoto = json.ProfilePhoto;
      Phone = json.Phone;
      Signature = json.Signature;
      ResourceId = json.ResourceId;
    }

    // 🔹 Validasi required
    const requiredFields = { Email, Username, Password, Name };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value || value.trim() === "") {
        return NextResponse.json(
          { success: false, error: `${key} is required and cannot be empty` },
          { status: 400 }
        );
      }
    }

    // 🔹 Cek duplicate Email & Username
    const existingEmail = await prisma.user.findUnique({ where: { Email } });
    if (existingEmail) return NextResponse.json({ success: false, error: "Email is already registered" }, { status: 409 });

    const existingUsername = await prisma.user.findUnique({ where: { Username } });
    if (existingUsername) return NextResponse.json({ success: false, error: "Username is already taken" }, { status: 409 });

    // 🔹 Proses base64 seperti sebelumnya jika masih base64
    let finalPhoto = ProfilePhoto;
    if (ProfilePhoto && typeof ProfilePhoto === "string" && ProfilePhoto.startsWith("data:image")) {
      const base64Data = ProfilePhoto.split(";base64,").pop();
      const extension = ProfilePhoto.substring("data:image/".length, ProfilePhoto.indexOf(";base64"));
      const fileName = `${crypto.randomUUID()}.${extension}`;
      const filePath = path.join(process.cwd(), "public/uploads/profiles", fileName);
      fs.writeFileSync(filePath, Buffer.from(base64Data, "base64"));
      finalPhoto = `/uploads/profiles/${fileName}`;
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = await prisma.user.create({
      data: {
        Email,
        Username,
        Password: hashedPassword,
        Name,
        Role: Role || "user",
        ProfilePhoto: finalPhoto,
        Phone,
        Signature,
        ResourceId,
      },
    });

    return NextResponse.json({ success: true, data: newUser });
  } catch (error) {
    console.error("User creation error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
