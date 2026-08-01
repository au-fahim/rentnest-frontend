import Link from "next/link";

import { appRoutes } from "@/config/routes";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>{siteConfig.name} rental marketplace frontend.</p>
        <div className="flex gap-4">
          <Link href={appRoutes.properties} className="hover:text-foreground">
            Browse
          </Link>
          <Link href={appRoutes.login} className="hover:text-foreground">
            Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
