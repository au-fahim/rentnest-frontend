import { Badge } from "@/components/ui/badge";
import type { PaymentStatus, RentalRequestStatus } from "@/types/domain";

type StatusBadgeProps = {
  status: RentalRequestStatus | PaymentStatus;
};

const statusVariant = {
  PENDING: "warning",
  APPROVED: "default",
  REJECTED: "destructive",
  ACTIVE: "success",
  COMPLETED: "secondary",
  FAILED: "destructive",
} as const;

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge variant={statusVariant[status]}>{status}</Badge>;
}
