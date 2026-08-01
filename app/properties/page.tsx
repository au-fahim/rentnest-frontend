import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PropertyFilters } from "@/components/properties/property-filters";
import { PropertyGrid } from "@/components/properties/property-grid";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getCategories, getProperties } from "@/lib/api/public-services";
import { propertyFilterSchema } from "@/types/forms";

export const metadata: Metadata = {
  title: "Properties",
  description: "Browse and filter available RentNest rental properties.",
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawSearchParams = await searchParams;
  const values = getFilterValues(rawSearchParams);
  const filters = propertyFilterSchema.parse(values);
  const [categories, propertiesResult] = await Promise.all([
    getCategories(),
    getProperties(filters).then(
      (properties) => ({ ok: true as const, properties }),
      (error: unknown) => ({ ok: false as const, error }),
    ),
  ]);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-medium text-primary">Available rentals</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">Browse properties</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Filter by location, budget, category, and amenities using your live RentNest backend.
          </p>
        </div>
        <PropertyFilters categories={categories} values={values} />
        {propertiesResult.ok ? (
          <PropertyGrid properties={propertiesResult.properties} />
        ) : (
          <Alert>
            <AlertTitle>Properties could not load</AlertTitle>
            <AlertDescription>
              The backend may be waking up. Refresh the page or adjust filters and try again.
            </AlertDescription>
          </Alert>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function getFilterValues(searchParams: Record<string, string | string[] | undefined>) {
  return {
    searchTerm: getSingleValue(searchParams.searchTerm),
    location: getSingleValue(searchParams.location),
    minPrice: getSingleValue(searchParams.minPrice),
    maxPrice: getSingleValue(searchParams.maxPrice),
    categoryId: getSingleValue(searchParams.categoryId),
    amenities: getSingleValue(searchParams.amenities),
  };
}

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
