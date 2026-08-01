import Link from "next/link";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserNav } from "@/components/layout/user-nav";
import { Button } from "@/components/ui/button";
import { appRoutes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { getCurrentUser, getRoleDashboardPath } from "@/lib/auth/session";

const publicLinks = [
  { href: appRoutes.home, label: "Home" },
  { href: appRoutes.properties, label: "Properties" },
];

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/88 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href={appRoutes.home} className="text-xl font-semibold tracking-normal">
          {siteConfig.name}
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-6 md:flex">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <Button asChild variant="ghost" className="hidden md:inline-flex">
                <Link href={getRoleDashboardPath(user.role)}>Dashboard</Link>
              </Button>
              <UserNav user={user} />
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href={appRoutes.login}>Login</Link>
              </Button>
              <Button asChild className="hidden sm:inline-flex">
                <Link href={appRoutes.register}>Join RentNest</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
