"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

type AppErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function AppError({ error, unstable_retry }: AppErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-start justify-center px-4 py-12">
      <p className="text-sm font-medium text-destructive">Something went wrong</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-normal">
        RentNest could not load this view.
      </h1>
      <p className="mt-3 text-muted-foreground">
        Please try again. If it keeps failing, the API may be temporarily unavailable.
      </p>
      <Button className="mt-6" onClick={unstable_retry}>
        Try again
      </Button>
    </main>
  );
}
