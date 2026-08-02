import type { Metadata } from "next";

import { RequireRole } from "@/components/auth/require-role";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { LandlordHistoryTable } from "@/components/dashboard/landlord-history-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLandlordRequests } from "@/lib/api/landlord-services";

export const metadata: Metadata = {
  title: "Tenant History",
};

export default function LandlordHistoryPage() {
  return (
    <RequireRole roles={["LANDLORD"]}>
      {async () => {
        const requests = await getLandlordRequests();
        const history = requests.filter((request) => request.status === "ACTIVE" || request.status === "COMPLETED");

        return (
          <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6">
              <DashboardPageHeader
                eyebrow="Landlord history"
                title="Tenant history"
                description="Review current and completed rentals, including tenant details and payment totals."
              />

              <Card>
                <CardHeader>
                  <CardTitle>Active and completed rentals</CardTitle>
                </CardHeader>
                <CardContent>
                  {history.length === 0 ? (
                    <EmptyState title="No tenant history yet" description="Approved and completed rentals will show here after payment is confirmed." />
                  ) : (
                    <LandlordHistoryTable history={history} />
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
