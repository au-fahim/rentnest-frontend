"use client";

import Link from "next/link";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { TablePagination } from "@/components/dashboard/table-pagination";
import { useSearchPagination } from "@/components/dashboard/use-search-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { appRoutes } from "@/config/routes";
import { formatDate } from "@/lib/formatters/date";
import type { RentalRequest } from "@/types/domain";

type TenantRequestsTableProps = {
  requests: RentalRequest[];
};

export function TenantRequestsTable({ requests }: TenantRequestsTableProps) {
  const pagination = useSearchPagination({
    items: requests,
    getSearchText: getRequestSearchText,
  });

  return (
    <div className="space-y-4">
      <Input
        value={pagination.query}
        onChange={(event) => pagination.setQuery(event.target.value)}
        placeholder="Search by property, dates, status, or payment"
        aria-label="Search tenant rental requests"
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b text-muted-foreground">
            <tr>
              <th className="py-3 pr-4 font-medium">Property</th>
              <th className="py-3 pr-4 font-medium">Dates</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 pr-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {pagination.visibleItems.map((request) => (
              <tr key={request.id} className="border-b last:border-b-0">
                <td className="py-4 pr-4 font-medium">
                  {request.property?.title ?? request.propertyId}
                </td>
                <td className="py-4 pr-4 text-muted-foreground">
                  {formatDate(request.moveInDate)} -{" "}
                  {formatDate(request.moveOutDate)}
                </td>
                <td className="py-4 pr-4">
                  <StatusBadge status={request.status} />
                </td>
                <td className="py-4 pr-4">
                  <div className="flex flex-wrap gap-2">
                    {request.status === "APPROVED" ? (
                      <Button asChild size="sm">
                        <Link href={appRoutes.tenantRequestPayment(request.id)}>
                          Pay now
                        </Link>
                      </Button>
                    ) : null}
                    {request.status === "COMPLETED" && request.propertyId ? (
                      <Button asChild size="sm" variant="outline">
                        <Link
                          href={`${appRoutes.tenantReviews}?propertyId=${request.propertyId}`}
                        >
                          Review
                        </Link>
                      </Button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
            {pagination.visibleItems.length === 0 ? (
              <tr>
                <td
                  className="py-6 text-center text-muted-foreground"
                  colSpan={4}
                >
                  No rental requests match your search.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <TablePagination
        pageIndex={pagination.pageIndex}
        pageCount={pagination.pageCount}
        filteredCount={pagination.filteredCount}
        totalCount={pagination.totalCount}
        startIndex={pagination.startIndex}
        visibleCount={pagination.visibleItems.length}
        onPageChange={pagination.setPageIndex}
      />
    </div>
  );
}

function getRequestSearchText(request: RentalRequest) {
  return [
    request.property?.title,
    request.property?.location,
    request.status,
    request.payment?.status,
    request.moveInDate,
    request.moveOutDate,
  ].join(" ");
}
