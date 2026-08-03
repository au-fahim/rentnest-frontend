"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { TablePagination } from "@/components/dashboard/table-pagination";
import { useSearchPagination } from "@/components/dashboard/use-search-pagination";
import { ReviewForm } from "@/components/forms/review-form";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { appRoutes } from "@/config/routes";
import { formatDate } from "@/lib/formatters/date";
import type { Property, RentalRequest, Review } from "@/types/domain";

export type TenantReviewItem = {
  request: RentalRequest;
  property: Property;
  review: Review | null;
};

type TenantReviewsListProps = {
  items: TenantReviewItem[];
  highlightedPropertyId?: string;
};

export function TenantReviewsList({
  items,
  highlightedPropertyId,
}: TenantReviewsListProps) {
  const highlightedRef = useRef<HTMLDivElement | null>(null);
  const pagination = useSearchPagination({
    items,
    getSearchText: getReviewSearchText,
  });

  useEffect(() => {
    highlightedRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, []);

  return (
    <div className="space-y-4">
      <Input
        value={pagination.query}
        onChange={(event) => pagination.setQuery(event.target.value)}
        placeholder="Search reviews by property, status, rating, date, or comment"
        aria-label="Search tenant reviews"
      />

      <div className="space-y-4">
        {pagination.visibleItems.map((item) => {
          const isHighlighted = item.property.id === highlightedPropertyId;

          return (
            <div
              key={item.property.id}
              ref={isHighlighted ? highlightedRef : undefined}
              className={`rounded-lg border p-4 ${isHighlighted ? "border-primary bg-primary/5" : ""}`}
            >
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Link
                    href={appRoutes.propertyDetails(item.property.id)}
                    className="font-medium text-foreground hover:text-primary hover:underline"
                    target="_blank"
                  >
                    {item.property.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(item.request.moveInDate)} -{" "}
                    {formatDate(item.request.moveOutDate)}
                  </p>
                </div>
                <Badge variant={item.review ? "success" : "warning"}>
                  {item.review ? "Reviewed" : "Needs review"}
                </Badge>
              </div>

              {item.review ? (
                <div className="rounded-lg bg-secondary/40 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium">
                      Your rating: {item.review.rating}/5
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(item.review.createdAt)}
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.review.comment}
                  </p>
                </div>
              ) : (
                <ReviewForm propertyId={item.property.id} />
              )}
            </div>
          );
        })}
        {pagination.visibleItems.length === 0 ? (
          <p className="rounded-lg border p-4 text-sm text-muted-foreground">
            No review items match your search.
          </p>
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

function getReviewSearchText(item: TenantReviewItem) {
  return [
    item.property.title,
    item.property.location,
    item.review ? "reviewed" : "needs review",
    item.review?.rating,
    item.review?.comment,
    item.request.moveInDate,
    item.request.moveOutDate,
  ].join(" ");
}
