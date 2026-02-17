import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createIntlMiddleware(routing);

export function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  const token = request.cookies.get("firebase-auth-token")?.value;
  const { pathname } = request.nextUrl;
  const pathWithoutLocale = pathname.replace(/^\/(fr|en)/, "") || "/";

  if (pathWithoutLocale.startsWith("/dashboard") && !token) {
    const locale = pathname.startsWith("/en") ? "en" : "fr";
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("redirect", pathWithoutLocale);
    return NextResponse.redirect(loginUrl);
  }

  if (pathWithoutLocale.startsWith("/login") && token) {
    const locale = pathname.startsWith("/en") ? "en" : "fr";
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return response;
}

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
