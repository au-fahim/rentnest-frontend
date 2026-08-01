import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { SiteHeader } from "@/components/layout/site-header";
import { appRoutes } from "@/config/routes";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your RentNest account.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <section className="hidden lg:block">
          <p className="text-sm font-medium text-primary">Secure access</p>
          <h1 className="mt-3 max-w-lg text-4xl font-semibold tracking-normal">
            Continue to your tenant, landlord, or admin workspace.
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            RentNest keeps authentication on the server with HttpOnly cookies,
            then adapts dashboards and navigation to your verified role.
          </p>
          <Link href={appRoutes.properties} className="mt-6 inline-flex text-sm font-medium text-primary hover:underline">
            Browse public properties first
          </Link>
        </section>
        <AuthCard title="Welcome back" description="Use your registered RentNest credentials.">
          <LoginForm />
        </AuthCard>
      </main>
    </div>
  );
}
