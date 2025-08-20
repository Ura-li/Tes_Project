import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

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
    const formData = await request.formData();
    const Name = formData.get("Name");
    const Email = formData.get("Email");
    const Phone = formData.get("Phone");
    const Password = formData.get("NewPassword");
    const ProfilePhoto = formData.get("ProfilePhoto");
    const Signature = formData.get("Signature");

    let updateData = { Name, Email, Phone };

    if (Password) {
      updateData.Password = await bcrypt.hash(Password, 10);
    }

    // File
    if (ProfilePhoto && typeof ProfilePhoto === "object") {
      const bytes = await ProfilePhoto.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadPath = path.join(process.cwd(), "public/uploads/profiles", ProfilePhoto.name);
      fs.writeFileSync(uploadPath, buffer);
      updateData.ProfilePhoto = `/uploads/profiles/${ProfilePhoto.name}`;
    }

    if (Signature && typeof Signature === "object") {
      const bytes = await Signature.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadPath = path.join(process.cwd(), "public/uploads/signatures", Signature.name);
      fs.writeFileSync(uploadPath, buffer);
      updateData.Signature = `/uploads/signatures/${Signature.name}`;
    }


    if (!Email && !Username && !Password && !Name && !Role && !ProfilePhoto && !Phone && !Signature) {
      return NextResponse.json({
        success: false,
        message: "Minimal satu field harus dikirim untuk diupdate."
      }, { status: 400 });
    }


    const updatedUser = await prisma.user.update({
      where: { IDUser: idUser },
      data: updateData,
    });

    
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
