"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Eye, EyeOff, Home, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthFormError } from "@/components/auth/auth-form-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { appRoutes } from "@/config/routes";
import { registerWithBackend } from "@/lib/auth/client-auth";
import { cn } from "@/lib/utils/cn";
import type { UserRole } from "@/types/domain";
import { registerSchema, type RegisterInput } from "@/types/forms";

const roleOptions: Array<{
  value: Exclude<UserRole, "ADMIN">;
  label: string;
  description: string;
  Icon: typeof Home;
}> = [
  {
    value: "TENANT",
    label: "Tenant",
    description: "Browse rentals, request homes, and pay approved requests.",
    Icon: Home,
  },
  {
    value: "LANDLORD",
    label: "Landlord",
    description: "Create listings, manage availability, and review requests.",
    Icon: Building2,
  },
];

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "TENANT",
    },
  });
  const [selectedRole, setSelectedRole] = useState<UserRole>("TENANT");
  const [showPassword, setShowPassword] = useState(false);
  const roleField = register("role");

  function onSubmit(values: RegisterInput) {
    setServerError(undefined);

    startTransition(async () => {
      const result = await registerWithBackend(values);

      if (!result.success) {
        setServerError(result.message);
        applyFieldErrors(result.fieldErrors, setError);
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.replace(result.redirectTo);
      router.refresh();
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" autoComplete="name" aria-invalid={Boolean(errors.name)} {...register("name")} />
        <AuthFormError message={errors.name?.message} />
      </div>

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
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            className="pr-11"
            {...register("password")}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 size-10 text-muted-foreground"
            onClick={() => setShowPassword((current) => !current)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
        </div>
        <AuthFormError message={errors.password?.message} />
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Choose your role</legend>
        <div className="grid gap-3">
          {roleOptions.map(({ value, label, description, Icon }) => (
            <label
              key={value}
              className={cn(
                "flex cursor-pointer gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-secondary/70",
                selectedRole === value && "border-primary bg-primary/8",
              )}
            >
              <input
                type="radio"
                value={value}
                className="sr-only"
                name={roleField.name}
                ref={roleField.ref}
                onBlur={roleField.onBlur}
                onChange={(event) => {
                  roleField.onChange(event);
                  setSelectedRole(event.target.value as Exclude<UserRole, "ADMIN">);
                }}
                defaultChecked={value === "TENANT"}
              />
              <Icon className="mt-0.5 size-5 text-primary" aria-hidden="true" />
              <span>
                <span className="block text-sm font-medium">{label}</span>
                <span className="block text-sm text-muted-foreground">{description}</span>
              </span>
            </label>
          ))}
        </div>
        <AuthFormError message={errors.role?.message} />
      </fieldset>

      <AuthFormError message={serverError} />

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
        Create account
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={appRoutes.login} className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

type FieldSetter = ReturnType<typeof useForm<RegisterInput>>["setError"];

function applyFieldErrors(
  fieldErrors: Partial<Record<keyof RegisterInput, string[]>> | undefined,
  setError: FieldSetter,
) {
  if (!fieldErrors) {
    return;
  }

  Object.entries(fieldErrors).forEach(([field, messages]) => {
    if (messages?.[0]) {
      setError(field as keyof RegisterInput, { message: messages[0] });
    }
  });
}
