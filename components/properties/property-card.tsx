import { ImageIcon, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { appRoutes } from "@/config/routes";
import { formatCurrency } from "@/lib/formatters/currency";
import {
  getPropertyImageUrl,
  getPropertyImages,
} from "@/lib/formatters/property-image";
import type { Property } from "@/types/domain";

type PropertyCardProps = {
  property: Property;
};

export function PropertyCard({ property }: PropertyCardProps) {
  const imageCount = getPropertyImages(property).length;
  const amenities = property.amenities.slice(0, 3);

  return (
    <article className="overflow-hidden rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={appRoutes.propertyDetails(property.id)}
        className="group block"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={getPropertyImageUrl(property)}
            alt={property.title}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white">
            <ImageIcon className="size-3.5" aria-hidden="true" />
            {imageCount}
          </div>
        </div>
        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="line-clamp-1 text-lg font-semibold tracking-normal">
                {property.title}
              </h2>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-4" aria-hidden="true" />
                {property.location}
              </p>
            </div>
            <Badge variant={property.isAvailable ? "success" : "secondary"}>
              {property.isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {property.description}
          </p>
          {amenities.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {amenities.map((amenity) => (
                <Badge key={amenity} variant="secondary">
                  {amenity}
                </Badge>
              ))}
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-semibold">
              {formatCurrency(property.price)}/mo
            </p>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {property.category?.name ?? "Rental"}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
