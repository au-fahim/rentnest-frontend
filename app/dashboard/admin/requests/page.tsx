import type { Metadata } from "next";

import { AdminRequestsTable } from "@/components/admin/admin-requests-table";
import { RequireRole } from "@/components/auth/require-role";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminRentals } from "@/lib/api/admin-services";

export const metadata: Metadata = {
  title: "Admin Requests",
};

export default function AdminRequestsPage() {
  return (
    <RequireRole roles={["ADMIN"]}>
      {async () => {
        const rentals = await getAdminRentals();

        return (
          <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6">
              <DashboardPageHeader
                eyebrow="Admin requests"
                title="Rental requests"
                description="Inspect tenant requests, approval state, and activity across the marketplace."
              />

              <Card>
                <CardHeader>
                  <CardTitle>All requests</CardTitle>
                </CardHeader>
                <CardContent>
                  {rentals.length === 0 ? (
                    <EmptyState title="No rental requests" description="Tenant requests will appear here." />
                  ) : (
                    <AdminRequestsTable rentals={rentals} />
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
