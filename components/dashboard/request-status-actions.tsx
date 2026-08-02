"use client";

import { Check, Loader2, X } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { updateRentalRequestStatusAction } from "@/lib/api/form-actions";
import type { RentalRequestStatus } from "@/types/domain";

type RequestStatusActionsProps = {
  rentalRequestId: string;
  currentStatus: RentalRequestStatus;
};

export function RequestStatusActions({ rentalRequestId, currentStatus }: RequestStatusActionsProps) {
  const [isPending, startTransition] = useTransition();

  function setStatus(status: "APPROVED" | "REJECTED" | "COMPLETED") {
    startTransition(async () => {
      const result = await updateRentalRequestStatusAction({ rentalRequestId, status });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    });
  }

  if (currentStatus === "COMPLETED" || currentStatus === "REJECTED") {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {currentStatus === "PENDING" ? (
        <>
          <Button size="sm" onClick={() => setStatus("APPROVED")} disabled={isPending}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            Approve
          </Button>
        </>
      ) : null}
      {currentStatus === "PENDING" || currentStatus === "APPROVED" ? (
        <Button size="sm" variant="destructive" onClick={() => setStatus("REJECTED")} disabled={isPending}>
          <X className="size-4" aria-hidden="true" />
          Reject
        </Button>
      ) : null}
      {currentStatus === "ACTIVE" ? (
        <Button size="sm" variant="secondary" onClick={() => setStatus("COMPLETED")} disabled={isPending}>
          Mark completed
        </Button>
      ) : null}
    </div>
  );
}
