"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, usePathname, Locale } from "@/i18n";
import clsx from "clsx";
import { ReactNode, useTransition } from "react";

type Props = {
  children: ReactNode;
  defaultValue: string;
};

export default function LocaleSwitcherSelect({
  children,
  defaultValue,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  function onSelectChange(value: Locale) {
    const nextLocale = value;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <Label
      className={clsx(
        isPending && "transition-opacity [&:disabled]:opacity-30"
      )}
    >
      <Select
        defaultValue={defaultValue}
        disabled={isPending}
        onValueChange={onSelectChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>{children}</SelectGroup>
        </SelectContent>
      </Select>
    </Label>
  );
}
