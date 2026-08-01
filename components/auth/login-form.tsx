"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthFormError } from "@/components/auth/auth-form-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { appRoutes } from "@/config/routes";
import { loginWithBackend } from "@/lib/auth/client-auth";
import { loginSchema, type LoginInput } from "@/types/forms";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string>();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginInput) {
    setServerError(undefined);

    startTransition(async () => {
      const result = await loginWithBackend(values);

      if (!result.success) {
        setServerError(result.message);
        applyFieldErrors(result.fieldErrors, setError);
        toast.error(result.message);
        return;
      }

      toast.success("Welcome back to RentNest.");
      router.push(searchParams.get("next") ?? result.redirectTo);
      router.refresh();
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
        <AuthFormError message={errors.email?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            className="pr-11"
            {...register("password")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((current) => !current)}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
        </div>
        <AuthFormError message={errors.password?.message} />
      </div>

      <AuthFormError message={serverError} />

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
        Sign in
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        New to RentNest?{" "}
        <Link href={appRoutes.register} className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}

type FieldSetter = ReturnType<typeof useForm<LoginInput>>["setError"];

function applyFieldErrors(
  fieldErrors: Partial<Record<keyof LoginInput, string[]>> | undefined,
  setError: FieldSetter,
) {
  if (!fieldErrors) {
    return;
  }

  Object.entries(fieldErrors).forEach(([field, messages]) => {
    if (messages?.[0]) {
      setError(field as keyof LoginInput, { message: messages[0] });
    }
  });
}
