import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Debug: Log all cookies
  if (process.env.NODE_ENV === "development" || pathname.startsWith("/dashboard")) {
    console.log("[Middleware] Path:", pathname);
    console.log("[Middleware] All cookies:", request.cookies.getAll());
  }

  // Check for better-auth session token in cookies
  // Better Auth uses multiple possible cookie names, check all of them
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("session_token")?.value ||
    request.cookies.get("better_auth_session")?.value ||
    request.cookies.get("auth_session")?.value;

  if (process.env.NODE_ENV === "development" || pathname.startsWith("/dashboard")) {
    console.log("[Middleware] Session token found:", !!sessionToken);
  }

  // Public routes that don't need authentication
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/icons") ||
    pathname.startsWith("/images");

  // Protected routes that absolutely need auth
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/prediction") ||
    pathname.startsWith("/stocks");

  // If user is not authenticated and trying to access protected route
  if (!sessionToken && isProtectedRoute) {
    // Redirect to home/landing page
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (
    sessionToken &&
    (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"],
};
