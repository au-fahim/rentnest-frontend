import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/auth-card";
import { RegisterForm } from "@/components/auth/register-form";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a RentNest tenant or landlord account.",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <section className="hidden lg:block">
          <p className="text-sm font-medium text-primary">
            Role-based onboarding
          </p>
          <h1 className="mt-3 max-w-lg text-4xl font-semibold tracking-normal">
            Pick the account type that matches how you use RentNest.
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Tenants request rentals and landlords manage listings from protected
            workspaces. Admin access is managed privately.
          </p>
        </section>
        <div className="mx-auto w-full max-w-sm lg:max-w-md lg:mx-0">
          <AuthCard
            title="Create account"
            description="Select a role and complete your profile."
          >
            <RegisterForm />
          </AuthCard>
        </div>
      </main>
    </div>
  );
}
