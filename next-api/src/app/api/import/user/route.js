import * as XLSX from "xlsx";
import prisma from "../../../../../prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET() {
  try {
    // Excel headers
    const headers = [
      "Email",
      "Username",
      "Password",
      "Name",
      "Role",
      "Phone",
      "ResourceId",
    ];

    // Worksheet data (AOA)
    const worksheetData = [headers];

    // Example row (SAFE placeholders)
    worksheetData.push([
      "john.doe@email.com",
      "johndoe",
      "CHANGE_ME",
      "John Doe",
      "user",
      "08123456789",
      "RES-001",
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "User Import Template"
    );

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Disposition":
          'attachment; filename="User_Import_Template.xlsx"',
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Error generating user import template:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate template" },
      { status: 500 }
    );
  }
}


export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({
        success: false,
        message: "No file uploaded.",
      });
    }

    // Convert file → buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Read Excel
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!sheet.length) {
      return NextResponse.json({
        success: false,
        message: "Excel file is empty",
      });
    }

    // Collect unique emails & usernames
    const emails = [...new Set(sheet.map(r => r.Email?.trim()))].filter(Boolean);
    const usernames = [...new Set(sheet.map(r => r.Username?.trim()))].filter(Boolean);

    // Check existing users
    const existingUsers = await prisma.user.findMany({
      where: {
        OR: [
          { Email: { in: emails } },
          { Username: { in: usernames } },
        ],
      },
      select: { Email: true, Username: true },
    });

    const existingEmailSet = new Set(existingUsers.map(u => u.Email));
    const existingUsernameSet = new Set(existingUsers.map(u => u.Username));

    // Map & validate rows
    const validUsers = [];

    for (const r of sheet) {
      const email = r.Email?.trim();
      const username = r.Username?.trim();
      const password = r.Password?.toString();

      if (!email || !username || !password) continue;
      if (existingEmailSet.has(email)) continue;
      if (existingUsernameSet.has(username)) continue;

      const hashedPassword = await bcrypt.hash(password, 10);

      validUsers.push({
        Email: email,
        Username: username,
        Password: hashedPassword,
        Name: r.Name?.trim() || username,
        Role: r.Role?.trim() || "user",
        Phone: r.Phone?.toString() || null,
        ResourceId: r.ResourceId?.trim() || null,
      });
    }

    if (!validUsers.length) {
      return NextResponse.json({
        success: false,
        message: "No valid user found to import",
      });
    }

    // Insert
    await prisma.user.createMany({
      data: validUsers,
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${validUsers.length} users.`,
    });

  } catch (error) {
    console.error("User Import Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
