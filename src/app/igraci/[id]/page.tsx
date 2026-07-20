import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getActiveSeason } from "@/lib/standings";
import { getPlayerSeasonStats } from "@/lib/player-stats";
import { Card, CardContent } from "@/components/ui/card";
import { TeamLogo } from "@/components/teams/team-logo";

export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const season = await getActiveSeason();

  const [player, statsMap] = await Promise.all([
    prisma.player.findUnique({ where: { id }, include: { team: true } }),
    season ? getPlayerSeasonStats(season.id, [id]) : Promise.resolve(new Map()),
  ]);

  if (!player) notFound();

  const stat = statsMap.get(id);

  const statItems = [
    { label: "Nastupi", value: stat?.appearances ?? 0 },
    { label: "Poeni", value: stat?.points ?? 0 },
    { label: "Trojke", value: stat?.threePointers ?? 0 },
    { label: "Faulovi", value: stat?.fouls ?? 0 },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center gap-4">
        <div
          className="flex size-16 shrink-0 items-center justify-center rounded-full font-heading text-2xl font-bold"
          style={{ backgroundColor: player.team.colorPrimary, color: player.team.colorSecondary }}
        >
          {player.number ?? player.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-wide">
            {player.name}
          </h1>
          <p className="flex items-center gap-1.5 text-muted-foreground">
            {player.position ?? "Pozicija nepoznata"} ·{" "}
            <Link
              href={`/ekipe/${player.team.id}`}
              className="inline-flex items-center gap-1.5 text-primary hover:underline"
            >
              <TeamLogo
                logoUrl={player.team.logoUrl}
                name={player.team.name}
                colorPrimary={player.team.colorPrimary}
                colorSecondary={player.team.colorSecondary}
                size={20}
              />
              {player.team.name}
            </Link>
          </p>
          {player.indexNumber && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              Broj indeksa: <span className="font-medium text-foreground">{player.indexNumber}</span>
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statItems.map((item) => (
          <Card key={item.label}>
            <CardContent className="pt-6 text-center">
              <p className="font-heading text-3xl font-bold text-primary">{item.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                {item.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
