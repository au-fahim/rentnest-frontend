"use client";

import { Button } from "@/components/ui/button";

export default function PropertiesError({ unstable_retry }: { unstable_retry: () => void }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-start justify-center px-4 py-12">
      <p className="text-sm font-medium text-destructive">Property loading failed</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-normal">We could not load rentals.</h1>
      <p className="mt-3 text-muted-foreground">Try again after the backend finishes responding.</p>
      <Button className="mt-6" onClick={unstable_retry}>
        Retry
      </Button>
    </main>
  );
}
