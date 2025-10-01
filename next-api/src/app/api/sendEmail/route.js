import { NextResponse } from "next/server";
import { sendEmail } from "../../../../lib/email";

export async function POST(request) {
    try {
        const contentType = request.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
            throw new Error("Invalid content-type. Expected application/json");
        }

        const body = await request.json();
        const { to, cc, subject, text, html } = body;

        if (!subject) {
            throw new Error("Email subject is required");
        }

        const info = await sendEmail({ to, cc, subject, text, html });

        return NextResponse.json({
            success: true,
            message: "Email sent successfully",
            info,
        });
    } catch (error) {
        console.error("Email send error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to send email",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
