import { createSharedPathnamesNavigation } from "next-intl/navigation";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export const locales = ["en", "pl"] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  const baseLocale = new Intl.Locale(locale).baseName as Locale;
  if (!locales.includes(baseLocale)) notFound();

  return {
    messages: (await import(`./messages/${baseLocale}.json`)).default,
  };
});

export const { Link, usePathname, useRouter, redirect } =
  createSharedPathnamesNavigation({ locales });
