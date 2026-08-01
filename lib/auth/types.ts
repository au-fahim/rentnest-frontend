import type { UserRole } from "@/types/domain";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthResponseData = AuthUser & {
  token: string;
};

export type RegisterResponseData = AuthUser & {
  createdAt: string;
  updatedAt: string;
};

export type AuthActionResult =
  | {
      success: true;
      message: string;
      redirectTo: string;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: Partial<Record<"name" | "email" | "password" | "role", string[]>>;
    };
