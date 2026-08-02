"use client";

import Image from "next/image";

import { LandlordPropertyActions } from "@/components/dashboard/landlord-property-actions";
import { TablePagination } from "@/components/dashboard/table-pagination";
import { useSearchPagination } from "@/components/dashboard/use-search-pagination";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/formatters/currency";
import { getPropertyImageUrl } from "@/lib/formatters/property-image";
import type { Property } from "@/types/domain";

type LandlordPropertiesTableProps = {
  properties: Property[];
};

export function LandlordPropertiesTable({ properties }: LandlordPropertiesTableProps) {
  const pagination = useSearchPagination({
    items: properties,
    getSearchText: getPropertySearchText,
  });

  return (
    <div className="space-y-4">
      <Input
        value={pagination.query}
        onChange={(event) => pagination.setQuery(event.target.value)}
        placeholder="Search by title, location, rent, or status"
        aria-label="Search landlord properties"
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="border-b text-muted-foreground">
            <tr>
              <th className="py-3 pr-4 font-medium">Title</th>
              <th className="py-3 pr-4 font-medium">Preview</th>
              <th className="py-3 pr-4 font-medium">Location</th>
              <th className="py-3 pr-4 font-medium">Rent</th>
              <th className="py-3 pr-4 font-medium">Status</th>
              <th className="py-3 pr-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagination.visibleItems.map((property) => (
              <tr key={property.id} className="border-b last:border-b-0">
                <td className="py-4 pr-4 font-medium">{property.title}</td>
                <td className="py-4 pr-4">
                  <div className="relative size-16 overflow-hidden rounded-md border bg-muted">
                    <Image
                      src={getPropertyImageUrl(property)}
                      alt={property.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="py-4 pr-4 text-muted-foreground">{property.location}</td>
                <td className="py-4 pr-4">{formatCurrency(property.price)}</td>
                <td className="py-4 pr-4">
                  <Badge variant={property.isAvailable ? "success" : "secondary"}>
                    {property.isAvailable ? "Available" : "Paused"}
                  </Badge>
                </td>
                <td className="py-4 pr-4">
                  <LandlordPropertyActions propertyId={property.id} isAvailable={property.isAvailable} />
                </td>
              </tr>
            ))}
            {pagination.visibleItems.length === 0 ? (
              <tr>
                <td className="py-6 text-center text-muted-foreground" colSpan={6}>
                  No properties match your search.
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

function getPropertySearchText(property: Property) {
  return [
    property.title,
    property.location,
    property.price,
    property.isAvailable ? "available" : "paused unavailable",
  ].join(" ");
}
