"use server";

import { ApiError } from "@/lib/api/api-client";
import { confirmPayment, createPaymentIntent } from "@/lib/api/tenant-services";

export async function startPaymentIntentAction(rentalRequestId: string) {
  try {
    const data = await createPaymentIntent(rentalRequestId);
    return { success: true, message: "Payment intent created successfully.", data };
  } catch (error) {
    if (error instanceof ApiError || error instanceof Error) {
      return { success: false, message: error.message };
    }

    return { success: false, message: "Could not start payment." };
  }
}

export async function confirmPaymentAction(paymentId: string, stripePaymentIntentId: string) {
  try {
    const response = await confirmPayment(paymentId, stripePaymentIntentId);
    return { success: true, message: response.message };
  } catch (error) {
    if (error instanceof ApiError || error instanceof Error) {
      return { success: false, message: error.message };
    }

    return { success: false, message: "Could not confirm payment." };
  }
}
