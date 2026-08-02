import type { ReactNode } from "react";

import { SiteHeader } from "@/components/layout/site-header";

export default function PaymentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
    </div>
  );
}
