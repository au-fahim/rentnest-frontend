import { Banknote, Building2, FileText, Plus } from "lucide-react";
import Link from "next/link";

import { RequireRole } from "@/components/auth/require-role";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appRoutes } from "@/config/routes";
import {
  getLandlordProperties,
  getLandlordRequests,
} from "@/lib/api/landlord-services";
import { formatCurrency } from "@/lib/formatters/currency";

export default function LandlordDashboardPage() {
  return (
    <RequireRole roles={["LANDLORD"]}>
      {async (user) => {
        const [properties, requests] = await Promise.all([
          getLandlordProperties(),
          getLandlordRequests(),
        ]);
        const activeRequests = requests.filter(
          (request) =>
            request.status === "ACTIVE" || request.status === "COMPLETED",
        );
        const earnings = activeRequests.reduce(
          (total, request) =>
            total + (request.payment?.amount ?? request.property?.price ?? 0),
          0,
        );

        return (
          <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8">
              <DashboardPageHeader
                eyebrow="Landlord overview"
                title={`Welcome, ${user.name}`}
                description="Watch listing health, incoming requests, and active rental value from one overview."
                actions={
                  <>
                    <Button asChild>
                      <Link href={appRoutes.landlordPropertyCreate}>
                        <Plus className="size-4" aria-hidden="true" />
                        New listing
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={appRoutes.landlordRequests}>Requests</Link>
                    </Button>
                  </>
                }
              />

              <section className="grid gap-4 md:grid-cols-3">
                <MetricCard
                  title="Properties"
                  value={properties.length}
                  detail="Total listings"
                  icon={<Building2 className="size-5" />}
                />
                <MetricCard
                  title="Requests"
                  value={requests.length}
                  detail="Incoming tenant requests"
                  icon={<FileText className="size-5" />}
                />
                <MetricCard
                  title="Earnings"
                  value={formatCurrency(earnings)}
                  detail="Active rental value"
                  icon={<Banknote className="size-5" />}
                />
              </section>

              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <Card>
                  <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>Recent requests</CardTitle>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={appRoutes.landlordRequests}>
                        Manage requests
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {requests.length === 0 ? (
                      <EmptyState
                        title="No incoming requests"
                        description="Tenant requests for your listings will show here."
                      />
                    ) : (
                      <div className="space-y-3">
                        {requests.slice(0, 4).map((request) => (
                          <div
                            key={request.id}
                            className="rounded-lg border p-4"
                          >
                            <p className="font-medium">
                              {request.property?.title ?? request.propertyId}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {request.tenant?.name ??
                                request.tenant?.email ??
                                request.tenantId}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>Listing snapshot</CardTitle>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={appRoutes.landlordProperties}>
                        All properties
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {properties.length === 0 ? (
                      <EmptyState
                        title="No properties yet"
                        description="Create your first listing so tenants can submit rental requests."
                        action={
                          <Button asChild>
                            <Link href={appRoutes.landlordPropertyCreate}>
                              Create listing
                            </Link>
                          </Button>
                        }
                      />
                    ) : (
                      <div className="space-y-3">
                        {properties.slice(0, 4).map((property) => (
                          <div
                            key={property.id}
                            className="rounded-lg border p-4"
                          >
                            <p className="font-medium">{property.title}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {property.location}
                            </p>
                            <p className="mt-2 text-sm">
                              {formatCurrency(property.price)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        );
      }}
    </RequireRole>
  );
}
