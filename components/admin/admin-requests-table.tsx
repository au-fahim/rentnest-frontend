"use client";

import { TablePagination } from "@/components/dashboard/table-pagination";
import { useSearchPagination } from "@/components/dashboard/use-search-pagination";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/formatters/date";
import type { RentalRequest } from "@/types/domain";

type AdminRequestsTableProps = {
  rentals: RentalRequest[];
};

export function AdminRequestsTable({ rentals }: AdminRequestsTableProps) {
  const pagination = useSearchPagination({
    items: rentals,
    getSearchText: getRentalSearchText,
  });

  return (
    <div className="space-y-4">
      <Input
        value={pagination.query}
        onChange={(event) => pagination.setQuery(event.target.value)}
        placeholder="Search requests by property, tenant, date, status, or payment"
        aria-label="Search rental requests"
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b text-muted-foreground">
            <tr>
              <th className="py-3 pr-4 font-medium">Property</th>
              <th className="py-3 pr-4 font-medium">Tenant</th>
              <th className="py-3 pr-4 font-medium">Dates</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 pr-4 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {pagination.visibleItems.map((rental) => (
              <tr key={rental.id} className="border-b last:border-b-0">
                <td className="py-4 pr-4 font-medium">{rental.property?.title ?? rental.propertyId}</td>
                <td className="py-4 pr-4 text-muted-foreground">
                  {rental.tenant?.name ?? rental.tenant?.email ?? rental.tenantId}
                </td>
                <td className="py-4 pr-4 text-muted-foreground">
                  {formatDate(rental.moveInDate)} - {formatDate(rental.moveOutDate)}
                </td>
                <td className="py-4 pr-4">
                  <StatusBadge status={rental.status} />
                </td>
                <td className="py-4 pr-4 text-muted-foreground">{formatDate(rental.updatedAt)}</td>
              </tr>
            ))}
            {pagination.visibleItems.length === 0 ? (
              <tr>
                <td className="py-6 text-center text-muted-foreground" colSpan={5}>
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

function getRentalSearchText(rental: RentalRequest) {
  return [
    rental.property?.title,
    rental.property?.location,
    rental.tenant?.name,
    rental.tenant?.email,
    rental.status,
    rental.payment?.status,
    rental.moveInDate,
    rental.moveOutDate,
    rental.updatedAt,
  ].join(" ");
}
