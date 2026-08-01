import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { DashboardSectionNav } from "@/components/dashboard/dashboard-section-nav";
import { SiteHeader } from "@/components/layout/site-header";
import { appRoutes, roleDashboardLinks } from "@/config/routes";
import { getCurrentUser } from "@/lib/auth/session";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(appRoutes.login);
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <div className="border-b bg-secondary/30">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-primary">{getWorkspaceLabel(user.role)}</p>
              <h1 className="text-2xl font-semibold tracking-normal">{user.name}&apos;s workspace</h1>
            </div>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <DashboardSectionNav
            links={[...roleDashboardLinks[user.role], { href: appRoutes.profile, label: "Profile" }]}
          />
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function getWorkspaceLabel(role: "TENANT" | "LANDLORD" | "ADMIN") {
  if (role === "ADMIN") {
    return "Admin workspace";
  }

  if (role === "LANDLORD") {
    return "Landlord workspace";
  }

  return "Tenant workspace";
}
