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
  // 1. Run next-intl locale routing first
  const i18nResponse = handleI18nRouting(req);
  if (i18nResponse.status !== 200) return i18nResponse;

  // 2. Protect routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  return i18nResponse;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
