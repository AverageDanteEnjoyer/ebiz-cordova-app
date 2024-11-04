"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import UserContext from "@/contexts/UserContext";
import { useRedirectIfLoggedIn } from "@/hooks/useRedirectIfLoggedIn";
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

function LoginForm() {
  useRedirectIfLoggedIn();
  const { setUser } = useContext(UserContext);
  const router = useRouter();
  const t = useTranslations("auth");

  const loginSchema = z.object({
    email: z.string().email({ message: t("errors.email") }),
    password: z.string().min(1, { message: t("errors.passwordRequired") }),
  });

  type LoginFormValues = z.infer<typeof loginSchema>;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const registerPromise = api.post("/auth/login", values);
      toast.promise(registerPromise, {
        loading: t("login.loading"),
        success: t("login.success"),
        error: t("login.error"),
      });

      return registerPromise;
    },
    onSuccess: async (res) => {
      if (res.ok) {
        setUser(await res.json());
        router.replace("/");
      }
    },
    onError: () => toast.error(t("generalError")),
  });

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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input placeholder={t("email") + "..."} {...field} />
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
            {t("login.submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default LoginForm;
