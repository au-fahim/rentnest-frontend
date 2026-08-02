import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { RequireRole } from "@/components/auth/require-role";
import { TenantPaymentFlow } from "@/components/payment/tenant-payment-flow";
import { Button } from "@/components/ui/button";
import { appRoutes } from "@/config/routes";
import { getTenantRequestDetails } from "@/lib/api/tenant-services";

export const metadata: Metadata = {
  title: "Pay Rental Request",
};

export default function TenantPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <RequireRole roles={["TENANT"]}>
      {async () => {
        const { id } = await params;
        const request = await getTenantRequestDetails(id);

        return (
          <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <Button asChild variant="ghost" className="w-fit">
              <Link href={appRoutes.tenantPayments}>
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back to payments
              </Link>
            </Button>
            <TenantPaymentFlow request={request} />
          </main>
        );
      }}
    </RequireRole>
  );
}
