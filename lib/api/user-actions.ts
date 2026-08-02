"use server";

import { ApiError } from "@/lib/api/api-client";
import { updateProfile } from "@/lib/api/user-services";
import { profileSchema, type ProfileInput } from "@/types/forms";

export async function updateProfileAction(input: ProfileInput) {
  const parsed = profileSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await updateProfile(parsed.data);
    return { success: true, message: response.message };
  } catch (error) {
    if (error instanceof ApiError || error instanceof Error) {
      return { success: false, message: error.message };
    }

    return { success: false, message: "Profile could not be updated." };
  }
}
