import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request, { params }) {
  const { LineItemID } = params ?? {};

  if (!LineItemID) {
    return NextResponse.json(
      {
        success: false,
        message: "Line item ID is required",
      },
      { status: 400 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const existingPath = formData.get("existingPath");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "File is required",
        },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          message: "Only image uploads are supported",
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "File exceeds 5MB limit",
        },
        { status: 400 },
      );
    }

    const uploadDir = path.join(process.cwd(), "public/uploads/photoPartUnit");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const filename = `${Date.now()}-${LineItemID}-${sanitizedName}`;
    const targetPath = path.join(uploadDir, filename);
    fs.writeFileSync(targetPath, buffer);

    if (existingPath) {
      const absoluteExistingPath = path.join(
        process.cwd(),
        "public",
        existingPath.toString().replace(/^\/+/, ""),
      );
      if (absoluteExistingPath.startsWith(uploadDir) && fs.existsSync(absoluteExistingPath)) {
        try {
          fs.unlinkSync(absoluteExistingPath);
        } catch (error) {
          console.warn("Failed to remove previous photoPartUnit file", error);
        }
      }
    }

    const publicPath = `/uploads/photoPartUnit/${filename}`;

    return NextResponse.json(
      {
        success: true,
        message: "Photo uploaded",
        data: {
          path: publicPath,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to upload photoPartUnit:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload photo",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("path");

    if (!filePath) {
      return NextResponse.json(
        {
          success: false,
          message: "File path is required",
        },
        { status: 400 },
      );
    }

    const absolutePath = path.join(process.cwd(), "public", filePath.replace(/^\/+/, ""));
    const uploadDir = path.join(process.cwd(), "public/uploads/photoPartUnit");

    if (!absolutePath.startsWith(uploadDir)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid path",
        },
        { status: 400 },
      );
    }

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Photo deleted",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to delete photoPartUnit:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete photo",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
