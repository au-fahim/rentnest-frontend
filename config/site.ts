import { env } from "@/lib/env";

export const siteConfig = {
  name: "RentNest",
  description:
    "A modern rental property marketplace for tenants, landlords, and platform administrators.",
  url: env.NEXT_PUBLIC_APP_URL,
} as const;
