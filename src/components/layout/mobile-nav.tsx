"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/actions/auth";

type NavLink = { href: string; label: string };

export function MobileNav({
  links,
  isAdmin,
  userName,
}: {
  links: NavLink[];
  isAdmin: boolean;
  userName: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Meni"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {open && (
        <div className="absolute inset-x-0 top-16 z-50 animate-in fade-in slide-in-from-top-2 border-b bg-background shadow-lg duration-150">
          <nav className="mx-auto flex max-w-6xl flex-col gap-0.5 p-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md border-l-2 border-transparent px-3 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="rounded-md border-l-2 border-transparent px-3 py-2.5 text-sm font-semibold text-accent-foreground transition-colors hover:border-accent hover:bg-muted"
              >
                Admin
              </Link>
            )}
            <div className="my-1 border-t" />
            {userName ? (
              <>
                <div className="px-3 py-2 text-sm text-muted-foreground">{userName}</div>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    signOutAction();
                  }}
                  className="rounded-md px-3 py-2.5 text-left text-sm font-medium hover:bg-muted"
                >
                  Odjava
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/prijava"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  Prijava
                </Link>
                <Link
                  href="/registracija"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  Registracija
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
