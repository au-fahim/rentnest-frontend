import type { Property } from "@/types/domain";

const fallbackImages = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80"
] as const;

export function getPropertyImages(property: Pick<Property, "id" | "imageUrl" | "images">) {
  const uploadedImages = property.images
    ?.map((image) => image.url)
    .filter((url): url is string => Boolean(url));

  if (uploadedImages?.length) {
    return uploadedImages;
  }

  if (property.imageUrl) {
    return [property.imageUrl];
  }

  const index = property.id.charCodeAt(0) % fallbackImages.length;
  return [fallbackImages[index]];
}

export function getPropertyImageUrl(property: Pick<Property, "id" | "imageUrl" | "images">) {
  return getPropertyImages(property)[0];
}
