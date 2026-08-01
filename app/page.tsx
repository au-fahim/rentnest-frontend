import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Search,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PropertyGrid } from "@/components/properties/property-grid";
import { Button } from "@/components/ui/button";
import { appRoutes } from "@/config/routes";
import { getProperties } from "@/lib/api/public-services";

const trustSignals = [
  "Verified rental requests",
  "Role-based dashboards",
  "Stripe-ready payments",
];

const workflowCards = [
  {
    icon: Search,
    title: "Browse with intent",
    description:
      "Search by location, budget, category, and amenities before opening a detail view.",
  },
  {
    icon: ShieldCheck,
    title: "Request with confidence",
    description:
      "Tenants submit validated rental requests and track approval status from one dashboard.",
  },
  {
    icon: Building2,
    title: "Manage listings cleanly",
    description:
      "Landlords get a focused workspace for properties, requests, availability, and earnings.",
  },
];

export default async function Home() {
  const featuredProperties = await getProperties().then(
    (properties) => properties.slice(0, 3),
    () => [],
  );

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative isolate overflow-hidden border-b bg-secondary/40">
          <div className="mx-auto grid min-h-[calc(100dvh-4rem)] w-full max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.88fr] lg:px-8">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex rounded-full border bg-background px-3 py-1 text-sm font-medium text-muted-foreground">
                RentNest Frontend Project
              </p>
              <h1 className="text-balance text-4xl font-semibold tracking-normal text-foreground sm:text-5xl lg:text-6xl">
                Find and list rental homes with less friction.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                A production-minded rental marketplace for tenants, landlords,
                and admins, built around real API integration, protected
                workflows, structured feedback, and responsive UI.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href={appRoutes.properties}>
                    Browse rentals
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href={appRoutes.register}>Create account</Link>
                </Button>
              </div>
              <ul className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                {trustSignals.map((signal) => (
                  <li key={signal} className="flex items-center gap-2">
                    <CheckCircle2
                      className="size-4 text-primary"
                      aria-hidden="true"
                    />
                    {signal}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative min-h-[360px] overflow-hidden rounded-lg border bg-card shadow-sm lg:min-h-[540px]">
              <Image
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85"
                alt="Bright modern apartment living room"
                fill
                priority
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                <p className="text-sm uppercase tracking-[0.18em] text-white/70">
                  Marketplace preview
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-normal">
                  Airbnb-inspired browsing, dashboard-grade operations.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-primary">
                Featured rentals
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-normal">
                Fresh from the marketplace
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link href={appRoutes.properties}>View all</Link>
            </Button>
          </div>
          <PropertyGrid properties={featuredProperties} />
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {workflowCards.map((card) => (
              <article
                key={card.title}
                className="rounded-lg border bg-card p-5 text-card-foreground shadow-sm"
              >
                <card.icon
                  className="mb-4 size-6 text-primary"
                  aria-hidden="true"
                />
                <h2 className="text-lg font-semibold tracking-normal">
                  {card.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {card.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
