import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { RequireRole } from "@/components/auth/require-role";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { appRoutes } from "@/config/routes";

export const metadata: Metadata = {
  title: "Payment Success",
};

export default function PaymentSuccessPage() {
  return (
    <RequireRole roles={["TENANT"]}>
      {() => (
        <main className="mx-auto flex min-h-dvh w-full max-w-2xl items-center px-4 py-12">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="size-6 text-primary" aria-hidden="true" />
                Payment completed
              </CardTitle>
              <CardDescription>
                Your Stripe payment was confirmed and the rental request has been activated.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={appRoutes.tenantDashboard}>Return to dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      )}
    </RequireRole>
  );
}
