"use client";

import CustomPagination from "@/components/CustomPagination";
import RecipeCard from "@/components/RecipeCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import { Paginated, RecipeListItem } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

type FilterParams = {
  name: string;
  page: number;
  size: number;
};

const sizeOptions = [10, 25, 100];

export default function RecipeList() {
  const t = useTranslations("recipe");
  const searchParams = useSearchParams();
  const [filterOptions, setFilterOptions] = useState<FilterParams>({
    name: searchParams.get("name") || "",
    page: searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1,
    size: searchParams.get("size")
      ? parseInt(searchParams.get("size") as string)
      : 10,
  });
  const debouncedName = useDebounce(filterOptions.name, 500);

  const { data, isLoading } = useQuery<Paginated<RecipeListItem>>({
    queryKey: [
      "recipes",
      debouncedName,
      filterOptions.page,
      filterOptions.size,
    ],
    queryFn: async () => {
      const params = new URLSearchParams(searchParams);
      params.set("name", debouncedName);
      params.set("page", filterOptions.page.toString());
      params.set("size", filterOptions.size.toString());
      window.history.pushState(null, "", `?${params.toString()}`);

      const res = await api.get(
        `/recipes?name=${debouncedName}&page=${filterOptions.page - 1}&size=${filterOptions.size}`
      );
      return await res.json();
    },
  });

  return (
    <div className="flex flex-col max-w">
      <div className="flex flex-row items-center gap-2">
        <Label htmlFor="name">{t("list.filterByName")}</Label>
        <Input
          id="name"
          type="text"
          placeholder={t("fields.name") + "..."}
          className="max-w-xs"
          value={filterOptions.name}
          onChange={(e) =>
            setFilterOptions({
              ...filterOptions,
              name: e.target.value,
            })
          }
        />
      </div>
      <Separator className="my-4" />
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="mr-2 h-16 w-16 animate-spin" />
        </div>
      ) : (
        <div className="flex justify-center flex-wrap gap-5 mt-3">
          {data?.content.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              className="max-w-64 border"
              aspectRatio="portrait"
              width={250}
              height={330}
              recipe={recipe}
            />
          ))}
        </div>
      )}
      <Separator className="my-4" />
      <div className="flex justify-center gap-2">
        <div className="flex flex-col w-full">
          {data && data.totalPages > 1 && (
            <CustomPagination
              totalPages={data?.totalPages || 0}
              initialPage={filterOptions.page}
              onPageChange={(page) =>
                setFilterOptions({
                  ...filterOptions,
                  page: page,
                })
              }
            />
          )}
          <div className="flex w-full flex-col items-end gap-2">
            <div>
              <Label>{t("list.elementsPerPage")}</Label>
              <Select
                value={filterOptions.size.toString()}
                onValueChange={(value) =>
                  setFilterOptions({
                    ...filterOptions,
                    size: parseInt(value),
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {!sizeOptions.includes(filterOptions.size) && (
                      <SelectItem value={filterOptions.size.toString()}>
                        {filterOptions.size}
                      </SelectItem>
                    )}
                    {sizeOptions.map((value) => (
                      <SelectItem key={value} value={value.toString()}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
