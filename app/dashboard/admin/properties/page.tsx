import type { Metadata } from "next";

import { AdminPropertiesTable } from "@/components/admin/admin-properties-table";
import { RequireRole } from "@/components/auth/require-role";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminProperties } from "@/lib/api/admin-services";

export const metadata: Metadata = {
  title: "Admin Properties",
};

export default function AdminPropertiesPage() {
  return (
    <RequireRole roles={["ADMIN"]}>
      {async () => {
        const properties = await getAdminProperties();

        return (
          <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6">
              <DashboardPageHeader
                eyebrow="Admin properties"
                title="Marketplace properties"
                description="Review listing availability, pricing, and ownership across the marketplace."
              />

              <Card>
                <CardHeader>
                  <CardTitle>All properties</CardTitle>
                </CardHeader>
                <CardContent>
                  {properties.length === 0 ? (
                    <EmptyState title="No properties" description="Listings will appear here after landlords create them." />
                  ) : (
                    <AdminPropertiesTable properties={properties} />
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
