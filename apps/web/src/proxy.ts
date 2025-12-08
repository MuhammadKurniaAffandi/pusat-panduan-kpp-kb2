import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes yang memerlukan auth
  const protectedRoutes = ["/dashboard", "/help", "/article", "/user"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    const token = request.cookies.get("accessToken")?.value;

    if (!token) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect dari login ke dashboard jika sudah auth
  if (pathname === "/auth/login") {
    const token = request.cookies.get("accessToken")?.value;
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/help/:path*",
    "/article/:path*",
    "/user/:path*",
    "/auth/login",
  ],
};
