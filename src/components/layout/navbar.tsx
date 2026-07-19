import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLink } from "@/components/layout/nav-link";

const navLinks = [
  { href: "/raspored", label: "Raspored" },
  { href: "/tabela", label: "Tabela" },
  { href: "/ekipe", label: "Ekipe" },
  { href: "/objave", label: "Objave" },
];

export async function Navbar() {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 relative before:absolute before:inset-x-0 before:top-0 before:h-[3px] before:bg-gradient-to-r before:from-primary before:via-accent before:to-primary">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/20">
            <Image
              src="/logo.png"
              alt="Studentska Košarkaška Liga"
              fill
              sizes="40px"
              className="object-cover object-top"
              priority
            />
          </div>
          <span className="hidden truncate font-heading text-lg font-bold uppercase tracking-wide sm:inline">
            Studentska Košarkaška Liga
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-semibold text-accent-foreground underline decoration-accent decoration-2 underline-offset-4"
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {session?.user ? (
            <>
              <span className="hidden text-sm text-muted-foreground lg:inline">
                {session.user.name}
              </span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
                className="hidden md:block"
              >
                <Button type="submit" variant="outline" size="sm">
                  Odjava
                </Button>
              </form>
            </>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/prijava" />}>
                Prijava
              </Button>
              <Button size="sm" nativeButton={false} render={<Link href="/registracija" />}>
                Registracija
              </Button>
            </div>
          )}
          <MobileNav
            links={navLinks}
            isAdmin={isAdmin}
            userName={session?.user?.name ?? null}
          />
        </div>
      </div>
    </header>
  );
}
