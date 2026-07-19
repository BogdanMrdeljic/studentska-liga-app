import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getActiveSeason } from "@/lib/standings";
import { RosterTable } from "@/components/teams/roster-table";
import { MatchCard } from "@/components/matches/match-card";

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const season = await getActiveSeason();

  const team = await prisma.team.findUnique({
    where: { id },
    include: {
      players: {
        orderBy: { number: "asc" },
        include: { stats: { where: season ? { seasonId: season.id } : undefined } },
      },
    },
  });

  if (!team) notFound();

  const matches = await prisma.match.findMany({
    where: {
      seasonId: season?.id,
      OR: [{ homeTeamId: id }, { awayTeamId: id }],
    },
    orderBy: { date: "asc" },
    include: { homeTeam: true, awayTeam: true },
  });

  return (
    <div>
      <div
        className="py-10 text-center"
        style={{ backgroundColor: team.colorPrimary, color: team.colorSecondary }}
      >
        <h1 className="font-heading text-3xl font-bold uppercase tracking-wide">{team.name}</h1>
        <p className="mt-1 opacity-90">{team.city ?? "Nepoznat grad"}</p>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10">
        <h2 className="mb-3 font-heading text-xl font-semibold uppercase tracking-wide">
          Rošter i statistika
        </h2>
        {team.players.length === 0 ? (
          <p className="text-muted-foreground">Nema registrovanih igrača.</p>
        ) : (
          <RosterTable players={team.players} />
        )}

        <h2 className="mb-3 mt-10 font-heading text-xl font-semibold uppercase tracking-wide">
          Utakmice
        </h2>
        {matches.length === 0 ? (
          <p className="text-muted-foreground">Nema zakazanih ili odigranih utakmica.</p>
        ) : (
          <div className="space-y-3">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
