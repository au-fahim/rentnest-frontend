import { apiEndpoints } from "@/config/api-endpoints";
import { apiRequest } from "@/lib/api/api-client";
import type { ApiResponse, Category, Property } from "@/types/domain";
import type { PropertyFilterInput } from "@/types/forms";

export async function getCategories() {
  const response = await apiRequest<ApiResponse<Category[]>>(apiEndpoints.categories.list, {
    next: { revalidate: 300 },
  });

  return response.data;
}

export async function getProperties(filters: PropertyFilterInput = {}) {
  const response = await apiRequest<ApiResponse<Property[]>>(apiEndpoints.properties.list, {
    query: normalizePropertyFilters(filters),
    next: { revalidate: 60 },
  });

  return response.data;
}

export async function getProperty(propertyId: string) {
  const response = await apiRequest<ApiResponse<Property>>(apiEndpoints.properties.details(propertyId), {
    cache: "no-store",
  });

  return response.data;
}

function normalizePropertyFilters(filters: PropertyFilterInput) {
  return {
    searchTerm: filters.searchTerm,
    location: filters.location,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    categoryId: filters.categoryId,
    amenities: filters.amenities,
  };
}
