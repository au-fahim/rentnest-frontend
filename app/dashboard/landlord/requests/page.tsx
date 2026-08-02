import { ArrowLeft, FileText } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { RequireRole } from "@/components/auth/require-role";
import { EmptyState } from "@/components/dashboard/empty-state";
import { LandlordRequestsTable } from "@/components/dashboard/landlord-requests-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appRoutes } from "@/config/routes";
import { getLandlordRequests } from "@/lib/api/landlord-services";

export const metadata: Metadata = {
  title: "Landlord Requests",
};

export default function LandlordRequestsPage() {
  return (
    <RequireRole roles={["LANDLORD"]}>
      {async () => {
        const requests = await getLandlordRequests();

        return (
          <main className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
            <Button asChild variant="ghost" className="w-fit">
              <Link href={appRoutes.landlordDashboard}>
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back to dashboard
              </Link>
            </Button>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="size-5 text-primary" aria-hidden="true" />
                  Incoming rental requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {requests.length === 0 ? (
                  <EmptyState
                    title="No incoming requests"
                    description="Tenant requests for your listings will appear here."
                  />
                ) : (
                  <LandlordRequestsTable requests={requests} />
                )}
              </CardContent>
            </Card>
          </main>
        );
      }}
    </RequireRole>
  );
}
