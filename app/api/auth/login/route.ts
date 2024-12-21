import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { generateToken } from "@/utils/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await generateToken({ id: user.id, email: user.email });

  const originalUrl = req.cookies.get("originalUrl")?.value || "/admin";

  const response = NextResponse.json({
    success: true,
    redirectUrl: originalUrl,
  });
  response.cookies.set("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600,
    path: "/",
    sameSite: "strict",
  });

  // Clear the originalUrl cookie
  response.cookies.set("originalUrl", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
    sameSite: "strict",
  });

  return response;
}
