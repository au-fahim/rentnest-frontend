"use server";

import { redirect } from "next/navigation";

import {
  createProperty,
  createPropertyWithImages,
  deletePropertyImage,
  deleteProperty,
  setPropertyAvailability,
  updateProperty,
  updatePropertyWithImages,
  updateRentalRequestStatus,
} from "@/lib/api/landlord-services";
import { createRentalRequest, createReview } from "@/lib/api/tenant-services";
import { ApiError } from "@/lib/api/api-client";
import {
  propertySchema,
  rentalRequestSchema,
  requestStatusSchema,
  reviewSchema,
  type PropertyInput,
  type RentalRequestInput,
  type RequestStatusInput,
  type ReviewInput,
} from "@/types/forms";

export type MutationResult =
  | { success: true; message: string }
  | { success: false; message: string; fieldErrors?: Record<string, string[]> };

export async function submitRentalRequestAction(
  input: RentalRequestInput,
): Promise<MutationResult> {
  const parsed = rentalRequestSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  return getMutationResult(() => createRentalRequest(parsed.data));
}

export async function submitReviewAction(
  input: ReviewInput,
): Promise<MutationResult> {
  const parsed = reviewSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  return getMutationResult(() => createReview(parsed.data));
}

export async function createPropertyAction(
  input: PropertyInput,
): Promise<MutationResult> {
  const parsed = propertySchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const result = await getMutationResult(() => createProperty(parsed.data));

  if (result.success) {
    redirect("/dashboard/landlord");
  }

  return result;
}

export async function createPropertyFormDataAction(
  formData: FormData,
): Promise<MutationResult> {
  const parsed = propertySchema.safeParse(
    getPropertyValuesFromFormData(formData),
  );

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const payload = buildPropertyFormData(parsed.data, formData);
  const result = await getMutationResult(() =>
    createPropertyWithImages(payload),
  );

  if (result.success) {
    redirect("/dashboard/landlord/properties");
  }

  return result;
}

export async function updatePropertyAction(
  propertyId: string,
  input: PropertyInput,
): Promise<MutationResult> {
  const parsed = propertySchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const result = await getMutationResult(() =>
    updateProperty(propertyId, parsed.data),
  );

  if (result.success) {
    redirect("/dashboard/landlord");
  }

  return result;
}

export async function updatePropertyFormDataAction(
  propertyId: string,
  formData: FormData,
): Promise<MutationResult> {
  const parsed = propertySchema.safeParse(
    getPropertyValuesFromFormData(formData),
  );

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const payload = buildPropertyFormData(parsed.data, formData);
  const removeImageIds = formData
    .getAll("removeImageIds")
    .map(String)
    .filter(Boolean);

  if (removeImageIds.length > 0) {
    payload.set("removeImageIds", JSON.stringify(removeImageIds));
  }

  const result = await getMutationResult(() =>
    updatePropertyWithImages(propertyId, payload),
  );

  if (result.success) {
    redirect("/dashboard/landlord/properties");
  }

  return result;
}

export async function togglePropertyAvailabilityAction(
  propertyId: string,
  isAvailable: boolean,
) {
  return getMutationResult(() =>
    setPropertyAvailability(propertyId, isAvailable),
  );
}

export async function deletePropertyImageAction(
  propertyId: string,
  imageId: string,
) {
  return getMutationResult(() => deletePropertyImage(propertyId, imageId));
}

export async function deletePropertyAction(propertyId: string) {
  return getMutationResult(() => deleteProperty(propertyId));
}

export async function updateRentalRequestStatusAction(
  input: RequestStatusInput,
) {
  const parsed = requestStatusSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid request status.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  return getMutationResult(() => updateRentalRequestStatus(parsed.data));
}

async function getMutationResult(
  mutation: () => Promise<{ message: string }>,
): Promise<MutationResult> {
  try {
    const response = await mutation();
    return { success: true, message: response.message };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message };
    }

    if (error instanceof Error) {
      return { success: false, message: error.message };
    }

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

function getPropertyValuesFromFormData(formData: FormData) {
  return {
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    location: formData.get("location"),
    categoryId: formData.get("categoryId"),
    amenities: formData.get("amenities"),
    isAvailable: formData.get("isAvailable") === "true",
  };
}

function buildPropertyFormData(input: PropertyInput, source: FormData) {
  const formData = new FormData();
  formData.set("title", input.title);
  formData.set("description", input.description);
  formData.set("price", String(input.price));
  formData.set("location", input.location);
  formData.set("categoryId", input.categoryId);
  formData.set("amenities", input.amenities);
  formData.set("isAvailable", String(input.isAvailable));

  source.getAll("images").forEach((value) => {
    if (value instanceof File && value.size > 0) {
      formData.append("images", value);
    }
  });

  return formData;
}
