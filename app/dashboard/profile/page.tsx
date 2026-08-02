import { Mail, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

import { RequireRole } from "@/components/auth/require-role";
import { ProfileForm } from "@/components/profile/profile-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return (
    <RequireRole roles={["TENANT", "LANDLORD", "ADMIN"]}>
      {async (user) => (
        <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your current RentNest account details.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border bg-secondary/30 p-4">
                <p className="text-sm text-muted-foreground">Full name</p>
                <p className="mt-2 text-lg font-semibold">{user.name}</p>
              </div>
              <div className="rounded-lg border bg-secondary/30 p-4">
                <p className="text-sm text-muted-foreground">Role</p>
                <p className="mt-2 flex items-center gap-2 text-lg font-semibold">
                  <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
                  {user.role}
                </p>
              </div>
              <div className="rounded-lg border bg-secondary/30 p-4 sm:col-span-2">
                <p className="text-sm text-muted-foreground">Email address</p>
                <p className="mt-2 flex items-center gap-2 text-lg font-semibold">
                  <Mail className="size-4 text-primary" aria-hidden="true" />
                  {user.email}
                </p>
              </div>
              <div className="rounded-lg border bg-background p-4 sm:col-span-2">
                <ProfileForm user={user} />
              </div>
            </CardContent>
          </Card>
        </main>
      )}
    </RequireRole>
  );
}
