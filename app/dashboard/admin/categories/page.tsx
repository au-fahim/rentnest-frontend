import type { Metadata } from "next";

import { CategoryManager } from "@/components/admin/category-manager";
import { RequireRole } from "@/components/auth/require-role";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { getCategories } from "@/lib/api/public-services";

export const metadata: Metadata = {
  title: "Admin Categories",
};

export default function AdminCategoriesPage() {
  return (
    <RequireRole roles={["ADMIN"]}>
      {async () => {
        const categories = await getCategories();

        return (
          <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6">
              <DashboardPageHeader
                eyebrow="Admin categories"
                title="Category moderation"
                description="Create, edit, and remove property types used by search filters and landlord forms."
              />
              <CategoryManager categories={categories} />
            </div>
          </main>
        );
      }}
    </RequireRole>
  );
}
