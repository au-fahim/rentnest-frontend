import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RequireRole } from "@/components/auth/require-role";
import { PropertyForm } from "@/components/forms/property-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { appRoutes } from "@/config/routes";
import { updatePropertyFormDataAction } from "@/lib/api/form-actions";
import { getLandlordProperties } from "@/lib/api/landlord-services";
import { getCategories } from "@/lib/api/public-services";

export const metadata: Metadata = {
  title: "Edit Property",
};

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <RequireRole roles={["LANDLORD"]}>
      {async () => {
        const { id } = await params;
        const [categories, properties] = await Promise.all([getCategories(), getLandlordProperties()]);
        const property = properties.find((item) => item.id === id);

        if (!property) {
          notFound();
        }

        async function action(formData: FormData) {
          "use server";
          return updatePropertyFormDataAction(id, formData);
        }

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
                <CardTitle>Edit property listing</CardTitle>
                <CardDescription>Update pricing, availability, location, and amenities.</CardDescription>
              </CardHeader>
              <CardContent>
                <PropertyForm
                  categories={categories}
                  property={property}
                  submitLabel="Save changes"
                  action={action}
                />
              </CardContent>
            </Card>
          </main>
        );
      }}
    </RequireRole>
  );
}
