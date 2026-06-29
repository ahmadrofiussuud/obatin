import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { RBAC_ROUTES, UserRole } from "./config";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const userRole = token.role as UserRole;

    // 1. Verify dashboard routes
    if (pathname.startsWith("/dashboard")) {
      // Find matching role configurations
      const allowedDoctorRoutes = RBAC_ROUTES.protected.DOCTOR;
      const allowedNurseRoutes = RBAC_ROUTES.protected.NURSE;
      const allowedPatientRoutes = RBAC_ROUTES.protected.PATIENT;
      const allowedAdminRoutes = RBAC_ROUTES.protected.ADMIN;
      const allowedSuperAdminRoutes = RBAC_ROUTES.protected.SUPER_ADMIN;

      let isAuthorized = false;

      if (userRole === "SUPER_ADMIN") {
        isAuthorized = allowedSuperAdminRoutes.some(route => pathname.startsWith(route));
      } else if (userRole === "ADMIN") {
        isAuthorized = allowedAdminRoutes.some(route => pathname.startsWith(route));
      } else if (userRole === "DOCTOR") {
        isAuthorized = allowedDoctorRoutes.some(route => pathname.startsWith(route));
      } else if (userRole === "NURSE") {
        isAuthorized = allowedNurseRoutes.some(route => pathname.startsWith(route));
      } else if (userRole === "PATIENT") {
        isAuthorized = allowedPatientRoutes.some(route => pathname.startsWith(route));
      }

      if (!isAuthorized) {
        let destination = "/login";
        if (userRole === "PATIENT") destination = "/dashboard/patient";
        else if (userRole === "DOCTOR" || userRole === "NURSE") destination = "/dashboard";
        else if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") destination = "/dashboard/admin";

        return NextResponse.redirect(new URL(destination, req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Returns true if token exists, triggering the middleware function
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Matcher paths - Middleware intercepts all requests on these routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    // Also protect API routes from general unauthenticated requests
    "/api/records/:path*",
    "/api/blockchain/:path*",
    "/api/ai/:path*",
  ],
};
