import { locales } from "@/i18n";
import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

const nextIntlMiddleware = createMiddleware({
  locales,
  defaultLocale: "pl",
  localePrefix: "always",
});

export default async function middleware(req: NextRequest) {
  // const [, locale, ...segments] = req.nextUrl.pathname.split("/");
  // const path = segments.join("/");
  return nextIntlMiddleware(req);
}

export const config = {
  matcher: ["/", "/(pl|en)/:path*"],
};
