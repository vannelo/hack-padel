import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./utils/auth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;

  if (!token || !(await verifyToken(token))) {
    // Store the original URL in a cookie
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.set("originalUrl", req.url, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 300, // 5 minutes
      path: "/",
      sameSite: "strict",
    });
    return response;
  }

  return NextResponse.next();
}

// Protect routes under /admin
export const config = {
  matcher: ["/admin/:path*"],
};
