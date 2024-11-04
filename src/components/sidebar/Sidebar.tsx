"use client";

import { SidebarButton } from "./SidebarButton";
import { SidebarDesktop } from "./SidebarDesktop";
import { SidebarMobile } from "./SidebarMobile";
import { useRouter } from "@/i18n";
import { SidebarItems } from "@/types";
import { Home, List, Store, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMediaQuery } from "usehooks-ts";

export function Sidebar() {
  const router = useRouter();
  const t = useTranslations("sidebar");
  const isDesktop = useMediaQuery("(min-width: 640px)", {
    initializeWithValue: false,
    defaultValue: true,
  });

  const sidebarItems: SidebarItems = {
    links: [
      { label: t("home"), href: "/", icon: Home },
      { label: t("recipes"), href: "/recipes", icon: List },
      { label: t("profile"), href: "/profile/me", icon: User },
      { label: t("store"), href: "/store", icon: Store },
    ],
    extras: (
      <div className="flex flex-col gap-2 mt-5">
        <SidebarButton
          className="w-full justify-center"
          variant="default"
          onClick={() => router.push("/recipes/new")}
        >
          {t("addRecipe")}
        </SidebarButton>
      </div>
    ),
  };

  if (isDesktop) {
    return <SidebarDesktop sidebarItems={sidebarItems} />;
  }

  return <SidebarMobile sidebarItems={sidebarItems} />;
}
