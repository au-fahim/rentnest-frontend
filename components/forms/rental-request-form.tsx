"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarPlus, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FieldError } from "@/components/forms/field-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitRentalRequestAction } from "@/lib/api/form-actions";
import { rentalRequestSchema, type RentalRequestInput } from "@/types/forms";

type RentalRequestFormProps = {
  propertyId: string;
};

export function RentalRequestForm({ propertyId }: RentalRequestFormProps) {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<RentalRequestInput>({
    resolver: zodResolver(rentalRequestSchema),
    defaultValues: {
      propertyId,
      moveInDate: "",
      moveOutDate: "",
    },
  });

  function onSubmit(values: RentalRequestInput) {
    startTransition(async () => {
      const result = await submitRentalRequestAction(values);

      if (!result.success) {
        Object.entries(result.fieldErrors ?? {}).forEach(([field, messages]) => {
          if (messages[0]) {
            setError(field as keyof RentalRequestInput, { message: messages[0] });
          }
        });
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      reset({ propertyId, moveInDate: "", moveOutDate: "" });
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <input type="hidden" {...register("propertyId")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="moveInDate">Move-in date</Label>
          <Input id="moveInDate" type="date" {...register("moveInDate")} />
          <FieldError message={errors.moveInDate?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="moveOutDate">Move-out date</Label>
          <Input id="moveOutDate" type="date" {...register("moveOutDate")} />
          <FieldError message={errors.moveOutDate?.message} />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : <CalendarPlus className="size-4" />}
        Request to rent
      </Button>
    </form>
  );
}
