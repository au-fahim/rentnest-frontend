import { revalidatePath } from "next/cache";

import { apiEndpoints } from "@/config/api-endpoints";
import { appRoutes } from "@/config/routes";
import { apiRequest } from "@/lib/api/api-client";
import { getAuthToken } from "@/lib/auth/session";
import type { ApiResponse, Property, RentalRequest } from "@/types/domain";
import type { PropertyInput, RequestStatusInput } from "@/types/forms";

export async function getLandlordProperties() {
  const token = await getRequiredToken();
  const response = await apiRequest<ApiResponse<Property[]>>(
    apiEndpoints.properties.myProperties,
    {
      token,
      cache: "no-store",
    },
  );

  return response.data;
}

export async function getLandlordRequests() {
  const token = await getRequiredToken();
  const response = await apiRequest<ApiResponse<RentalRequest[]>>(
    apiEndpoints.requests.landlordList,
    {
      token,
      cache: "no-store",
    },
  );

  return response.data;
}

export async function createProperty(input: PropertyInput) {
  const token = await getRequiredToken();
  const response = await apiRequest<ApiResponse<Property>>(
    apiEndpoints.properties.create,
    {
      method: "POST",
      token,
      json: propertyPayload(input),
      cache: "no-store",
    },
  );

  revalidatePath(appRoutes.landlordDashboard);
  return response;
}

export async function createPropertyWithImages(formData: FormData) {
  const token = await getRequiredToken();
  const response = await apiRequest<ApiResponse<Property>>(
    apiEndpoints.properties.create,
    {
      method: "POST",
      token,
      formData,
      cache: "no-store",
    },
  );

  revalidatePropertyViews();
  return response;
}

export async function updateProperty(propertyId: string, input: PropertyInput) {
  const token = await getRequiredToken();
  const response = await apiRequest<ApiResponse<Property>>(
    apiEndpoints.properties.update(propertyId),
    {
      method: "PATCH",
      token,
      json: propertyPayload(input),
      cache: "no-store",
    },
  );

  revalidatePath(appRoutes.landlordDashboard);
  return response;
}

export async function updatePropertyWithImages(
  propertyId: string,
  formData: FormData,
) {
  const token = await getRequiredToken();
  const response = await apiRequest<ApiResponse<Property>>(
    apiEndpoints.properties.update(propertyId),
    {
      method: "PATCH",
      token,
      formData,
      cache: "no-store",
    },
  );

  revalidatePropertyViews(propertyId);
  return response;
}

export async function deletePropertyImage(propertyId: string, imageId: string) {
  const token = await getRequiredToken();
  const response = await apiRequest<ApiResponse<unknown>>(
    apiEndpoints.properties.deleteImage(propertyId, imageId),
    {
      method: "DELETE",
      token,
      cache: "no-store",
    },
  );

  revalidatePropertyViews(propertyId);
  return response;
}

export async function setPropertyAvailability(
  propertyId: string,
  isAvailable: boolean,
) {
  const token = await getRequiredToken();
  const response = await apiRequest<ApiResponse<Property>>(
    apiEndpoints.properties.update(propertyId),
    {
      method: "PATCH",
      token,
      json: { isAvailable },
      cache: "no-store",
    },
  );

  revalidatePropertyViews(propertyId);
  return response;
}

export async function deleteProperty(propertyId: string) {
  const token = await getRequiredToken();
  const response = await apiRequest<ApiResponse<unknown>>(
    apiEndpoints.properties.delete(propertyId),
    {
      method: "DELETE",
      token,
      cache: "no-store",
    },
  );

  revalidatePropertyViews(propertyId);
  return response;
}

export async function updateRentalRequestStatus(input: RequestStatusInput) {
  const token = await getRequiredToken();
  const response = await apiRequest<ApiResponse<RentalRequest>>(
    apiEndpoints.requests.updateStatus(input.rentalRequestId),
    {
      method: "PATCH",
      token,
      json: { status: input.status },
      cache: "no-store",
    },
  );

  revalidatePath(appRoutes.landlordRequests);
  return response;
}

function propertyPayload(input: PropertyInput) {
  return {
    title: input.title,
    description: input.description,
    price: input.price,
    location: input.location,
    categoryId: input.categoryId,
    amenities: input.amenities
      .split(",")
      .map((amenity) => amenity.trim())
      .filter(Boolean),
    isAvailable: input.isAvailable,
  };
}

function revalidatePropertyViews(propertyId?: string) {
  revalidatePath(appRoutes.landlordDashboard);
  revalidatePath(appRoutes.landlordProperties);
  revalidatePath(appRoutes.properties);

  if (propertyId) {
    revalidatePath(appRoutes.propertyDetails(propertyId));
  }
}

async function getRequiredToken() {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("You must be signed in.");
  }

  return token;
}
