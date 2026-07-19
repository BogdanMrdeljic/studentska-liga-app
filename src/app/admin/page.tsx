import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const [teamCount, playerCount, matchCount, postCount] = await Promise.all([
    prisma.team.count(),
    prisma.player.count(),
    prisma.match.count(),
    prisma.post.count(),
  ]);

  const sections = [
    { href: "/admin/ekipe", label: "Ekipe", count: teamCount },
    { href: "/admin/igraci", label: "Igrači", count: playerCount },
    { href: "/admin/utakmice", label: "Utakmice", count: matchCount },
    { href: "/admin/objave", label: "Objave", count: postCount },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-heading text-3xl font-bold uppercase tracking-wide">Admin panel</h1>
      <p className="mt-1 text-muted-foreground">Upravljaj ekipama, igračima, utakmicama i objavama.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="font-heading uppercase tracking-wide">
                  {section.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-heading text-3xl font-bold text-primary">{section.count}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
