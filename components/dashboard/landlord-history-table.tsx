"use client";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { TablePagination } from "@/components/dashboard/table-pagination";
import { useSearchPagination } from "@/components/dashboard/use-search-pagination";
import { Input } from "@/components/ui/input";
import { appRoutes } from "@/config/routes";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";
import type { RentalRequest } from "@/types/domain";
import Link from "next/dist/client/link";

type LandlordHistoryTableProps = {
  history: RentalRequest[];
};

export function LandlordHistoryTable({ history }: LandlordHistoryTableProps) {
  const pagination = useSearchPagination({
    items: history,
    getSearchText: getHistorySearchText,
  });

  return (
    <div className="space-y-4">
      <Input
        value={pagination.query}
        onChange={(event) => pagination.setQuery(event.target.value)}
        placeholder="Search by property, tenant, dates, amount, or status"
        aria-label="Search tenant history"
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b text-muted-foreground">
            <tr>
              <th className="py-3 pr-4 font-medium">Property</th>
              <th className="py-3 pr-4 font-medium">Tenant</th>
              <th className="py-3 pr-4 font-medium">Dates</th>
              <th className="py-3 pr-4 font-medium">Amount</th>
              <th className="py-3 pr-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {pagination.visibleItems.map((request) => (
              <tr key={request.id} className="border-b last:border-b-0">
                <td className="py-4 pr-4 font-medium">
                  <Link
                    href={appRoutes.propertyDetails(
                      request.property?.id ?? request.propertyId,
                    )}
                    className="font-medium text-foreground hover:text-primary hover:underline"
                    target="blank"
                  >
                    {request.property?.title ?? request.propertyId}
                  </Link>
                </td>
                <td className="py-4 pr-4 text-muted-foreground">
                  {request.tenant?.name ??
                    request.tenant?.email ??
                    request.tenantId}
                </td>
                <td className="py-4 pr-4 text-muted-foreground">
                  {formatDate(request.moveInDate)} -{" "}
                  {formatDate(request.moveOutDate)}
                </td>
                <td className="py-4 pr-4">
                  {formatCurrency(
                    request.payment?.amount ?? request.property?.price ?? 0,
                  )}
                </td>
                <td className="py-4 pr-4">
                  <StatusBadge status={request.status} />
                </td>
              </tr>
            ))}
            {pagination.visibleItems.length === 0 ? (
              <tr>
                <td
                  className="py-6 text-center text-muted-foreground"
                  colSpan={5}
                >
                  No tenant history matches your search.
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

function getHistorySearchText(request: RentalRequest) {
  return [
    request.property?.title,
    request.property?.location,
    request.tenant?.name,
    request.tenant?.email,
    request.payment?.amount,
    request.property?.price,
    request.status,
    request.moveInDate,
    request.moveOutDate,
  ].join(" ");
}
