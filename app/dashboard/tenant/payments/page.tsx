import type { Metadata } from "next";

import { RequireRole } from "@/components/auth/require-role";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { AwaitingPaymentsList, TenantPaymentsTable } from "@/components/dashboard/tenant-payments-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTenantPayments, getTenantRequests } from "@/lib/api/tenant-services";

export const metadata: Metadata = {
  title: "Payment History",
};

export default function TenantPaymentsPage() {
  return (
    <RequireRole roles={["TENANT"]}>
      {async () => {
        const [requests, payments] = await Promise.all([getTenantRequests(), getTenantPayments()]);
        const approvedRequests = requests.filter((request) => request.status === "APPROVED");

        return (
          <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6">
              <DashboardPageHeader
                eyebrow="Tenant payments"
                title="Payment history"
                description="Review completed charges and pick up any approved request that still needs payment."
              />

              <Card>
                <CardHeader>
                  <CardTitle>Awaiting payment</CardTitle>
                </CardHeader>
                <CardContent>
                  {approvedRequests.length === 0 ? (
                    <EmptyState title="Nothing awaiting payment" description="Approved requests will appear here when a landlord is ready for payment." />
                  ) : (
                    <AwaitingPaymentsList requests={approvedRequests} />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment records</CardTitle>
                </CardHeader>
                <CardContent>
                  {payments.length === 0 ? (
                    <EmptyState title="No payments yet" description="Completed or pending payment records will appear here." />
                  ) : (
                    <TenantPaymentsTable payments={payments} />
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        );
      }}
    </RequireRole>
  );
}
