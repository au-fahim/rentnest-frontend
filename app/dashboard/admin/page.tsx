import { Building2, FileText, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { UserStatusAction } from "@/components/admin/user-status-action";
import { RequireRole } from "@/components/auth/require-role";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { MetricCard } from "@/components/dashboard/metric-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appRoutes } from "@/config/routes";
import { getAdminProperties, getAdminRentals, getAdminUsers } from "@/lib/api/admin-services";
import { formatDate } from "@/lib/formatters/date";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default function AdminDashboardPage() {
  return (
    <RequireRole roles={["ADMIN"]}>
      {async (user) => {
        const [users, properties, rentals] = await Promise.all([
          getAdminUsers(),
          getAdminProperties(),
          getAdminRentals(),
        ]);
        const bannedUsers = users.filter((item) => item.isBanned);
        const pendingRentals = rentals.filter((item) => item.status === "PENDING");

        return (
          <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8">
              <DashboardPageHeader
                eyebrow="Admin overview"
                title={`Welcome, ${user.name}`}
                description="Monitor marketplace health, registered users, and request activity across RentNest."
                actions={
                  <>
                    <Button asChild variant="outline">
                      <Link href={appRoutes.adminUsers}>User management</Link>
                    </Button>
                    <Button asChild>
                      <Link href={appRoutes.adminRequests}>Review requests</Link>
                    </Button>
                  </>
                }
              />

              <section className="grid gap-4 md:grid-cols-3">
                <MetricCard
                  title="Users"
                  value={users.length}
                  detail={`${bannedUsers.length} banned accounts`}
                  icon={<Users className="size-5" />}
                />
                <MetricCard
                  title="Properties"
                  value={properties.length}
                  detail="Total marketplace listings"
                  icon={<Building2 className="size-5" />}
                />
                <MetricCard
                  title="Requests"
                  value={rentals.length}
                  detail={`${pendingRentals.length} pending approvals`}
                  icon={<FileText className="size-5" />}
                />
              </section>

              <div className="grid gap-6 xl:grid-cols-2">
              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle>Latest users</CardTitle>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={appRoutes.adminUsers}>All users</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {users.length === 0 ? (
                    <EmptyState title="No users found" description="Registered accounts will appear here." />
                  ) : (
                    <div className="space-y-4">
                      {users.slice(0, 5).map((item) => (
                        <div key={item.id} className="rounded-lg border p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">{item.email}</p>
                              <p className="mt-1 text-sm text-muted-foreground">{formatDate(item.createdAt)}</p>
                            </div>
                            <UserStatusAction
                              userId={item.id}
                              isBanned={item.isBanned}
                              disabled={item.role === "ADMIN"}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle>Recent rental requests</CardTitle>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={appRoutes.adminRequests}>All requests</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {rentals.length === 0 ? (
                    <EmptyState title="No rental requests" description="Tenant requests will appear here." />
                  ) : (
                    <div className="space-y-4">
                      {rentals.slice(0, 8).map((rental) => (
                        <div key={rental.id} className="rounded-lg border p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-medium">{rental.property?.title ?? rental.propertyId}</p>
                              <p className="text-sm text-muted-foreground">
                                {rental.tenant?.name ?? rental.tenant?.email ?? rental.tenantId}
                              </p>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {formatDate(rental.moveInDate)} - {formatDate(rental.moveOutDate)}
                              </p>
                            </div>
                            <StatusBadge status={rental.status} />
                          </div>
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
