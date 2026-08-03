import type { Property } from "@/types/domain";

const legacyFallbackImages = new Set([
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
]);

export const noPropertyImageLabel = "No Property Images Available";

export function getPropertyImages(
  property: Pick<Property, "id" | "imageUrl" | "images">,
) {
  const uploadedImages = property.images
    ?.map((image) => image.url)
    .filter(isRealPropertyImage);

  if (uploadedImages?.length) {
    return uploadedImages;
  }

  if (isRealPropertyImage(property.imageUrl)) {
    return [property.imageUrl];
  }

  return [];
}

export function getPropertyImageUrl(
  property: Pick<Property, "id" | "imageUrl" | "images">,
) {
  return getPropertyImages(property)[0];
}

function isRealPropertyImage(url: string | null | undefined): url is string {
  return Boolean(url && !legacyFallbackImages.has(url));
}
