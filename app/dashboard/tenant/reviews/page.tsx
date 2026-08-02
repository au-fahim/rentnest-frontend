import type { Metadata } from "next";

import { RequireRole } from "@/components/auth/require-role";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { TenantReviewsList, type TenantReviewItem } from "@/components/dashboard/tenant-reviews-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProperty } from "@/lib/api/public-services";
import { getTenantRequests } from "@/lib/api/tenant-services";
import { getCurrentUser } from "@/lib/auth/session";
import type { RentalRequest } from "@/types/domain";

export const metadata: Metadata = {
  title: "Reviews",
};

export default function TenantReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ propertyId?: string }>;
}) {
  return (
    <RequireRole roles={["TENANT"]}>
      {async () => {
        const [{ propertyId }, requests, user] = await Promise.all([
          searchParams,
          getTenantRequests(),
          getCurrentUser(),
        ]);
        const completedRequests = requests.filter((request) => request.status === "COMPLETED" && request.propertyId);
        const reviewItems = user ? await getTenantReviewItems(completedRequests, user.id, propertyId) : [];

        return (
          <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6">
              <DashboardPageHeader
                eyebrow="Tenant reviews"
                title="Share your completed stays"
                description="Completed rentals can be reviewed here so future tenants get better signals."
              />

              <Card>
                <CardHeader>
                  <CardTitle>Eligible reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  {completedRequests.length === 0 ? (
                    <EmptyState title="No completed stays yet" description="Once a rental is completed, its review form will appear here." />
                  ) : (
                    <TenantReviewsList items={reviewItems} highlightedPropertyId={propertyId} />
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

async function getTenantReviewItems(
  requests: RentalRequest[],
  tenantId: string,
  highlightedPropertyId: string | undefined,
) {
  const uniqueRequests = Array.from(
    new Map(requests.map((request) => [request.propertyId, request])).values(),
  );

  const items = await Promise.all(
    uniqueRequests.map(async (request): Promise<TenantReviewItem | null> => {
      try {
        const property = await getProperty(request.propertyId);
        const review = property.reviews?.find((item) => item.tenantId === tenantId) ?? null;

        return {
          request,
          property,
          review,
        };
      } catch {
        return null;
      }
    }),
  );

  return items
    .filter((item): item is TenantReviewItem => item !== null)
    .sort((firstItem, secondItem) => {
      if (!highlightedPropertyId) {
        return 0;
      }

      if (firstItem.property.id === highlightedPropertyId) {
        return -1;
      }

      if (secondItem.property.id === highlightedPropertyId) {
        return 1;
      }

      return 0;
    });
}
