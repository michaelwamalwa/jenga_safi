import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // Redirect unauthenticated users to login
  if (!token && !pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect users/admins to their respective dashboards
  if (token) {
    if (pathname === "/dashboard" && token.role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (pathname === "/admin" && token.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}