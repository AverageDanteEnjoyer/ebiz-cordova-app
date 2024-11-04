"use client";

import { RecipePDF } from "@/components/RecipePDF";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import UserContext from "@/contexts/UserContext";
import { useRouter } from "@/i18n";
import { api, staticURL } from "@/lib/api";
import { RecipeDetails as RecipeDetailsType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Star, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function RecipeDetails({ id }: { id: number }) {
  const { user: loggedInUser } = useContext(UserContext);
  const router = useRouter();
  const t = useTranslations("recipe.details");
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<RecipeDetailsType>({
    queryKey: ["recipeDetails", id],
    queryFn: async () => {
      const res = await api.get(`/recipes/${id}`);
      if (res.status == 404) {
        return null;
      }
      if (!res.ok) {
        throw new Error(t("error.notFound"));
      }
      return await res.json();
    },
    enabled: !!id,
  });

  const commentSchema = z.object({
    text: z.string().min(1, t("errors.commentRequired")),
    rating: z.number().min(1, t("errors.ratingRequired")),
  });

  type CommentFormValues = z.infer<typeof commentSchema>;

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      text: "",
      rating: 0,
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (values: CommentFormValues) => {
      const response = await api.post(`/recipes/${id}/comments`, values);
      if (!response.ok) {
        throw new Error(t("errors.commentFailed"));
      }
      return response.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["recipeDetails", id] });
      form.reset();
      toast.success(t("success.commentAdded"));
    },
    onError: () => toast.error(t("errors.commentFailed")),
  });

  const deleteRecipeMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const response = await api.delete(`/recipes/${commentId}`);
      if (!response.ok) {
        throw new Error(t("errors.recipeDeleteFailed"));
      }
    },
    onSuccess: async () => {
      toast.success(t("success.recipeDeleted"));
      await queryClient.invalidateQueries({ queryKey: ["recipes"] });
      router.push("/recipes");
    },
    onError: () => toast.error(t("errors.recipeDeleteFailed")),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const response = await api.delete(`/comments/${commentId}`);
      if (!response.ok) {
        throw new Error(t("errors.commentDeleteFailed"));
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["recipeDetails", id] });
      toast.success(t("success.commentDeleted"));
    },
    onError: () => toast.error(t("errors.commentDeleteFailed")),
  });

  const onSubmit = (values: CommentFormValues) => {
    commentMutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div>{t("error.loading")}</div>;
  }

  if (!data) {
    return <div>{t("error.notFound")}</div>;
  }

  const {
    name,
    description,
    ingredients,
    instructions,
    avgRating,
    commentCount,
    imagePath,
    user,
    comments,
  } = data;

  const stars = (
    <div className="flex items-center flex-row">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          fill={index < avgRating ? "currentColor" : "none"}
          className="text-black-500"
        />
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center">{name}</h1>
        <div className="relative w-full h-auto aspect-[16/9] my-3">
          <Image
            src={`${staticURL}/${imagePath}`}
            alt={name}
            fill
            className="object-cover mb-4"
            unoptimized
          />
        </div>
        <div className="flex items-center gap-2">
          {stars}
          <span className="text-lg">
            (
            {t("ratings", {
              count: commentCount,
              avgRating: Number(avgRating).toFixed(1),
            })}
            )
          </span>
        </div>
        <p className="text-gray-700 mt-2">{description}</p>
        <p className="text-sm text-gray-500 mt-1">
          {t("by")} {user.firstName} {user.lastName}
        </p>
        {loggedInUser &&
          (loggedInUser.id === user.id || loggedInUser.role === "ADMIN") && (
            <div className="flex flex-row gap-3 mt-2">
              <Button
                variant="secondary"
                onClick={() => router.push(`/recipes/${data.id}/edit`)}
              >
                {t("edit")}
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteRecipeMutation.mutate(data.id)}
              >
                {t("delete")}
              </Button>
            </div>
          )}
        <Separator className="my-4" />

        <div className="w-full">
          <h2 className="text-2xl font-semibold mb-2">{t("ingredients")}</h2>
          <p className="text-gray-700 whitespace-pre-line mb-4">
            {ingredients}
          </p>
          <h2 className="text-2xl font-semibold mb-2">{t("instructions")}</h2>
          <p className="text-gray-700 whitespace-pre-line">{instructions}</p>

          <PDFDownloadLink
            document={<RecipePDF recipe={data} />}
            fileName={`${data.name}.pdf`}
          >
            {({ loading: pdfLoading }) => (
              <Button type="submit" disabled={pdfLoading}>
                {pdfLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("print")}
              </Button>
            )}
          </PDFDownloadLink>
          <Separator className="my-4" />

          <h2 className="text-2xl font-semibold mb-2">{t("addComment")}</h2>
          {loggedInUser ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 mb-4"
              >
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder={t("comment") + "..."}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("fields.rating")}</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => field.onChange(value)}
                              className={`mr-1 ${
                                value <= field.value
                                  ? "text-black-500"
                                  : "text-gray-300"
                              }`}
                            >
                              <Star fill="currentColor" />
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <Button type="submit" disabled={commentMutation.isPending}>
                    {commentMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t("submit")}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <p className="text-gray-500">{t("loginToComment")}</p>
          )}

          <Separator className="my-4" />

          <h2 className="text-2xl font-semibold mb-2">{t("comments")}</h2>
          <div className="space-y-2">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border p-3 rounded-md flex flex-row"
                >
                  <div className="flex justify-center mr-3">
                    <Avatar className="w-16 h-16">
                      <AvatarImage
                        src={`${staticURL}/${comment.user.imagePath}`}
                        alt={`${comment.user.firstName}${comment.user.lastName}`}
                      />
                      <AvatarFallback>
                        {comment.user.firstName.at(0)}
                        {comment.user.lastName.at(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex flex-row text-md">
                      <p className="text-primary font-bold">
                        {comment.user.firstName} {comment.user.lastName}
                      </p>
                      <p className="text-gray-500 ml-2">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          fill={
                            index < comment.rating ? "currentColor" : "none"
                          }
                          className="text-black-500"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                  {loggedInUser &&
                    (loggedInUser.id === comment.user.id ||
                      loggedInUser.role === "ADMIN") && (
                      <div className="flex justify-center items-center ml-auto">
                        <Button
                          disabled={deleteCommentMutation.isPending}
                          variant="destructive"
                          size="icon"
                          onClick={() =>
                            deleteCommentMutation.mutate(comment.id)
                          }
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">{t("noComments")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
