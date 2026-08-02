"use client";

import { AlertTriangle, Clock3, CreditCard, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { StripePaymentForm } from "@/components/payment/stripe-payment-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { appRoutes } from "@/config/routes";
import { startPaymentIntentAction } from "@/lib/api/payment-actions";
import { formatCurrency } from "@/lib/formatters/currency";
import type { PaymentIntentPayload, RentalRequest } from "@/types/domain";

const PAYMENT_WINDOW_MS = 10 * 60 * 1000;

type TenantPaymentFlowProps = {
  request: RentalRequest;
};

type StoredPaymentSession = PaymentIntentPayload & {
  requestId: string;
  createdAt: string;
};

type PaymentSessionResolution =
  | { type: "ready"; session: StoredPaymentSession; message?: string }
  | { type: "blocked" | "complete"; message: string };

const paymentSessionCreations = new Map<string, Promise<PaymentSessionResolution>>();

export function TenantPaymentFlow({ request }: TenantPaymentFlowProps) {
  const [session, setSession] = useState<StoredPaymentSession | null>(null);
  const [notice, setNotice] = useState<string>();
  const [phase, setPhase] = useState<"loading" | "ready" | "blocked" | "complete">("loading");
  const [now, setNow] = useState(() => Date.now());
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    startTransition(async () => {
      const nextState = await resolvePaymentSession(request);

      if (isCancelled) {
        return;
      }

      if (nextState.type === "ready") {
        setSession(nextState.session);
        setNotice(nextState.message);
        setPhase("ready");
        if (nextState.message) {
          toast.success(nextState.message);
        }
        return;
      }

      setSession(null);
      setNotice(nextState.message);
      setPhase(nextState.type);
    });

    return () => {
      isCancelled = true;
    };
  }, [request]);

  const expireLocalPaymentWindow = useCallback(() => {
    clearStoredPaymentSession(request.id);
    setSession(null);
    setNotice(
      "The 10-minute payment window has ended. This request can be rejected by the landlord due to incomplete payment. If it is rejected, submit a new rental request.",
    );
    setPhase("blocked");
    toast.warning(
      "Payment window expired. If the landlord rejects this request, submit a new rental request.",
    );
    router.push(appRoutes.tenantPayments);
    router.refresh();
  }, [request.id, router]);

  useEffect(() => {
    if (phase === "ready" && session && isPaymentWindowExpired(session)) {
      const timeoutId = window.setTimeout(expireLocalPaymentWindow, 0);

      return () => window.clearTimeout(timeoutId);
    }

    return undefined;
  }, [expireLocalPaymentWindow, now, phase, session]);

  if (request.status !== "APPROVED") {
    return (
      <Alert>
        <AlertTitle>Payment is not available</AlertTitle>
        <AlertDescription>Only approved rental requests can proceed to payment.</AlertDescription>
      </Alert>
    );
  }

  if (phase === "loading" || isPending) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border bg-secondary/40 p-4">
          <p className="text-sm text-muted-foreground">Preparing payment</p>
          <p className="mt-2 font-medium">Loading your current Stripe session...</p>
        </div>
      </div>
    );
  }

  if (phase === "complete") {
    return (
      <Alert>
        <AlertTitle>Payment already completed</AlertTitle>
        <AlertDescription>This rental request is already paid and active.</AlertDescription>
      </Alert>
    );
  }

  if (phase === "blocked" || !session) {
    return (
      <Alert className="border-destructive/40 bg-destructive/10 text-destructive">
        <AlertTriangle className="size-4" aria-hidden="true" />
        <AlertTitle>Payment could not continue</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>{notice ?? "Payment is unavailable for this rental request right now."}</p>
          <Button asChild variant="outline" size="sm" className="border-destructive/30 bg-background text-foreground hover:bg-background/80">
            <Link href={appRoutes.tenantPayments}>Back to payment history</Link>
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const deadline = new Date(new Date(session.createdAt).getTime() + PAYMENT_WINDOW_MS);
  const timeRemaining = Math.max(deadline.getTime() - now, 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Amount due</CardDescription>
            <CardTitle>{formatCurrency(session.amount)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Payment window</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Clock3 className="size-4 text-primary" aria-hidden="true" />
              {formatTimeRemaining(timeRemaining)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {notice ? (
        <Alert>
          <RefreshCcw className="size-4" aria-hidden="true" />
          <AlertTitle>Payment note</AlertTitle>
          <AlertDescription>{notice}</AlertDescription>
        </Alert>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="size-5 text-primary" aria-hidden="true" />
            Complete payment
          </CardTitle>
          <CardDescription>
            Pay securely for {request.property?.title ?? "your approved rental request"}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-secondary/40 p-4">
            <p className="text-sm text-muted-foreground">Current request status</p>
            <p className="mt-1 font-medium">{request.status}</p>
          </div>

          <StripePaymentForm
            clientSecret={session.clientSecret}
            paymentId={session.paymentId}
            transactionId={session.transactionId}
            amount={session.amount}
            onAttemptFailed={(message) => {
              setNotice(
                `${message} You can try again while this 10-minute payment window is still active.`,
              );
              toast.error(message);
            }}
            onPaymentSucceeded={() => {
              clearStoredPaymentSession(request.id);
            }}
          />

          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href={appRoutes.tenantPayments}>Back to payments</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href={appRoutes.tenantRequests}>View requests</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

async function resolvePaymentSession(request: RentalRequest) {
  if (request.payment?.status === "COMPLETED" || request.status === "ACTIVE") {
    clearStoredPaymentSession(request.id);
    return {
      type: "complete" as const,
      message: "Payment already completed.",
    };
  }

  if (request.status !== "APPROVED") {
    clearStoredPaymentSession(request.id);
    return {
      type: "blocked" as const,
      message: "Only approved rental requests can proceed to payment.",
    };
  }

  const storedSession = readStoredPaymentSession(request.id);

  if (storedSession) {
    if (isPaymentWindowExpired(storedSession)) {
      clearStoredPaymentSession(request.id);
      return {
        type: "blocked" as const,
        message:
          "The 10-minute payment window has ended. This request can be rejected by the landlord due to incomplete payment. If it is rejected, submit a new rental request.",
      };
    }

    if (!request.payment || request.payment.id === storedSession.paymentId) {
      return {
        type: "ready" as const,
        session: storedSession,
      };
    }
  }

  if (request.payment?.status === "PENDING") {
    return {
      type: "blocked" as const,
      message:
        "A payment was already started for this request. If payment was not completed, the landlord can reject it due to incomplete payment so the property becomes available again.",
    };
  }

  return await startOrReusePaymentSession(request);
}

async function startOrReusePaymentSession(request: RentalRequest) {
  const existingCreation = paymentSessionCreations.get(request.id);
  if (existingCreation) {
    return await existingCreation;
  }

  const creation = createStoredPaymentSession(request).finally(() => {
    paymentSessionCreations.delete(request.id);
  });

  paymentSessionCreations.set(request.id, creation);
  return await creation;
}

async function createStoredPaymentSession(request: RentalRequest) {
  const paymentResult = await startPaymentIntentAction(request.id);

  if (!paymentResult.success || !paymentResult.data) {
    return {
      type: "blocked" as const,
      message: paymentResult.message,
    };
  }

  const createdSession: StoredPaymentSession = {
    ...paymentResult.data,
    requestId: request.id,
    createdAt: new Date().toISOString(),
  };

  persistPaymentSession(createdSession);

  return {
    type: "ready" as const,
    session: createdSession,
    message: "Payment session started. You have 10 minutes to complete it.",
  };
}

function getStorageKey(requestId: string) {
  return `rentnest:payment-session:${requestId}`;
}

function readStoredPaymentSession(requestId: string) {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(getStorageKey(requestId));

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as StoredPaymentSession;
  } catch {
    window.localStorage.removeItem(getStorageKey(requestId));
    return null;
  }
}

function persistPaymentSession(session: StoredPaymentSession) {
  window.localStorage.setItem(getStorageKey(session.requestId), JSON.stringify(session));
}

function clearStoredPaymentSession(requestId: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getStorageKey(requestId));
}

function isPaymentWindowExpired(session: StoredPaymentSession) {
  return new Date(session.createdAt).getTime() + PAYMENT_WINDOW_MS <= Date.now();
}

function formatTimeRemaining(milliseconds: number) {
  if (milliseconds <= 0) {
    return "Expired";
  }

  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
