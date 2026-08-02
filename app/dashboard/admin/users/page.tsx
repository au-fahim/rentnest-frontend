import type { Metadata } from "next";

import { AdminUsersTable } from "@/components/admin/admin-users-table";
import { RequireRole } from "@/components/auth/require-role";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminUsers } from "@/lib/api/admin-services";

export const metadata: Metadata = {
  title: "Admin Users",
};

export default function AdminUsersPage() {
  return (
    <RequireRole roles={["ADMIN"]}>
      {async () => {
        const users = await getAdminUsers();

        return (
          <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6">
              <DashboardPageHeader
                eyebrow="Admin users"
                title="User management"
                description="Monitor account roles and ban or restore non-admin users."
              />

              <Card>
                <CardHeader>
                  <CardTitle>All users</CardTitle>
                </CardHeader>
                <CardContent>
                  {users.length === 0 ? (
                    <EmptyState title="No users found" description="Registered accounts will appear here." />
                  ) : (
                    <AdminUsersTable users={users} />
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        );
      }}
    </RequireRole>
  );
}
