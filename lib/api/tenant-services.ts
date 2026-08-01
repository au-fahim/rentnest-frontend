import { revalidatePath } from "next/cache";

import { apiEndpoints } from "@/config/api-endpoints";
import { appRoutes } from "@/config/routes";
import { apiRequest } from "@/lib/api/api-client";
import { getAuthToken } from "@/lib/auth/session";
import type { ApiResponse, Payment, PaymentIntentPayload, RentalRequest } from "@/types/domain";
import type { RentalRequestInput, ReviewInput } from "@/types/forms";

export async function getTenantRequests() {
  const token = await getRequiredToken();
  const response = await apiRequest<ApiResponse<RentalRequest[]>>(apiEndpoints.requests.tenantList, {
    token,
    cache: "no-store",
  });

  return response.data;
}

export async function getTenantRequestDetails(rentalRequestId: string) {
  const token = await getRequiredToken();
  const response = await apiRequest<ApiResponse<RentalRequest>>(
    apiEndpoints.requests.details(rentalRequestId),
    {
      token,
      cache: "no-store",
    },
  );

  return response.data;
}

export async function getTenantPayments() {
  const token = await getRequiredToken();
  const response = await apiRequest<ApiResponse<Payment[]>>(apiEndpoints.payments.list, {
    token,
    cache: "no-store",
  });

  return response.data;
}

export async function createRentalRequest(input: RentalRequestInput) {
  const token = await getRequiredToken();
  const response = await apiRequest<ApiResponse<RentalRequest>>(apiEndpoints.requests.create, {
    method: "POST",
    token,
    json: {
      propertyId: input.propertyId,
      moveInDate: new Date(input.moveInDate).toISOString(),
      moveOutDate: new Date(input.moveOutDate).toISOString(),
    },
    cache: "no-store",
  });

  revalidatePath(appRoutes.tenantDashboard);
  return response;
}

export async function createReview(input: ReviewInput) {
  const token = await getRequiredToken();
  const response = await apiRequest<ApiResponse<unknown>>(apiEndpoints.reviews.create, {
    method: "POST",
    token,
    json: input,
    cache: "no-store",
  });

  revalidatePath(appRoutes.tenantDashboard);
  return response;
}

export async function createPaymentIntent(rentalRequestId: string) {
  const token = await getRequiredToken();
  const response = await apiRequest<ApiResponse<PaymentIntentPayload>>(apiEndpoints.payments.create, {
    method: "POST",
    token,
    json: { rentalRequestId },
    cache: "no-store",
  });

  return response.data;
}

export async function confirmPayment(paymentId: string, stripePaymentIntentId: string) {
  const token = await getRequiredToken();
  const response = await apiRequest<ApiResponse<Payment>>(apiEndpoints.payments.confirm, {
    method: "POST",
    token,
    json: { paymentId, stripePaymentIntentId },
    cache: "no-store",
  });

  revalidatePath(appRoutes.tenantDashboard);
  return response;
}

async function getRequiredToken() {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("You must be signed in.");
  }

  return token;
}
