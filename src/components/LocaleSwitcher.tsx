import LocaleSwitcherSelect from "./LocaleSwitcherSelect";
import { SelectItem } from "@/components/ui/select";
import { locales } from "@/i18n";
import { useLocale, useTranslations } from "next-intl";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect defaultValue={locale}>
      {locales.map((cur) => (
        <SelectItem key={cur} value={cur}>
          {t("locale", { locale: cur })}
        </SelectItem>
      ))}
    </LocaleSwitcherSelect>
  );
}
