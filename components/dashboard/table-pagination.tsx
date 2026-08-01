"use client";

import { Button } from "@/components/ui/button";

type TablePaginationProps = {
  pageIndex: number;
  pageCount: number;
  filteredCount: number;
  totalCount: number;
  startIndex: number;
  visibleCount: number;
  onPageChange: (updater: (current: number) => number) => void;
};

export function TablePagination({
  pageIndex,
  pageCount,
  filteredCount,
  totalCount,
  startIndex,
  visibleCount,
  onPageChange,
}: TablePaginationProps) {
  const firstItem = filteredCount === 0 ? 0 : startIndex + 1;
  const lastItem = Math.min(startIndex + visibleCount, filteredCount);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {firstItem}-{lastItem} of {filteredCount}
        {filteredCount !== totalCount ? ` filtered from ${totalCount}` : ""} item(s)
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange((current) => Math.max(current - 1, 0))}
          disabled={pageIndex === 0}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange((current) => Math.min(current + 1, pageCount - 1))}
          disabled={pageIndex >= pageCount - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
