import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ONBOARDING_PATH = "/onboarding";
const DASHBOARD_PATH = "/";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const onboarded = request.cookies.get("aura-onboarded")?.value === "1";

  if (pathname === DASHBOARD_PATH && !onboarded) {
    return NextResponse.redirect(new URL(ONBOARDING_PATH, request.url));
  }

  if (pathname === ONBOARDING_PATH && onboarded) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/onboarding"],
};
