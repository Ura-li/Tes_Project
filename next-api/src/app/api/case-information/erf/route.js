import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";
import fs from "fs";
import path from "path";

// ✅ Max file size limit (in bytes) — here 10 MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll("files"); // multiple file inputs with same name
        const userId = formData.getAll("user");
        console.log(userId);

        if (!files || files.length === 0) {
            return NextResponse.json(
                { success: false, message: "No files uploaded" },
                { status: 400 }
            );
        }

        // ✅ Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), "public", "uploads", "erf");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const results = [];

        for (const file of files) {
            const originalName = file.name;
            const caseId = path.parse(originalName).name; // filename without extension
            
            // ✅ 1. Validate CaseID format (must not be empty, must be alphanumeric)
            if (!/^[Cc]-\d+$/.test(caseId)) {
                results.push({
                    file: originalName,
                    status: "failed",
                    message: `Invalid filename: ${originalName}. Must match a valid CaseID (C-[CaseID]).`,
                });
                continue;
            }

            
            // ✅ 2. Check if CaseID exists in DB
            const caseExists = await prisma.caseinformation.findUnique({
                where: { CaseID: caseId },
            });
            
            if (!caseExists) {
                results.push({
                    file: originalName,
                    status: "failed",
                    message: `No case found with ID: ${caseId}`,
                });
                continue;
            }
            // ✅ 3. Check file size before saving
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const fileSize = buffer.byteLength;

            if (fileSize > MAX_FILE_SIZE) {
                results.push({
                    file: originalName,
                    status: "failed",
                    message: `File too large (${(fileSize / 1024 / 1024).toFixed(
                        2
                    )} MB). Max allowed is ${MAX_FILE_SIZE / 1024 / 1024} MB.`,
                });
                continue;
            }

            // ✅ 4. Save file to disk
            const savePath = path.join(uploadDir, originalName);
            fs.writeFileSync(savePath, buffer);
            const relativePath = `/uploads/erf/${originalName}`;

            // ✅ 5. Update ErfDoc (append if already has files)
            await prisma.caseinformation.update({
                where: { CaseID: caseId },
                data: {
                    ErfDoc: caseExists.ErfDoc
                        ? `${caseExists.ErfDoc},${relativePath}`
                        : relativePath,
                },
            });

            // 6. update case note
            await prisma.casenotes.create({
                data: {
                    CaseID : caseId,
                    LogType: "Notice ERF Upload",
                    ActionType: "System Log",
                    Template: "",
                    VisibleExternally: true,
                    MinutesSpent: 0,
                    Note: noteText,
                    CreatedBy: ownerIdNumber,
                },
            })

            results.push({
                file: originalName,
                status: "success",
                message: `File uploaded and linked to case ${caseId}`,
                path: relativePath,
            });
        }

        return NextResponse.json({
            success: true,
            message: "Upload process completed",
            results,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "File upload failed",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
