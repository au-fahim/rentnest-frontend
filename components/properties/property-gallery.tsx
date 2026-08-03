"use client";

import { Images } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { noPropertyImageLabel } from "@/lib/formatters/property-image";
import { cn } from "@/lib/utils/cn";

type PropertyGalleryProps = {
  title: string;
  images: string[];
};

export function PropertyGallery({ title, images }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex] ?? images[0];

  let galleryContent;

  if (images.length > 1) {
    galleryContent = (
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            className={cn(
              "relative aspect-[4/3] overflow-hidden rounded-md border bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              selectedIndex === index &&
                "border-primary ring-2 ring-primary/30",
            )}
            onClick={() => setSelectedIndex(index)}
            aria-label={`Show property photo ${index + 1}`}
            aria-current={selectedIndex === index}
          >
            <Image
              src={image}
              alt={`${title} thumbnail ${index + 1}`}
              fill
              sizes="140px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    );
  } else if (images.length === 1) {
    galleryContent = (
      <div className="flex items-center gap-2 rounded-lg border bg-secondary/30 p-3 text-sm text-muted-foreground">
        <Images className="size-4 text-primary" aria-hidden="true" />
        One gallery image is available for this listing.
      </div>
    );
  } else {
    galleryContent = <></>;
  }

  return (
    <section className="space-y-3" aria-label={`${title} image gallery`}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg border bg-muted">
        {selectedImage ? (
          <>
            <Image
              src={selectedImage}
              alt={`${title} main property photo`}
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
            <div className="absolute bottom-4 left-4 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
              {selectedIndex + 1} / {images.length}
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-base font-medium text-muted-foreground">
            {noPropertyImageLabel}
          </div>
        )}
      </div>

      {galleryContent}

      {/* {images.length > 1 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-md border bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                selectedIndex === index &&
                  "border-primary ring-2 ring-primary/30",
              )}
              onClick={() => setSelectedIndex(index)}
              aria-label={`Show property photo ${index + 1}`}
              aria-current={selectedIndex === index}
            >
              <Image
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                sizes="140px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-lg border bg-secondary/30 p-3 text-sm text-muted-foreground">
          <Images className="size-4 text-primary" aria-hidden="true" />
          One gallery image is available for this listing.
        </div>
      )} */}
    </section>
  );
}
