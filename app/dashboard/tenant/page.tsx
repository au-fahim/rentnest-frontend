import { ArrowRight, CreditCard, FileText, Home } from "lucide-react";
import Link from "next/link";

import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { MetricCard } from "@/components/dashboard/metric-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { RequireRole } from "@/components/auth/require-role";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appRoutes } from "@/config/routes";
import { getTenantPayments, getTenantRequests } from "@/lib/api/tenant-services";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";

export default function TenantDashboardPage() {
  return (
    <RequireRole roles={["TENANT"]}>
      {async (user) => {
        const [requests, payments] = await Promise.all([getTenantRequests(), getTenantPayments()]);
        const approvedRequests = requests.filter((request) => request.status === "APPROVED");
        const activeRequests = requests.filter((request) => request.status === "ACTIVE");

        return (
          <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8">
              <DashboardPageHeader
                eyebrow="Tenant overview"
                title={`Welcome, ${user.name}`}
                description="Track current requests, payment activity, and completed stays from one place."
                actions={
                  <>
                    <Button asChild variant="outline">
                      <Link href={appRoutes.tenantRequests}>View requests</Link>
                    </Button>
                    <Button asChild>
                      <Link href={appRoutes.properties}>
                        Browse properties
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </>
                }
              />

              <section className="grid gap-4 md:grid-cols-3">
                <MetricCard title="Requests" value={requests.length} detail="Total rental requests" icon={<FileText className="size-5" />} />
                <MetricCard title="Approved" value={approvedRequests.length} detail="Ready for payment" icon={<CreditCard className="size-5" />} />
                <MetricCard title="Active" value={activeRequests.length} detail="Currently renting" icon={<Home className="size-5" />} />
              </section>

              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <Card>
                  <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>Recent requests</CardTitle>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={appRoutes.tenantRequests}>All requests</Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {requests.length === 0 ? (
                      <EmptyState
                        title="No rental requests yet"
                        description="Browse available properties and submit your first request."
                        action={<Button asChild><Link href={appRoutes.properties}>Browse properties</Link></Button>}
                      />
                    ) : (
                      <div className="space-y-3">
                        {requests.slice(0, 4).map((request) => (
                          <div key={request.id} className="rounded-lg border p-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="font-medium">{request.property?.title ?? request.propertyId}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(request.moveInDate)} - {formatDate(request.moveOutDate)}
                                </p>
                              </div>
                              <StatusBadge status={request.status} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex-row items-center justify-between">
                    <CardTitle>Latest payments</CardTitle>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={appRoutes.tenantPayments}>Payment history</Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {payments.length === 0 ? (
                      <EmptyState title="No payments yet" description="Approved rental requests will show payment activity here." />
                    ) : (
                      <div className="space-y-3">
                        {payments.slice(0, 4).map((payment) => (
                          <div key={payment.id} className="rounded-lg border p-4">
                            <div className="flex items-center justify-between gap-4">
                              <div>
                                <p className="font-medium">{formatCurrency(payment.amount)}</p>
                                <p className="text-sm text-muted-foreground">{payment.provider}</p>
                              </div>
                              <StatusBadge status={payment.status} />
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
