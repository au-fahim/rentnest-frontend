"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Loader2,
  Save,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FieldError } from "@/components/forms/field-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableMultiSelect } from "@/components/ui/searchable-multi-select";
import {
  getAmenityOptions,
  parseAmenityList,
  serializeAmenityList,
} from "@/config/amenities";
import { deletePropertyImageAction } from "@/lib/api/form-actions";
import type { Category, Property } from "@/types/domain";
import {
  propertySchema,
  type PropertyFormInput,
  type PropertyInput,
} from "@/types/forms";

const maxImageCount = 6;
const maxImageSize = 5 * 1024 * 1024;
const allowedImageTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

type SelectedUpload = {
  id: string;
  file: File;
  previewUrl: string;
};

type PropertyFormProps = {
  categories: Category[];
  property?: Property;
  submitLabel: string;
  action: (formData: FormData) => Promise<{
    success: boolean;
    message: string;
    fieldErrors?: Record<string, string[]>;
  }>;
};

export function PropertyForm({
  categories,
  property,
  submitLabel,
  action,
}: PropertyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeletingImage, startDeleteImageTransition] = useTransition();
  const [isAvailable, setIsAvailable] = useState(property?.isAvailable ?? true);
  const [selectedAmenities, setSelectedAmenities] = useState(() =>
    parseAmenityList(property?.amenities.join(", ") ?? ""),
  );
  const [selectedUploads, setSelectedUploads] = useState<SelectedUpload[]>([]);
  const [removeImageIds, setRemoveImageIds] = useState<string[]>([]);
  const [formError, setFormError] = useState<string>();
  const selectedUploadsRef = useRef<SelectedUpload[]>([]);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<PropertyFormInput, unknown, PropertyInput>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: property?.title ?? "",
      description: property?.description ?? "",
      price: property?.price ?? 0,
      location: property?.location ?? "",
      categoryId: property?.categoryId ?? categories[0]?.id ?? "",
      amenities: property?.amenities.join(", ") ?? "",
      isAvailable: property?.isAvailable ?? true,
    },
  });

  useEffect(() => {
    selectedUploadsRef.current = selectedUploads;
  }, [selectedUploads]);

  useEffect(() => {
    return () => {
      selectedUploadsRef.current.forEach((upload) => {
        URL.revokeObjectURL(upload.previewUrl);
      });
    };
  }, []);

  function onSubmit(values: PropertyInput) {
    setFormError(undefined);

    const remainingExistingImages =
      (property?.images?.length ?? 0) - removeImageIds.length;

    if (remainingExistingImages + selectedUploads.length > maxImageCount) {
      const message = `A property can have at most ${maxImageCount} images.`;
      setFormError(message);
      toast.error(message);
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.set("title", values.title);
      formData.set("description", values.description);
      formData.set("price", String(values.price));
      formData.set("location", values.location);
      formData.set("categoryId", values.categoryId);
      formData.set("amenities", values.amenities);
      formData.set("isAvailable", String(isAvailable));
      selectedUploads.forEach((upload) =>
        formData.append("images", upload.file),
      );
      removeImageIds.forEach((imageId) =>
        formData.append("removeImageIds", imageId),
      );

      const result = await action(formData);

      if (!result.success) {
        Object.entries(result.fieldErrors ?? {}).forEach(
          ([field, messages]) => {
            if (messages[0]) {
              setError(field as keyof PropertyInput, { message: messages[0] });
            }
          },
        );
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
    });
  }

  function deleteImage(imageId: string) {
    if (!property) {
      return;
    }

    startDeleteImageTransition(async () => {
      const result = await deletePropertyImageAction(property.id, imageId);

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  }

  function selectFiles(files: File[]) {
    const invalidType = files.find(
      (file) => !allowedImageTypes.includes(file.type),
    );

    if (invalidType) {
      const message = "Only JPG, PNG, and WEBP images are allowed.";
      setFormError(message);
      toast.error(message);
      return;
    }

    const oversized = files.find((file) => file.size > maxImageSize);

    if (oversized) {
      const message = "Each image must be 5MB or smaller.";
      setFormError(message);
      toast.error(message);
      return;
    }

    const remainingSlots = maxImageCount - selectedUploads.length;

    if (remainingSlots <= 0) {
      const message = `A property can have at most ${maxImageCount} images.`;
      setFormError(message);
      toast.error(message);
      return;
    }

    const nextUploads = files.slice(0, remainingSlots).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setFormError(undefined);
    setSelectedUploads((current) => [...current, ...nextUploads]);
  }

  function removeSelectedUpload(uploadId: string) {
    setSelectedUploads((current) => {
      const upload = current.find((item) => item.id === uploadId);

      if (upload) {
        URL.revokeObjectURL(upload.previewUrl);
      }

      return current.filter((item) => item.id !== uploadId);
    });
  }

  function moveSelectedUpload(uploadId: string, direction: "up" | "down") {
    setSelectedUploads((current) => {
      const currentIndex = current.findIndex((item) => item.id === uploadId);
      const nextIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const nextUploads = [...current];
      [nextUploads[currentIndex], nextUploads[nextIndex]] = [
        nextUploads[nextIndex],
        nextUploads[currentIndex],
      ];

      return nextUploads;
    });
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} />
          <FieldError message={errors.title?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Monthly rent</Label>
          <Input id="price" type="number" min={1} {...register("price")} />
          <FieldError message={errors.price?.message} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={5}
          className="flex w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          {...register("description")}
        />
        <FieldError message={errors.description?.message} />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register("location")} />
          <FieldError message={errors.location?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <select
            id="categoryId"
            className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            {...register("categoryId")}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <FieldError message={errors.categoryId?.message} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amenities">Amenities</Label>
        <input type="hidden" {...register("amenities")} />
        <SearchableMultiSelect
          id="amenities"
          options={getAmenityOptions(property?.amenities)}
          value={selectedAmenities}
          onChange={(nextAmenities) => {
            setSelectedAmenities(nextAmenities);
            setValue("amenities", serializeAmenityList(nextAmenities), {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
          placeholder="Select amenities"
          searchPlaceholder="Search amenities"
        />
        <FieldError message={errors.amenities?.message} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="images">Property images</Label>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, WEBP. Max 6 images, 5MB each.
          </p>
        </div>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-secondary/30 px-4 py-6 text-center transition-colors hover:bg-secondary/50">
          <ImagePlus className="size-8 text-primary" aria-hidden="true" />
          <span className="mt-2 text-sm font-medium">
            Choose property photos
          </span>
          <span className="mt-1 text-xs text-muted-foreground">
            {selectedUploads.length > 0
              ? `${selectedUploads.length} file(s) selected`
              : "Upload living room, bedroom, exterior, and amenity photos"}
          </span>
          <input
            id="images"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            className="sr-only"
            onChange={(event) => {
              selectFiles(Array.from(event.target.files ?? []));
              event.target.value = "";
            }}
          />
        </label>
        {selectedUploads.length > 0 ? (
          <div className="rounded-lg border bg-background p-3">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">Selected uploads</p>
              <p className="text-xs text-muted-foreground">
                Drag-free ordering: use arrows to set 1st, 2nd, and next photos.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {selectedUploads.map((upload, index) => (
                <div
                  key={upload.id}
                  className="overflow-hidden rounded-lg border bg-card"
                >
                  <div className="relative aspect-[4/3] bg-muted">
                    <Image
                      src={upload.previewUrl}
                      alt={`${upload.file.name} preview`}
                      fill
                      unoptimized
                      sizes="(min-width: 1024px) 220px, 50vw"
                      className="object-cover"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="space-y-3 p-3">
                    <div>
                      <p className="truncate text-sm font-medium">
                        {upload.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(upload.file.size)}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        aria-label={`Move ${upload.file.name} up`}
                        disabled={index === 0}
                        onClick={() => moveSelectedUpload(upload.id, "up")}
                      >
                        <ArrowUp className="size-4" aria-hidden="true" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        aria-label={`Move ${upload.file.name} down`}
                        disabled={index === selectedUploads.length - 1}
                        onClick={() => moveSelectedUpload(upload.id, "down")}
                      >
                        <ArrowDown className="size-4" aria-hidden="true" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        aria-label={`Remove ${upload.file.name}`}
                        onClick={() => removeSelectedUpload(upload.id)}
                      >
                        <X className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {property?.images?.length ? (
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium">Current images</p>
            <p className="text-xs text-muted-foreground">
              Remove selected images on save, or delete one immediately.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {property.images.map((image) => {
              const willRemove = removeImageIds.includes(image.id);

              return (
                <div
                  key={image.id}
                  className="overflow-hidden rounded-lg border bg-background"
                >
                  <div className="relative aspect-[4/3] bg-muted">
                    <Image
                      src={image.url}
                      alt={`${property.title} image`}
                      fill
                      sizes="(min-width: 1024px) 260px, 50vw"
                      className={
                        willRemove ? "object-cover opacity-40" : "object-cover"
                      }
                    />
                  </div>
                  <div className="space-y-2 p-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={willRemove}
                        onChange={(event) => {
                          setRemoveImageIds((current) =>
                            event.target.checked
                              ? [...current, image.id]
                              : current.filter((id) => id !== image.id),
                          );
                        }}
                      />
                      Remove on save
                    </label>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="w-full"
                      disabled={isDeletingImage}
                      onClick={() => deleteImage(image.id)}
                    >
                      {isDeletingImage ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Trash2 className="size-4" aria-hidden="true" />
                      )}
                      Delete image
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <label className="flex items-center gap-3 rounded-lg border bg-background p-3 text-sm">
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={(event) => {
            setIsAvailable(event.target.checked);
            setValue("isAvailable", event.target.checked, {
              shouldDirty: true,
            });
          }}
        />
        Available for rent
      </label>

      <FieldError message={formError} />

      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Save className="size-4" />
        )}
        {submitLabel}
      </Button>
    </form>
  );
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
