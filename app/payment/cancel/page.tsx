import { XCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { RequireRole } from "@/components/auth/require-role";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { appRoutes } from "@/config/routes";

export const metadata: Metadata = {
  title: "Payment Cancelled",
};

export default function PaymentCancelPage() {
  return (
    <RequireRole roles={["TENANT"]}>
      {() => (
        <main className="mx-auto flex min-h-dvh w-full max-w-2xl items-center px-4 py-12">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="size-6 text-destructive" aria-hidden="true" />
                Payment not completed
              </CardTitle>
              <CardDescription>
                Your payment was cancelled or Stripe could not complete the confirmation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href={appRoutes.tenantDashboard}>Back to requests</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      )}
    </RequireRole>
  );
}
