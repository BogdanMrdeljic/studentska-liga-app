import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getActiveSeason } from "@/lib/standings";
import { TeamLogo } from "@/components/teams/team-logo";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const categories = [
  { key: "poeni", label: "Poeni", field: "points" },
  { key: "trojke", label: "Trojke", field: "threePointers" },
  { key: "faulovi", label: "Faulovi", field: "fouls" },
] as const;

type CategoryKey = (typeof categories)[number]["key"];

function isCategoryKey(value: string | undefined): value is CategoryKey {
  return categories.some((c) => c.key === value);
}

export default async function StatistikaPage({
  searchParams,
}: {
  searchParams: Promise<{ sezona?: string; kategorija?: string; mod?: string }>;
}) {
  const { sezona, kategorija, mod } = await searchParams;
  const [seasons, activeSeason] = await Promise.all([
    prisma.season.findMany({
      where: { matches: { some: { playerStats: { some: {} } } } },
      orderBy: { name: "desc" },
    }),
    getActiveSeason(),
  ]);
  const season = sezona ? (seasons.find((s) => s.id === sezona) ?? activeSeason) : activeSeason;

  const categoryKey: CategoryKey = isCategoryKey(kategorija) ? kategorija : "poeni";
  const category = categories.find((c) => c.key === categoryKey)!;
  const isAverage = mod === "prosek";

  const grouped = season
    ? await prisma.matchPlayerStat.groupBy({
        by: ["playerId"],
        where: { match: { seasonId: season.id } },
        _sum: { points: true, threePointers: true, fouls: true },
        _count: { _all: true },
      })
    : [];

  const players =
    grouped.length > 0
      ? await prisma.player.findMany({
          where: { id: { in: grouped.map((g) => g.playerId) } },
          include: { team: true },
        })
      : [];
  const playerById = new Map(players.map((p) => [p.id, p]));

  const rows = grouped
    .map((g) => {
      const player = playerById.get(g.playerId);
      if (!player) return null;
      const totals = {
        points: g._sum.points ?? 0,
        threePointers: g._sum.threePointers ?? 0,
        fouls: g._sum.fouls ?? 0,
      };
      const appearances = g._count._all;
      const total = totals[category.field];
      const value = isAverage ? total / appearances : total;
      return {
        playerId: g.playerId,
        playerName: player.name,
        teamId: player.team.id,
        teamName: player.team.name,
        teamLogoUrl: player.team.logoUrl,
        colorPrimary: player.team.colorPrimary,
        colorSecondary: player.team.colorSecondary,
        appearances,
        value,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null)
    .sort((a, b) => b.value - a.value)
    .slice(0, 20);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="flex items-center gap-3 font-heading text-3xl font-bold uppercase tracking-wide">
        <span className="kicker" aria-hidden />
        Statistika
      </h1>

      {seasons.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {seasons.map((s) => (
            <Link
              key={s.id}
              href={`/statistika?sezona=${s.id}&kategorija=${categoryKey}&mod=${isAverage ? "prosek" : "ukupno"}`}
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

      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <Link
            key={c.key}
            href={`/statistika?sezona=${season?.id ?? ""}&kategorija=${c.key}&mod=${isAverage ? "prosek" : "ukupno"}`}
            className={cn(
              "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
              categoryKey === c.key
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {c.label}
          </Link>
        ))}
      </div>

      <div className="mt-4 inline-flex rounded-full border p-1">
        <Link
          href={`/statistika?sezona=${season?.id ?? ""}&kategorija=${categoryKey}&mod=ukupno`}
          className={cn(
            "rounded-full px-3 py-1 text-sm font-medium transition-colors",
            !isAverage ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          )}
        >
          Ukupno
        </Link>
        <Link
          href={`/statistika?sezona=${season?.id ?? ""}&kategorija=${categoryKey}&mod=prosek`}
          className={cn(
            "rounded-full px-3 py-1 text-sm font-medium transition-colors",
            isAverage ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          )}
        >
          Po utakmici
        </Link>
      </div>

      <p className="mt-4 text-muted-foreground">Sezona: {season?.name ?? "Nema sezona"}</p>

      <div className="mt-4">
        {rows.length === 0 ? (
          <p className="text-muted-foreground">Nema podataka o statistici.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/60 hover:bg-muted/60">
                  <TableHead className="w-10 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    #
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Igrač
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Ekipa
                  </TableHead>
                  <TableHead className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Nastupi
                  </TableHead>
                  <TableHead className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {category.label}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={row.playerId}>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex size-6 items-center justify-center rounded-full text-xs font-bold tabular-nums",
                          index === 0
                            ? "bg-accent text-accent-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {index + 1}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link href={`/igraci/${row.playerId}`} className="font-medium hover:underline">
                        {row.playerName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/ekipe/${row.teamId}`}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:underline"
                      >
                        <TeamLogo
                          logoUrl={row.teamLogoUrl}
                          name={row.teamName}
                          colorPrimary={row.colorPrimary}
                          colorSecondary={row.colorSecondary}
                          size={20}
                        />
                        {row.teamName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center tabular-nums">{row.appearances}</TableCell>
                    <TableCell className="text-center text-lg font-bold tabular-nums text-primary">
                      {isAverage ? row.value.toFixed(1) : row.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
