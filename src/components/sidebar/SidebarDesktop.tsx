import { SidebarButton } from "./SidebarButton";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import UserContext from "@/contexts/UserContext";
import { Link, usePathname, useRouter } from "@/i18n";
import { api, staticURL } from "@/lib/api";
import { SidebarItems } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { LogOut, MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useContext } from "react";
import { toast } from "sonner";

interface SidebarDesktopProps {
  sidebarItems: SidebarItems;
}

export function SidebarDesktop(props: SidebarDesktopProps) {
  const { user, setUser } = useContext(UserContext);
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("sidebar");

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const logoutPromise = api.post("/auth/logout");
      toast.promise(logoutPromise, {
        loading: t("logout.loading"),
        success: t("logout.success"),
        error: t("logout.error"),
      });

      return logoutPromise;
    },
    onSuccess: () => {
      setUser(null);
      router.replace("/login");
    },
  });

  return (
    <aside className="w-[270px] max-w-xs h-screen fixed left-0 top-0 border-r bg-white">
      <div className="h-full px-3 py-4">
        <div className="flex flex-row justify-between">
          <h3 className="mx-3 text-lg font-semibold text-foreground leading-10">
            Recipedia
          </h3>
          <LocaleSwitcher />
        </div>
        <div className="mt-5">
          <div className="flex flex-col gap-1 w-full">
            {props.sidebarItems.links.map((link, index) => (
              <Link key={index} href={link.href}>
                <SidebarButton
                  variant={pathname === link.href ? "secondary" : "ghost"}
                  icon={link.icon}
                  className="w-full"
                >
                  {link.label}
                </SidebarButton>
              </Link>
            ))}
            {user && props.sidebarItems.extras}
          </div>
          {user ? (
            <div className="absolute left-0 bottom-3 w-full px-3">
              <Separator className="absolute -top-3 left-0 w-full" />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={`${staticURL}/${user.imagePath}`}
                            alt={`${user.firstName}${user.lastName}`}
                          />
                          <AvatarFallback>
                            {user.firstName.at(0)}
                            {user.lastName.at(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="leading-8">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                      <MoreHorizontal size={20} />
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="mb-2 w-56 p-3 rounded-[1rem]">
                  <div className="space-y-1">
                    <SidebarButton
                      size="sm"
                      icon={LogOut}
                      className="w-full"
                      onClick={() => logoutMutation.mutate()}
                    >
                      {t("logout.title")}
                    </SidebarButton>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <div className="absolute w-full bottom-4 px-1 left-0">
              <Separator className="absolute -top-3 left-0 w-full" />
              <div className="flex flex-row gap-2 px-2">
                <SidebarButton
                  className="w-full justify-center"
                  variant="secondary"
                  onClick={() => router.push("/login")}
                >
                  {t("login")}
                </SidebarButton>
                <SidebarButton
                  className="w-full justify-center text-white"
                  variant="default"
                  onClick={() => router.push("/register")}
                >
                  {t("register")}
                </SidebarButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
