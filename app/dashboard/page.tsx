import { redirect } from "next/navigation";

import { appRoutes } from "@/config/routes";
import { getCurrentUser, getRoleDashboardPath } from "@/lib/auth/session";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(appRoutes.login);
  }

  redirect(getRoleDashboardPath(user.role));
}
