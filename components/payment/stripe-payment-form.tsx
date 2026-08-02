"use client";

import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CreditCard, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { appRoutes } from "@/config/routes";
import { confirmPaymentAction } from "@/lib/api/payment-actions";
import { formatCurrency } from "@/lib/formatters/currency";

type StripePaymentFormProps = {
  clientSecret: string;
  paymentId: string;
  transactionId: string;
  amount: number;
  onAttemptFailed?: (message: string) => void | Promise<void>;
  onPaymentSucceeded?: () => void;
};

let stripePromiseCache: ReturnType<typeof loadStripe> | null = null;
let stripePromiseKey: string | null = null;

export function StripePaymentForm(props: StripePaymentFormProps) {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const stripePromise = getStripePromise(publishableKey);

  if (!stripePromise) {
    return (
      <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        Stripe publishable key is missing. Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to `.env.local`.
      </p>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret: props.clientSecret }}>
      <CheckoutForm {...props} />
    </Elements>
  );
}

function CheckoutForm({
  paymentId,
  transactionId,
  amount,
  onAttemptFailed,
  onPaymentSucceeded,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitPayment() {
    if (!stripe || !elements) {
      return;
    }

    setIsSubmitting(true);
    const stripeResult = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}${appRoutes.paymentSuccess}?paymentId=${paymentId}`,
      },
      redirect: "if_required",
    });

    if (stripeResult.error) {
      setIsSubmitting(false);
      const message = stripeResult.error.message ?? "Stripe could not confirm the payment.";
      if (onAttemptFailed) {
        await onAttemptFailed(message);
      } else {
        toast.error(message);
      }
      return;
    }

    const result = await confirmPaymentAction(paymentId, transactionId);
    setIsSubmitting(false);

    if (!result.success) {
      if (onAttemptFailed) {
        await onAttemptFailed(result.message);
      } else {
        toast.error(result.message);
      }
      return;
    }

    onPaymentSucceeded?.();
    toast.success(result.message);
    router.push(`${appRoutes.paymentSuccess}?paymentId=${paymentId}`);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg border bg-secondary/40 p-4">
        <p className="text-sm text-muted-foreground">Amount due</p>
        <p className="text-3xl font-semibold tracking-normal">{formatCurrency(amount)}</p>
      </div>
      <PaymentElement />
      <Button type="button" className="w-full" onClick={submitPayment} disabled={!stripe || isSubmitting}>
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <CreditCard className="size-4" />}
        Pay securely
      </Button>
    </div>
  );
}

function getStripePromise(publishableKey: string | undefined) {
  if (!publishableKey) {
    return null;
  }

  if (!stripePromiseCache || stripePromiseKey !== publishableKey) {
    stripePromiseCache = loadStripe(publishableKey);
    stripePromiseKey = publishableKey;
  }

  return stripePromiseCache;
}
