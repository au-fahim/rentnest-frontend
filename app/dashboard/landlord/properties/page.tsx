import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { RequireRole } from "@/components/auth/require-role";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { LandlordPropertiesTable } from "@/components/dashboard/landlord-properties-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appRoutes } from "@/config/routes";
import { getLandlordProperties } from "@/lib/api/landlord-services";

export const metadata: Metadata = {
  title: "My Properties",
};

export default function LandlordPropertiesPage() {
  return (
    <RequireRole roles={["LANDLORD"]}>
      {async () => {
        const properties = await getLandlordProperties();

        return (
          <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6">
              <DashboardPageHeader
                eyebrow="Landlord properties"
                title="My properties"
                description="Create, edit, pause, publish, or remove listings from your property inventory."
                actions={
                  <Button asChild>
                    <Link href={appRoutes.landlordPropertyCreate}>
                      <Plus className="size-4" aria-hidden="true" />
                      New listing
                    </Link>
                  </Button>
                }
              />

              <Card>
                <CardHeader>
                  <CardTitle>Property inventory</CardTitle>
                </CardHeader>
                <CardContent>
                  {properties.length === 0 ? (
                    <EmptyState
                      title="No properties yet"
                      description="Create your first listing so tenants can submit rental requests."
                      action={<Button asChild><Link href={appRoutes.landlordPropertyCreate}>Create listing</Link></Button>}
                    />
                  ) : (
                    <LandlordPropertiesTable properties={properties} />
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
