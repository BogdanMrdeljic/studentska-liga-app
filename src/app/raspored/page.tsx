import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getActiveSeason, getAllSeasons } from "@/lib/standings";
import { MatchCard } from "@/components/matches/match-card";
import { cn } from "@/lib/utils";

export default async function RasporedPage({
  searchParams,
}: {
  searchParams: Promise<{ sezona?: string }>;
}) {
  const { sezona } = await searchParams;
  const [seasons, activeSeason] = await Promise.all([getAllSeasons(), getActiveSeason()]);
  const season = sezona ? (seasons.find((s) => s.id === sezona) ?? activeSeason) : activeSeason;

  const matches = season
    ? await prisma.match.findMany({
        where: { seasonId: season.id },
        orderBy: { date: "asc" },
        include: { homeTeam: true, awayTeam: true },
      })
    : [];

  const now = new Date();
  const upcoming = matches.filter((m) => m.status !== "FINISHED" && m.date >= now);
  const past = matches.filter((m) => m.status === "FINISHED" || m.date < now);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-heading text-3xl font-bold uppercase tracking-wide">
        Raspored utakmica
      </h1>

      {seasons.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {seasons.map((s) => (
            <Link
              key={s.id}
              href={`/raspored?sezona=${s.id}`}
              className={cn(
                "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
                season?.id === s.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {s.name}
            </Link>
          ))}
        </div>
      )}

      <p className="mt-4 text-muted-foreground">
        Sezona: {season?.name ?? "Nema aktivne sezone"}
      </p>

      <section className="mt-8">
        <h2 className="mb-3 font-heading text-xl font-semibold uppercase tracking-wide text-primary">
          Predstoje
        </h2>
        {upcoming.length === 0 ? (
          <p className="text-muted-foreground">Nema zakazanih utakmica.</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 font-heading text-xl font-semibold uppercase tracking-wide text-muted-foreground">
          Odigrano
        </h2>
        {past.length === 0 ? (
          <p className="text-muted-foreground">Još nije odigrana nijedna utakmica.</p>
        ) : (
          <div className="space-y-3">
            {[...past].reverse().map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
