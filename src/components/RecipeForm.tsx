"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRedirectIfNotLoggedIn } from "@/hooks/useRedirectIfNotLoggedIn";
import { useRouter } from "@/i18n";
import { ApiURL } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

function RecipeForm() {
  useRedirectIfNotLoggedIn();
  const queryClient = useQueryClient();
  const t = useTranslations("recipe");
  const router = useRouter();

  const recipeSchema = z.object({
    name: z.string().min(1, t("errors.nameRequired")),
    description: z.string().min(1, t("errors.descriptionRequired")),
    image: z.custom<File>((v) => v instanceof File, {
      message: t("errors.imageRequired"),
    }),
    ingredients: z.string().min(1, t("errors.ingredientsRequired")),
    instructions: z.string().min(1, t("errors.instructionsRequired")),
  });

  type RecipeFormValues = z.infer<typeof recipeSchema>;

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: "",
      description: "",
      image: undefined,
      ingredients: "",
      instructions: "",
    },
  });

  const recipeMutation = useMutation({
    mutationFn: async (values: RecipeFormValues) => {
      const formData = new FormData();
      formData.append(
        "recipe",
        JSON.stringify({
          name: values.name,
          description: values.description,
          ingredients: values.ingredients,
          instructions: values.instructions,
        })
      );
      formData.append("image", values.image);

      const recipePromise = fetch(`${ApiURL}/recipes`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      toast.promise(recipePromise, {
        loading: t("create.loading"),
        success: t("create.success"),
        error: t("create.error"),
      });

      return recipePromise;
    },
    onSuccess: async (res) => {
      if (res.ok) {
        await queryClient.invalidateQueries({ queryKey: ["recipes"] });
        router.push("/recipes");
      } else {
        toast.error(t("errors.createFailed"));
      }
    },
    onError: () => toast.error(t("generalError")),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => recipeMutation.mutate(values))}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fields.name")}</FormLabel>
              <FormDescription>{t("fields.nameDescription")}</FormDescription>
              <FormControl>
                <Input
                  autoFocus
                  placeholder={t("fields.name") + "..."}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fields.description")}</FormLabel>
              <FormDescription>
                {t("fields.descriptionDescription")}
              </FormDescription>
              <FormControl>
                <Textarea
                  placeholder={t("fields.description") + "..."}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>{t("fields.image")}</FormLabel>
              <FormDescription>{t("fields.imageDescription")}</FormDescription>
              <FormControl>
                <Input
                  {...fieldProps}
                  type="file"
                  accept="image/*"
                  placeholder={t("fields.image") + "..."}
                  onChange={(e) => {
                    onChange(e.target.files && e.target.files[0]);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ingredients"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fields.ingredients")}</FormLabel>
              <FormDescription>
                {t("fields.ingredientsDescription")}
              </FormDescription>
              <FormControl>
                <Textarea
                  placeholder={t("fields.ingredients") + "..."}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fields.instructions")}</FormLabel>
              <FormDescription>
                {t("fields.instructionsDescription")}
              </FormDescription>
              <FormControl>
                <Textarea
                  placeholder={t("fields.instructions") + "..."}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button type="submit" disabled={recipeMutation.isPending}>
            {recipeMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("create.submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default RecipeForm;
