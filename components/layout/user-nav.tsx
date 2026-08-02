"use client";

import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Building2,
  ChevronDown,
  CircleDollarSign,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquareDot,
  RotateCcwClock,
  Star,
  Tags,
  UserCircle2,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { appRoutes, roleDashboardLinks } from "@/config/routes";
import { logoutAction } from "@/lib/auth/actions";
import { cn } from "@/lib/utils/cn";
import type { AuthUser } from "@/lib/auth/types";

type UserNavProps = {
  user: AuthUser;
};

export function UserNav({ user }: UserNavProps) {
  const initials = getInitials(user.name);
  const quickLinks = [
    { href: appRoutes.profile, label: "Profile" },
    ...roleDashboardLinks[user.role],
  ];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" className="gap-3 rounded-full px-2">
          <Avatar.Root className="flex size-9 items-center justify-center overflow-hidden rounded-full border bg-secondary text-sm font-semibold">
            <Avatar.Fallback>{initials}</Avatar.Fallback>
          </Avatar.Root>
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-medium leading-none">
              {user.name}
            </span>
            <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {user.role}
            </span>
          </span>
          <ChevronDown
            className="size-4 text-muted-foreground"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={10}
          className="z-50 min-w-64 rounded-lg border bg-popover p-2 text-popover-foreground shadow-lg"
        >
          <div className="px-3 py-2">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          <div className="my-2 h-px bg-border" />

          <DropdownMenu.Item asChild>
            <Link href={appRoutes.home} className={menuItemClassName}>
              <Home className="size-4" aria-hidden="true" />
              Home
            </Link>
          </DropdownMenu.Item>

          {quickLinks.map((link) => {
            const Icon = getMenuItemIcon(link.label);

            return (
              <DropdownMenu.Item key={link.href} asChild>
                <Link href={link.href} className={menuItemClassName}>
                  <Icon className="size-4" aria-hidden="true" />
                  {link.label}
                </Link>
              </DropdownMenu.Item>
            );
          })}

          <div className="my-2 h-px bg-border" />

          <form action={logoutAction}>
            <button
              type="submit"
              className={cn(
                menuItemClassName,
                "w-full text-left text-destructive",
              )}
            >
              <LogOut className="size-4" aria-hidden="true" />
              Logout
            </button>
          </form>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

const menuItemClassName =
  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm outline-none transition-colors hover:bg-secondary focus:bg-secondary";

function getInitials(name: string) {
  const letters = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return letters || "RN";
}

function getMenuItemIcon(label: string): LucideIcon {
  const iconByLabel: Record<string, LucideIcon> = {
    Overview: LayoutDashboard,
    Profile: UserCircle2,
    "Rental requests": RotateCcwClock,
    "Payment history": CircleDollarSign,
    Reviews: Star,
    "My properties": Building2,
    Requests: MessageSquareDot,
    "Tenant history": RotateCcwClock,
    Users,
    Properties: Building2,
    Categories: Tags,
  };

  return iconByLabel[label] ?? LayoutDashboard;
}
