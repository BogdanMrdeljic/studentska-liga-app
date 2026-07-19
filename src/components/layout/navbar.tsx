import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";

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
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
            <Image
              src="/logo.png"
              alt="Studentska Košarkaška Liga"
              fill
              sizes="40px"
              className="object-cover object-top"
              priority
            />
          </div>
          <span className="font-heading text-lg font-bold uppercase tracking-wide">
            Studentska Košarkaška Liga
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
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

        <div className="flex items-center gap-2">
          {session?.user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {session.user.name}
              </span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button type="submit" variant="outline" size="sm">
                  Odjava
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/prijava" />}>
                Prijava
              </Button>
              <Button size="sm" nativeButton={false} render={<Link href="/registracija" />}>
                Registracija
              </Button>
            </>
          )}
          <MobileNav links={navLinks} isAdmin={isAdmin} />
        </div>
      </div>
    </header>
  );
}
