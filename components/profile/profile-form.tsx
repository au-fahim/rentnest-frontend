"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FieldError } from "@/components/forms/field-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileAction } from "@/lib/api/user-actions";
import type { AuthUser } from "@/lib/auth/types";
import { profileSchema, type ProfileFormInput, type ProfileInput } from "@/types/forms";

type ProfileFormProps = {
  user: AuthUser;
};

export function ProfileForm({ user }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProfileFormInput, unknown, ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
    },
  });

  function onSubmit(values: ProfileInput) {
    startTransition(async () => {
      const result = await updateProfileAction(values);

      if (!result.success) {
        Object.entries(result.fieldErrors ?? {}).forEach(([field, messages]) => {
          if (messages[0]) {
            setError(field as keyof ProfileInput, { message: messages[0] });
          }
        });
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    });
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" autoComplete="name" {...register("name")} />
        <FieldError message={errors.name?.message} />
      </div>
      <Button type="submit" className="w-fit" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" aria-hidden="true" />}
        Save profile
      </Button>
    </form>
  );
}
