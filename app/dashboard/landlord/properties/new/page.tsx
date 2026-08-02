import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { RequireRole } from "@/components/auth/require-role";
import { PropertyForm } from "@/components/forms/property-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { appRoutes } from "@/config/routes";
import { createPropertyFormDataAction } from "@/lib/api/form-actions";
import { getCategories } from "@/lib/api/public-services";

export const metadata: Metadata = {
  title: "Create Property",
};

export default function NewPropertyPage() {
  return (
    <RequireRole roles={["LANDLORD"]}>
      {async () => {
        const categories = await getCategories();

        return (
          <main className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
            <Button asChild variant="ghost" className="w-fit">
              <Link href={appRoutes.landlordDashboard}>
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back to dashboard
              </Link>
            </Button>
            <Card>
              <CardHeader>
                <CardTitle>Create property listing</CardTitle>
                <CardDescription>Add the rental details tenants will see while browsing.</CardDescription>
              </CardHeader>
              <CardContent>
                <PropertyForm
                  categories={categories}
                  submitLabel="Create listing"
                  action={createPropertyFormDataAction}
                />
              </CardContent>
            </Card>
          </main>
        );
      }}
    </RequireRole>
  );
}
