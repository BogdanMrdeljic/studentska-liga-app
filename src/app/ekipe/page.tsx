import { prisma } from "@/lib/prisma";
import { TeamCard } from "@/components/teams/team-card";

export default async function EkipePage() {
  const teamsRaw = await prisma.team.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { players: true } } },
  });
  const teams = teamsRaw.map((t) => ({ ...t, playerCount: t._count.players }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="flex items-center gap-3 font-heading text-3xl font-bold uppercase tracking-wide">
        <span className="kicker" aria-hidden />
        Ekipe
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
}
