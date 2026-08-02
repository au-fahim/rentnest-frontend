"use client";

import { Loader2, ShieldBan, ShieldCheck } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { updateUserStatusAction } from "@/lib/api/admin-actions";

type UserStatusActionProps = {
  userId: string;
  isBanned: boolean;
  disabled?: boolean;
};

export function UserStatusAction({ userId, isBanned, disabled }: UserStatusActionProps) {
  const [isPending, startTransition] = useTransition();

  function updateStatus() {
    startTransition(async () => {
      const result = await updateUserStatusAction(userId, !isBanned);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    });
  }

  return (
    <Button
      size="sm"
      variant={isBanned ? "secondary" : "destructive"}
      onClick={updateStatus}
      disabled={disabled || isPending}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : isBanned ? (
        <ShieldCheck className="size-4" />
      ) : (
        <ShieldBan className="size-4" />
      )}
      {isBanned ? "Unban" : "Ban"}
    </Button>
  );
}
