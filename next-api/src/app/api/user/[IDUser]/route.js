import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import bcrypt from "bcryptjs";

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
    const body = await request.json();
    const { Email, Username, Password, Name, Role, ProfilePhoto } = body;

    if (!Email && !Username && !Password && !Name && !Role && !ProfilePhoto) {
      return NextResponse.json({
        success: false,
        message: "Minimal satu field harus dikirim untuk diupdate."
      }, { status: 400 });
    }

    const dataToUpdate = {};
    if (Email) dataToUpdate.Email = Email;
    if (Username) dataToUpdate.Username = Username;
    if (Password) dataToUpdate.Password = await bcrypt.hash(Password, 10);
    if (Name) dataToUpdate.Name = Name;
    if (Role) dataToUpdate.Role = Role;
    if (ProfilePhoto) dataToUpdate.ProfilePhoto = ProfilePhoto;

    const updatedUser = await prisma.user.update({
      where: { IDUser: idUser },
      data: dataToUpdate,
    });

    return NextResponse.json({
      success: true,
      message: "Data user berhasil diperbarui",
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
