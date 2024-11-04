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
import UserContext from "@/contexts/UserContext";
import { useRedirectIfNotLoggedIn } from "@/hooks/useRedirectIfNotLoggedIn";
import { useRouter } from "@/i18n";
import { api, ApiURL } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface RecipeFormProps {
  id: number;
}

const recipeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  image: z
    .custom<File>((v) => v instanceof File, {
      message: "Image is required",
    })
    .optional(),
  ingredients: z.string().min(1, "Ingredients are required"),
  instructions: z.string().min(1, "Instructions are required"),
});

type RecipeFormValues = z.infer<typeof recipeSchema>;

function EditRecipeForm({ id }: RecipeFormProps) {
  useRedirectIfNotLoggedIn();
  const { user, fetched } = useContext(UserContext);
  const t = useTranslations("recipe");
  const router = useRouter();

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

  const { data: recipe, isLoading: isRecipeLoading } = useQuery({
    queryKey: ["recipe", id],
    queryFn: async () => {
      const res = await api.get(`/recipes/${id}`);
      return await res.json();
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (recipe) {
      if (
        fetched &&
        user &&
        !(user.id === recipe.user.id || user.role === "ADMIN")
      ) {
        router.replace("/");
        return;
      }
      form.reset({
        name: recipe.name,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      });
    }
  }, [recipe, form]);

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
      formData.append("image", values.image || new Blob());

      const recipePromise = fetch(`${ApiURL}/recipes/${id}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });
      toast.promise(recipePromise, {
        loading: t("update.loading"),
        success: t("update.success"),
        error: t("update.error"),
      });

      return recipePromise;
    },
    onSuccess: async (res) => {
      if (res.ok) {
        router.push("/recipes");
      } else {
        toast.error(t("errors.updateFailed"));
      }
    },
    onError: () => toast.error(t("generalError")),
  });

  if (isRecipeLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">{t("update.title")}</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) =>
            recipeMutation.mutate(values)
          )}
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
                  <Input autoFocus placeholder={t("fields.name")} {...field} />
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
                  <Textarea placeholder={t("fields.description")} {...field} />
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
                <FormDescription>
                  {t("fields.imageDescription")}
                </FormDescription>
                <FormControl>
                  <Input
                    {...fieldProps}
                    type="file"
                    accept="image/*"
                    placeholder={t("fields.image")}
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
                  <Textarea placeholder={t("fields.ingredients")} {...field} />
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
                  <Textarea placeholder={t("fields.instructions")} {...field} />
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
              {t("update.submit")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default EditRecipeForm;
