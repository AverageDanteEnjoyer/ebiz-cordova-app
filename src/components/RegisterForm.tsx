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
import { PASSWORD_REGEX } from "@/constants";
import UserContext from "@/contexts/UserContext";
import { useRouter } from "@/i18n";
import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import FacebookLogin, { ReactFacebookFailureResponse, ReactFacebookLoginInfo } from "react-facebook-login";

function RegisterForm() {
  const { setUser } = useContext(UserContext);
  const router = useRouter();
  const t = useTranslations("auth");

  const registerSchema = z.object({
    email: z.string().email({ message: t("errors.email") }),
    firstName: z
      .string()
      .min(2, { message: t("errors.firstNameMinLength", { minLength: 2 }) })
      .regex(/^[a-zA-Z]+$/, { message: t("errors.firstNameAlphabet") }),
    lastName: z
      .string()
      .min(2, { message: t("errors.lastNameMinLength", { minLength: 2 }) })
      .regex(/^[a-zA-Z]+$/, { message: t("errors.lastNameAlphabet") }),
    password: z
      .string()
      .min(8, { message: t("errors.passwordMinLength", { minLength: 8 }) })
      .regex(PASSWORD_REGEX, {
        message: t("errors.passwordComplexity"),
      }),
  });

  type RegisterFormValues = z.infer<typeof registerSchema>;

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      const registerPromise = api.post("/auth/register", values);
      toast.promise(registerPromise, {
        loading: t("register.loading"),
        success: t("register.success"),
        error: t("register.error"),
      });

      return registerPromise;
    },
    onSuccess: async (res) => {
      if (res.ok) {
        setUser(await res.json());
        router.replace("/");
      } else {
        form.setError("email", {
          type: "manual",
          message: t("errors.emailTaken"),
        });
      }
    },
    onError: () => toast.error(t("generalError")),
  });

  const responseFacebook = (userInfo: ReactFacebookLoginInfo | ReactFacebookFailureResponse) => {
    if ('status' in userInfo) {
      return;
    }

    const _userInfo = userInfo as ReactFacebookLoginInfo;
    form.setValue("firstName", _userInfo.name?.split(" ")[0] ?? "");
    form.setValue("lastName", _userInfo.name?.split(" ")[1] ?? "");
    form.setValue("email", _userInfo.email ?? "");
    form.setValue("password", "zaq1@WSX");

    registerMutation.mutate(form.getValues());
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          registerMutation.mutate(values)
        )}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("firstName")}</FormLabel>
              <FormDescription>{t("firstNameDescription")}</FormDescription>
              <FormControl>
                <Input
                  autoFocus
                  placeholder={t("firstName") + "..."}
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
              <FormLabel>{t("lastName")}</FormLabel>
              <FormDescription>{t("lastNameDescription")}</FormDescription>
              <FormControl>
                <Input placeholder={t("lastName") + "..."} {...field} />
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
              <FormLabel>{t("email")}</FormLabel>
              <FormDescription>{t("emailDescription")}</FormDescription>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("email") + "..."}
                  {...field}
                />
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
              <FormLabel>{t("password")}</FormLabel>
              <FormDescription>{t("passwordDescription")}</FormDescription>
              <FormControl>
                <Input
                  type="password"
                  placeholder={t("password") + "..."}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button type="submit" disabled={registerMutation.isPending}>
            {registerMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {t("register.submit")}
          </Button>
        </div>
        <div className="flex justify-center">
          <FacebookLogin
            appId="1101534024282136"
            fields="name,email,picture"
            callback={responseFacebook}
          />
        </div>
      </form>
    </Form>
  );
}

export default RegisterForm;
