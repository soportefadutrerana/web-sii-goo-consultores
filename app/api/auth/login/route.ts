import { NextResponse } from "next/server";

export async function POST(request: Request) {
  return NextResponse.json({ error: "Use /api/auth/signin para autenticacion" }, { status: 405 });
}
