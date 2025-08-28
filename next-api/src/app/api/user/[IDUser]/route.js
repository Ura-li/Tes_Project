import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import crypto from "crypto"; 


const JWT_SECRET =  process.env.JWT_SECRET || '' 

// GET - Ambil detail user berdasarkan ID
export async function GET(request, { params }) {
  const { IDUser } = await params;
  const idUser = parseInt(IDUser);

  if (isNaN(idUser)) {
    return NextResponse.json({
      success: false,
      message: "Invalid ID User"
    }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { IDUser: idUser }
  });

  if (!user) {
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

// PATCH - Update user berdasarkan ID
export async function PATCH(request, { params }) {
  const { IDUser } = await params;
  const idUser = parseInt(IDUser);

  if (isNaN(idUser)) {
    return NextResponse.json({
      success: false,
      message: "Invalid ID User"
    }, { status: 400 });
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    let body = {};
    let files = {};

    if (contentType.includes("multipart/form-data")) {
      // 📌 Kalau dikirim dengan FormData
      const formData = await request.formData();

      body.Name = formData.get("Name");
      body.Email = formData.get("Email");
      body.Username = formData.get("Username");
      body.Role = formData.get("Role");
      body.Phone = formData.get("Phone");
      body.Password = formData.get("Password");
      body.Signature = formData.get("Signature"); // bisa string, bisa file
      files.ProfilePhoto = formData.get("ProfilePhoto");
      files.Signature = formData.get("Signature");
    } else {
      // 📌 Kalau dikirim dengan JSON biasa
      body = await request.json();
    }

    const oldUser = await prisma.user.findUnique({
      where: { IDUser: idUser }
    });


    // File
    if (ProfilePhoto && typeof ProfilePhoto === "object") {
      if (oldUser?.ProfilePhoto) {
        const oldPath = path.join(process.cwd(), "public", oldUser.ProfilePhoto);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      const bytes = await ProfilePhoto.arrayBuffer();
      const buffer = Buffer.from(bytes);

      //generate name
      const ext = path.extname(ProfilePhoto.name); // ambil ekstensi asli (misal .png/.jpg)
      const uniqueName = `${crypto.randomUUID()}${ext}`; 

      const uploadPath = path.join(process.cwd(), "public/uploads/profiles", uniqueName);
      fs.writeFileSync(uploadPath, buffer);
      updateData.ProfilePhoto = `/uploads/profiles/${uniqueName}`;
    }

    // Simpan file signature
    if (files.Signature && typeof files.Signature === "object") {
      const bytes = await files.Signature.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}_${files.Signature.name}`;
      const uploadPath = path.join(process.cwd(), "public/uploads/signatures", fileName);
      fs.writeFileSync(uploadPath, buffer);

      updateData.Signature = `/uploads/signatures/${fileName}`;
    }

    // Jika tidak ada field yang dikirim
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({
        success: false,
        message: "Minimal satu field harus dikirim untuk diupdate."
      }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { IDUser: idUser },
      data: updateData,
    });

    // Buat token baru dengan data terbaru
    const newToken = jwt.sign(
      {
        id: updatedUser.IDUser,
        email: updatedUser.Email,
        role: updatedUser.Role,
        name: updatedUser.Name,
        avatar: updatedUser.ProfilePhoto || ""
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      success: true,
      message: "Data user berhasil diperbarui",
      token: newToken,
      data: updatedUser
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Gagal memperbarui data user",
      error: error.message
    }, { status: 500 });
  }
}

// DELETE - Hapus user berdasarkan ID
export async function DELETE(request, { params }) {
  const { IDUser } = params;
  const idUser = parseInt(IDUser);

  if (isNaN(idUser)) {
    return NextResponse.json({
      success: false,
      message: "Invalid ID User"
    }, { status: 400 });
  }

  try {
    const deletedUser = await prisma.user.delete({
      where: { IDUser: idUser },
    });

    return NextResponse.json({
      success: true,
      message: "User berhasil dihapus",
      data: deletedUser
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "User tidak ditemukan atau sudah dihapus",
      error: error.message
    }, { status: 404 });
  }
}
