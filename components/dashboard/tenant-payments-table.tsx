"use client";

import Link from "next/link";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { TablePagination } from "@/components/dashboard/table-pagination";
import { useSearchPagination } from "@/components/dashboard/use-search-pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { appRoutes } from "@/config/routes";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";
import type { Payment, RentalRequest } from "@/types/domain";

type TenantPaymentsTableProps = {
  payments: Payment[];
};

type AwaitingPaymentsListProps = {
  requests: RentalRequest[];
};

export function AwaitingPaymentsList({ requests }: AwaitingPaymentsListProps) {
  const pagination = useSearchPagination({
    items: requests,
    getSearchText: getRequestSearchText,
  });

  return (
    <div className="space-y-4">
      <Input
        value={pagination.query}
        onChange={(event) => pagination.setQuery(event.target.value)}
        placeholder="Search awaiting payments by property, date, or status"
        aria-label="Search awaiting payments"
      />

      <div className="space-y-3">
        {pagination.visibleItems.map((request) => (
          <div key={request.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">{request.property?.title ?? request.propertyId}</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(request.moveInDate)} - {formatDate(request.moveOutDate)}
              </p>
            </div>
            <Button asChild size="sm">
              <Link href={appRoutes.tenantRequestPayment(request.id)}>Continue payment</Link>
            </Button>
          </div>
        ))}
        {pagination.visibleItems.length === 0 ? (
          <p className="rounded-lg border p-4 text-sm text-muted-foreground">No awaiting payments match your search.</p>
        ) : null}
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

export function TenantPaymentsTable({ payments }: TenantPaymentsTableProps) {
  const pagination = useSearchPagination({
    items: payments,
    getSearchText: getPaymentSearchText,
  });

  return (
    <div className="space-y-4">
      <Input
        value={pagination.query}
        onChange={(event) => pagination.setQuery(event.target.value)}
        placeholder="Search payments by property, amount, provider, status, or date"
        aria-label="Search payment history"
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b text-muted-foreground">
            <tr>
              <th className="py-3 pr-4 font-medium">Property</th>
              <th className="py-3 pr-4 font-medium">Amount</th>
              <th className="py-3 pr-4 font-medium">Provider</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 pr-4 font-medium">Paid at</th>
            </tr>
          </thead>
          <tbody>
            {pagination.visibleItems.map((payment) => (
              <tr key={payment.id} className="border-b last:border-b-0">
                <td className="py-4 pr-4 font-medium">
                  {payment.rentalRequest?.property?.title ?? payment.rentalRequestId}
                </td>
                <td className="py-4 pr-4">{formatCurrency(payment.amount)}</td>
                <td className="py-4 pr-4 text-muted-foreground">{payment.provider}</td>
                <td className="py-4 pr-4">
                  <StatusBadge status={payment.status} />
                </td>
                <td className="py-4 pr-4 text-muted-foreground">{formatDate(payment.paidAt)}</td>
              </tr>
            ))}
            {pagination.visibleItems.length === 0 ? (
              <tr>
                <td className="py-6 text-center text-muted-foreground" colSpan={5}>
                  No payments match your search.
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
    request.moveInDate,
    request.moveOutDate,
  ].join(" ");
}

function getPaymentSearchText(payment: Payment) {
  return [
    payment.rentalRequest?.property?.title,
    payment.amount,
    payment.provider,
    payment.status,
    payment.paidAt,
  ].join(" ");
}
