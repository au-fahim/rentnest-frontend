"use client";

import { useDeferredValue, useMemo, useState } from "react";

export const dashboardPageSize = 20;

type SearchPaginationInput<TItem> = {
  items: TItem[];
  getSearchText: (item: TItem) => string;
  pageSize?: number;
};

export function useSearchPagination<TItem>({
  items,
  getSearchText,
  pageSize = dashboardPageSize,
}: SearchPaginationInput<TItem>) {
  const [query, setQuery] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filteredItems = useMemo(() => {
    if (!deferredQuery) {
      return items;
    }

    return items.filter((item) => getSearchText(item).toLowerCase().includes(deferredQuery));
  }, [deferredQuery, getSearchText, items]);

  const pageCount = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const safePageIndex = Math.min(pageIndex, pageCount - 1);
  const startIndex = safePageIndex * pageSize;
  const visibleItems = filteredItems.slice(startIndex, startIndex + pageSize);

  function updateQuery(value: string) {
    setQuery(value);
    setPageIndex(0);
  }

  return {
    query,
    setQuery: updateQuery,
    pageIndex: safePageIndex,
    setPageIndex,
    pageCount,
    visibleItems,
    filteredCount: filteredItems.length,
    totalCount: items.length,
    startIndex,
  };
}
