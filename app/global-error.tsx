"use client";

import { Button } from "@/components/ui/button";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function GlobalError({ unstable_retry }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
          <p className="text-sm font-medium text-destructive">Critical error</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal">
            RentNest needs a fresh render.
          </h1>
          <Button className="mt-6" onClick={unstable_retry}>
            Reload view
          </Button>
        </main>
      </body>
    </html>
  );
}
