import Link from "next/link";

import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { appRoutes } from "@/config/routes";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-start justify-center px-4 py-12">
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-normal">
          This RentNest page is not available.
        </h1>
        <p className="mt-3 text-muted-foreground">
          The route may not be built yet, or the link may be outdated.
        </p>
        <Button asChild className="mt-6">
          <Link href={appRoutes.home}>Go home</Link>
        </Button>
      </main>
    </div>
  );
}
