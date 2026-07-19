"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavLink = { href: string; label: string };

export function MobileNav({ links, isAdmin }: { links: NavLink[]; isAdmin: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Meni">
            <Menu className="size-5" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-48">
        {links.map((link) => (
          <DropdownMenuItem key={link.href} render={<Link href={link.href} />}>
            {link.label}
          </DropdownMenuItem>
        ))}
        {isAdmin && (
          <DropdownMenuItem render={<Link href="/admin" />}>Admin</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
