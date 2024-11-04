"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { PASSWORD_REGEX } from "@/constants";
import UserContext from "@/contexts/UserContext";
import { useRedirectIfNotLoggedIn } from "@/hooks/useRedirectIfNotLoggedIn";
import { api, ApiURL, staticURL } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function EditProfile() {
  useRedirectIfNotLoggedIn();
  const queryClient = useQueryClient();
  const { setUser } = useContext(UserContext);
  const t = useTranslations("profile");
  const tAuth = useTranslations("auth");

  const editProfileSchema = z.object({
    image: z
      .custom<File>((v) => v instanceof File, {
        message: t("error.imageRequired"),
      })
      .optional(),
    firstName: z
      .string()
      .min(2, { message: tAuth("errors.firstNameMinLength", { minLength: 2 }) })
      .regex(/^[a-zA-Z]+$/, { message: tAuth("errors.firstNameAlphabet") }),
    lastName: z
      .string()
      .min(2, { message: tAuth("errors.lastNameMinLength", { minLength: 2 }) })
      .regex(/^[a-zA-Z]+$/, { message: tAuth("errors.lastNameAlphabet") }),
    email: z.string().email({ message: tAuth("errors.email") }),
    bio: z
      .string()
      .max(255, { message: tAuth("errors.bioMaxLength", { maxLength: 255 }) })
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, { message: tAuth("errors.passwordMinLength", { minLength: 8 }) })
      .regex(PASSWORD_REGEX, {
        message: tAuth("errors.passwordComplexity"),
      })
      .optional()
      .or(z.literal("")),
  });

  type EditProfileFormValues = z.infer<typeof editProfileSchema>;

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await api.get("/users/me");
      return await res.json();
    },
  });

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      bio: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio,
        password: undefined,
      });
    }
  }, [user, form]);

  const profileMutation = useMutation({
    mutationFn: async (values: EditProfileFormValues) => {
      const formData = new FormData();
      formData.append(
        "user",
        JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          bio: values.bio,
          ...(values.password && { password: values.password }),
        })
      );

      formData.append("image", values.image || new Blob());

      const promise = fetch(`${ApiURL}/users/${user.id}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });
      toast.promise(promise, {
        loading: t("edit.updatingProfile"),
        success: t("edit.profileUpdated"),
        error: t("edit.failedToUpdateProfile"),
      });

      return promise;
    },
    onSuccess: async (res) => {
      if (res.ok) {
        if (form.formState.dirtyFields.email) {
          await api.post("/auth/logout");
          setUser(null);
          return;
        }
        setUser(await res.json());
        await queryClient.invalidateQueries({
          queryKey: ["userProfile"],
        });
      } else {
        form.setError("email", {
          type: "manual",
          message: tAuth("errors.emailTaken"),
        });
      }
    },
    onError: () => toast.error(t("generalError")),
  });

  const onSubmit = (values: EditProfileFormValues) => {
    profileMutation.mutate(values);
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

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">{t("editProfile")}</h1>
      <div className="flex justify-center mb-8 w-full ">
        <Avatar className="w-32 h-32">
          <AvatarImage
            src={`${staticURL}/${user.imagePath}`}
            alt={`${user.firstName}${user.lastName}`}
          />
          <AvatarFallback className="text-2xl">
            {user.firstName.at(0)}
            {user.lastName.at(0)}
          </AvatarFallback>
        </Avatar>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="image"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>{tAuth("image")}</FormLabel>
                <FormDescription>{tAuth("imageDescription")}</FormDescription>
                <FormControl>
                  <Input
                    {...fieldProps}
                    type="file"
                    accept="image/*"
                    placeholder={tAuth("image") + "..."}
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
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tAuth("firstName")}</FormLabel>
                <FormDescription>
                  {tAuth("firstNameDescription")}
                </FormDescription>
                <FormControl>
                  <Input
                    autoFocus
                    placeholder={tAuth("firstName") + "..."}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tAuth("lastName")}</FormLabel>
                <FormDescription>
                  {tAuth("lastNameDescription")}
                </FormDescription>
                <FormControl>
                  <Input placeholder={tAuth("lastName") + "..."} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tAuth("email")}</FormLabel>
                <FormDescription>{tAuth("emailDescription")}</FormDescription>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={tAuth("email") + "..."}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tAuth("bio")}</FormLabel>
                <FormDescription>{tAuth("bioDescription")}</FormDescription>
                <FormControl>
                  <Textarea placeholder={tAuth("bio") + "..."} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tAuth("password")}</FormLabel>
                <FormDescription>
                  {tAuth("changePasswordDescription")}
                </FormDescription>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={tAuth("password") + "..."}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Button type="submit" disabled={profileMutation.isPending}>
              {profileMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("saveChanges")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
