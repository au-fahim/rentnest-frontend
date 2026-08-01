"use client";

import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useDeferredValue, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category } from "@/types/domain";

type PropertyFiltersProps = {
  categories: Category[];
  values: {
    searchTerm?: string;
    location?: string;
    minPrice?: string;
    maxPrice?: string;
    categoryId?: string;
    amenities?: string;
  };
};

type FilterState = Required<PropertyFiltersProps["values"]>;

export function PropertyFilters({ categories, values }: PropertyFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: values.searchTerm ?? "",
    location: values.location ?? "",
    minPrice: values.minPrice ?? "",
    maxPrice: values.maxPrice ?? "",
    categoryId: values.categoryId ?? "",
    amenities: values.amenities ?? "",
  });
  const deferredFilters = useDeferredValue(filters);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const params = new URLSearchParams();

      Object.entries(deferredFilters).forEach(([key, value]) => {
        if (value.trim()) {
          params.set(key, value.trim());
        }
      });

      startTransition(() => {
        router.replace(params.size ? `${pathname}?${params}` : pathname, { scroll: false });
      });
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [deferredFilters, pathname, router]);

  function updateFilter(key: keyof FilterState, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function resetFilters() {
    setFilters({
      searchTerm: "",
      location: "",
      minPrice: "",
      maxPrice: "",
      categoryId: "",
      amenities: "",
    });
  }

  return (
    <section className="rounded-lg border bg-card p-4 shadow-sm" aria-label="Property search filters">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-5 text-primary" aria-hidden="true" />
          <h2 className="text-base font-semibold tracking-normal">Search and filter</h2>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={resetFilters}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_120px_120px_180px_1fr] lg:items-end">
        <div className="space-y-2">
          <Label htmlFor="searchTerm">Search</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="searchTerm"
              value={filters.searchTerm}
              onChange={(event) => updateFilter("searchTerm", event.target.value)}
              placeholder="Apartment, hotel"
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={filters.location}
            onChange={(event) => updateFilter("location", event.target.value)}
            placeholder="Dhaka"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="minPrice">Min</Label>
          <Input
            id="minPrice"
            value={filters.minPrice}
            onChange={(event) => updateFilter("minPrice", event.target.value)}
            type="number"
            min={0}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxPrice">Max</Label>
          <Input
            id="maxPrice"
            value={filters.maxPrice}
            onChange={(event) => updateFilter("maxPrice", event.target.value)}
            type="number"
            min={0}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoryId">Type</Label>
          <select
            id="categoryId"
            value={filters.categoryId}
            onChange={(event) => updateFilter("categoryId", event.target.value)}
            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <option value="">All types</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amenities">Amenities</Label>
          <Input
            id="amenities"
            value={filters.amenities}
            onChange={(event) => updateFilter("amenities", event.target.value)}
            placeholder="wifi, parking"
          />
        </div>
      </div>
    </section>
  );
}
