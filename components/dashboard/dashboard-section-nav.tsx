"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils/cn";

type DashboardSectionNavProps = {
  links: Array<{
    href: string;
    label: string;
  }>;
};

export function DashboardSectionNav({ links }: DashboardSectionNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard sections" className="overflow-x-auto">
      <div className="flex min-w-max gap-2 pb-1">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border bg-background text-muted-foreground hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
