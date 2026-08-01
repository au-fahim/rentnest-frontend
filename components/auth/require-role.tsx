import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { appRoutes } from "@/config/routes";
import { getCurrentUser } from "@/lib/auth/session";
import type { UserRole } from "@/types/domain";

type AwaitableNode = ReactNode | Promise<ReactNode>;

type RequireRoleProps = {
  roles: readonly UserRole[];
  children: (user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>) => AwaitableNode;
};

export async function RequireRole({ roles, children }: RequireRoleProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(appRoutes.login);
  }

  if (!roles.includes(user.role)) {
    redirect(appRoutes.home);
  }

  return await children(user);
}
