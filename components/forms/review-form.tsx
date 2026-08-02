"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FieldError } from "@/components/forms/field-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitReviewAction } from "@/lib/api/form-actions";
import { reviewSchema, type ReviewFormInput, type ReviewInput } from "@/types/forms";

type ReviewFormProps = {
  propertyId: string;
};

export function ReviewForm({ propertyId }: ReviewFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ReviewFormInput, unknown, ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      propertyId,
      rating: 5,
      comment: "",
    },
  });

  function onSubmit(values: ReviewInput) {
    startTransition(async () => {
      const result = await submitReviewAction(values);

      if (!result.success) {
        Object.entries(result.fieldErrors ?? {}).forEach(([field, messages]) => {
          if (messages[0]) {
            setError(field as keyof ReviewInput, { message: messages[0] });
          }
        });
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      reset({ propertyId, rating: 5, comment: "" });
      router.refresh();
    });
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)} noValidate>
      <input type="hidden" {...register("propertyId")} />
      <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
        <div className="space-y-2">
          <Label htmlFor={`rating-${propertyId}`}>Rating</Label>
          <Input id={`rating-${propertyId}`} type="number" min={1} max={5} {...register("rating")} />
          <FieldError message={errors.rating?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`comment-${propertyId}`}>Review</Label>
          <Input id={`comment-${propertyId}`} placeholder="Share your rental experience" {...register("comment")} />
          <FieldError message={errors.comment?.message} />
        </div>
      </div>
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : <Star className="size-4" />}
        Leave review
      </Button>
    </form>
  );
}
