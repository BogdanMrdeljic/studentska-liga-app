import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getActiveSeason } from "@/lib/standings";
import { Button } from "@/components/ui/button";
import { MatchCard } from "@/components/matches/match-card";
import { PostCard } from "@/components/posts/post-card";

export default async function HomePage() {
  const season = await getActiveSeason();

  const upcomingMatches = season
    ? await prisma.match.findMany({
        where: { seasonId: season.id, status: "SCHEDULED" },
        orderBy: { date: "asc" },
        take: 3,
        include: { homeTeam: true, awayTeam: true },
      })
    : [];

  const latestPostsRaw = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { author: true, _count: { select: { comments: true } } },
  });
  const latestPosts = latestPostsRaw.map((p) => ({ ...p, commentCount: p._count.comments }));

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 py-16 text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="font-heading text-4xl font-bold uppercase tracking-wide sm:text-5xl">
            Studentska Košarkaška Liga
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/90">
            Raspored utakmica, tabela, statistika ekipa i igrača — sve na jednom mestu.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              variant="secondary"
              nativeButton={false}
              render={<Link href="/raspored" />}
            >
              Raspored utakmica
            </Button>
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              nativeButton={false}
              render={<Link href="/tabela" />}
            >
              Tabela lige
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold uppercase tracking-wide">
            Naredne utakmice
          </h2>
          <Link href="/raspored" className="text-sm font-medium text-primary hover:underline">
            Ceo raspored →
          </Link>
        </div>
        {upcomingMatches.length === 0 ? (
          <p className="text-muted-foreground">Trenutno nema zakazanih utakmica.</p>
        ) : (
          <div className="space-y-3">
            {upcomingMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold uppercase tracking-wide">
            Poslednje objave
          </h2>
          <Link href="/objave" className="text-sm font-medium text-primary hover:underline">
            Sve objave →
          </Link>
        </div>
        {latestPosts.length === 0 ? (
          <p className="text-muted-foreground">Još nema objava.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
