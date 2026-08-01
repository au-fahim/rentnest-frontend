import { EmptyState } from "@/components/dashboard/empty-state";
import { PropertyCard } from "@/components/properties/property-card";
import type { Property } from "@/types/domain";

type PropertyGridProps = {
  properties: Property[];
};


export function PropertyGrid({ properties }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <EmptyState
        title="No rentals found"
        description="Try adjusting your filters or check again when landlords add more available properties."
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
