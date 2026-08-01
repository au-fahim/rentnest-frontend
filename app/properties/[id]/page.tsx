import { ArrowLeft, Building2, MapPin, Star } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RentalRequestForm } from "@/components/forms/rental-request-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PropertyGallery } from "@/components/properties/property-gallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { appRoutes } from "@/config/routes";
import { ApiError } from "@/lib/api/api-client";
import { getProperty } from "@/lib/api/public-services";
import { getCurrentSession } from "@/lib/auth/session";
import { formatCurrency } from "@/lib/formatters/currency";
import { getPropertyImages } from "@/lib/formatters/property-image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const property = await getProperty(id);
    return {
      title: property.title,
      description: property.description,
    };
  } catch {
    return {
      title: "Property",
    };
  }
}

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [property, session] = await Promise.all([getPropertyOrNotFound(id), getCurrentSession()]);
  const canRequest = session?.role === "TENANT";
  const images = getPropertyImages(property);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" className="w-fit">
          <Link href={appRoutes.properties}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to properties
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <PropertyGallery title={property.title} images={images} />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={property.isAvailable ? "success" : "secondary"}>
                  {property.isAvailable ? "Available" : "Unavailable"}
                </Badge>
                <Badge variant="outline">{property.category?.name ?? "Rental"}</Badge>
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-normal sm:text-4xl">
                {property.title}
              </h1>
              <p className="mt-3 flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-4" aria-hidden="true" />
                {property.location}
              </p>
              <p className="mt-6 leading-7 text-muted-foreground">{property.description}</p>
            </div>
            <section>
              <h2 className="text-xl font-semibold tracking-normal">Amenities</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-xl font-semibold tracking-normal">Reviews</h2>
              <div className="mt-3 space-y-3">
                {property.reviews?.length ? (
                  property.reviews.map((review) => (
                    <article key={review.id} className="rounded-lg border bg-card p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-medium">{review.tenant?.name ?? "RentNest tenant"}</p>
                        <div className="flex items-center gap-1 text-sm text-amber-600">
                          <Star className="size-4 fill-current" aria-hidden="true" />
                          {review.rating}/5
                        </div>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{review.comment}</p>
                    </article>
                  ))
                ) : (
                  <p className="rounded-lg border bg-secondary/30 p-4 text-sm text-muted-foreground">
                    No reviews have been added for this property yet.
                  </p>
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>{formatCurrency(property.price)}/month</CardTitle>
                <CardDescription>Submit a rental request for landlord approval.</CardDescription>
              </CardHeader>
              <CardContent>
                {canRequest ? (
                  <RentalRequestForm propertyId={property.id} />
                ) : session ? (
                  <p className="text-sm text-muted-foreground">
                    Only tenant accounts can submit rental requests.
                  </p>
                ) : (
                  <Button asChild className="w-full">
                    <Link href={`${appRoutes.login}?next=${appRoutes.propertyDetails(property.id)}`}>
                      Sign in to request
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="size-5 text-primary" aria-hidden="true" />
                  Landlord
                </CardTitle>
                <CardDescription>{property.landlord?.name ?? "RentNest landlord"}</CardDescription>
              </CardHeader>
            </Card>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

async function getPropertyOrNotFound(id: string) {
  try {
    return await getProperty(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}
