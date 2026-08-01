import type { Metadata } from "next";
import Link from "next/link";

import { RequireRole } from "@/components/auth/require-role";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { TenantRequestsTable } from "@/components/dashboard/tenant-requests-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appRoutes } from "@/config/routes";
import { getTenantRequests } from "@/lib/api/tenant-services";

export const metadata: Metadata = {
  title: "Tenant Requests",
};

export default function TenantRequestsPage() {
  return (
    <RequireRole roles={["TENANT"]}>
      {async () => {
        const requests = await getTenantRequests();

        return (
          <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6">
              <DashboardPageHeader
                eyebrow="Tenant requests"
                title="Rental requests"
                description="Track approval status, move-in dates, and payment-ready rentals."
                actions={
                  <Button asChild>
                    <Link href={appRoutes.properties}>Browse properties</Link>
                  </Button>
                }
              />

              <Card>
                <CardHeader>
                  <CardTitle>All requests</CardTitle>
                </CardHeader>
                <CardContent>
                  {requests.length === 0 ? (
                    <EmptyState
                      title="No rental requests yet"
                      description="Browse available properties and submit your first request."
                      action={
                        <Button asChild>
                          <Link href={appRoutes.properties}>
                            Browse properties
                          </Link>
                        </Button>
                      }
                    />
                  ) : (
                    <TenantRequestsTable requests={requests} />
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
