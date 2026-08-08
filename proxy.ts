import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

const isPublicRoute = createRouteMatcher([
  "/:locale",
  "/:locale/sign-in(.*)",
  "/:locale/sign-up(.*)",
  "/api/webhooks/clerk(.*)",
]);

const isProtectedRoute = createRouteMatcher([
  "/:locale/teacher(.*)",
  "/:locale/admin(.*)",
  "/:locale/payment(.*)",
  "/api/profile(.*)",
  "/api/payment(.*)",
  "/api/teacher(.*)",
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { pathname } = req.nextUrl;

  // Never run locale middleware on API routes
  if (pathname.startsWith("/api/")) {
    if (isProtectedRoute(req)) {
      await auth.protect();
    }

    return NextResponse.next();
  }

  // Run locale routing only for non-API app/page routes
  const i18nResponse = handleI18nRouting(req);

  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  return i18nResponse;
});

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)", "/api/(.*)"],
};
