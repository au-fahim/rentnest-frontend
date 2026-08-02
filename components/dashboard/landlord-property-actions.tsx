"use client";

import { Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { appRoutes } from "@/config/routes";
import { deletePropertyAction, togglePropertyAvailabilityAction } from "@/lib/api/form-actions";

type LandlordPropertyActionsProps = {
  propertyId: string;
  isAvailable: boolean;
};

export function LandlordPropertyActions({ propertyId, isAvailable }: LandlordPropertyActionsProps) {
  const [isPending, startTransition] = useTransition();

  function mutate(action: "toggle" | "delete") {
    startTransition(async () => {
      const result =
        action === "toggle"
          ? await togglePropertyAvailabilityAction(propertyId, !isAvailable)
          : await deletePropertyAction(propertyId);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href={appRoutes.landlordPropertyEdit(propertyId)}>Edit</Link>
      </Button>
      <Button size="sm" variant="secondary" onClick={() => mutate("toggle")} disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
        {isAvailable ? "Pause" : "Publish"}
      </Button>
      <Button size="sm" variant="destructive" onClick={() => mutate("delete")} disabled={isPending}>
        <Trash2 className="size-4" aria-hidden="true" />
        Delete
      </Button>
    </div>
  );
}
