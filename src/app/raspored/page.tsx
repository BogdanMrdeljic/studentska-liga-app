import { prisma } from "@/lib/prisma";
import { getActiveSeason } from "@/lib/standings";
import { MatchCard } from "@/components/matches/match-card";

export default async function RasporedPage() {
  const season = await getActiveSeason();

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
      <p className="mt-1 text-muted-foreground">
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
