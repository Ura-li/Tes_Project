import { NextResponse } from "next/server";

const methodNotAllowed = NextResponse.json(
  {
    success: false,
    message: "Gunakan endpoint quotation utama untuk mengelola line item.",
  },
  { status: 405 },
);

export function GET() {
  return methodNotAllowed;
}

export function POST() {
  return methodNotAllowed;
}

export function PATCH() {
  return methodNotAllowed;
}

export function DELETE() {
  return methodNotAllowed;
}
