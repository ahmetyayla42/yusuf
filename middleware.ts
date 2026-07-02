import { NextRequest, NextResponse } from "next/server";
import { decryptSession, SESSION_COOKIE } from "./lib/session";

// Rota koruması: /admin sadece admin, /dashboard sadece müşteri.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await decryptSession(token);

  if (pathname.startsWith("/admin")) {
    if (!session || session.role !== "admin") {
      return NextResponse.redirect(new URL("/login/admin", req.url));
    }
  }

  if (pathname.startsWith("/dashboard")) {
    if (!session || session.role !== "client") {
      return NextResponse.redirect(new URL("/login/client", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
