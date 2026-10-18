import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { hasClerkKeys } from "./lib/flags";

const isPublic = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)", "/kit(.*)"]);

const clerk = clerkMiddleware(async (auth, req) => {
  if (isPublic(req)) return;
  await auth.protect();
});

export default function middleware(request: NextRequest, event: NextFetchEvent) {
  if (process.env.DEMO_SCREENSHOT === "1") return NextResponse.next();
  if (process.env.NODE_ENV === "production" && !hasClerkKeys()) return NextResponse.next();
  return clerk(request, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
