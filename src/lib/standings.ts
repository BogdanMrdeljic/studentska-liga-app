import { prisma } from "@/lib/prisma";

export type StandingRow = {
  teamId: string;
  teamName: string;
  logoUrl: string | null;
  colorPrimary: string;
  played: number;
  won: number;
  lost: number;
  pointsFor: number;
  pointsAgainst: number;
  pointDiff: number;
  winPct: number;
};

export async function getStandings(seasonId: string): Promise<StandingRow[]> {
  const teams = await prisma.team.findMany();

  const table = new Map<string, StandingRow>();
  for (const team of teams) {
    table.set(team.id, {
      teamId: team.id,
      teamName: team.name,
      logoUrl: team.logoUrl,
      colorPrimary: team.colorPrimary,
      played: 0,
      won: 0,
      lost: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      pointDiff: 0,
      winPct: 0,
    });
  }

  const matches = await prisma.match.findMany({
    where: { seasonId, status: "FINISHED" },
  });

  for (const match of matches) {
    if (match.homeScore === null || match.awayScore === null) continue;

    const home = table.get(match.homeTeamId);
    const away = table.get(match.awayTeamId);
    if (!home || !away) continue;

    home.played += 1;
    away.played += 1;
    home.pointsFor += match.homeScore;
    home.pointsAgainst += match.awayScore;
    away.pointsFor += match.awayScore;
    away.pointsAgainst += match.homeScore;

    if (match.homeScore > match.awayScore) {
      home.won += 1;
      away.lost += 1;
    } else if (match.homeScore < match.awayScore) {
      away.won += 1;
      home.lost += 1;
    }
  }

  const rows = Array.from(table.values()).map((row) => ({
    ...row,
    pointDiff: row.pointsFor - row.pointsAgainst,
    winPct: row.played > 0 ? row.won / row.played : 0,
  }));

  rows.sort((a, b) => {
    if (b.winPct !== a.winPct) return b.winPct - a.winPct;
    if (b.won !== a.won) return b.won - a.won;
    return b.pointDiff - a.pointDiff;
  });

  return rows;
}

export async function getActiveSeason() {
  const active = await prisma.season.findFirst({ where: { isActive: true } });
  if (active) return active;
  return prisma.season.findFirst({ orderBy: { name: "desc" } });
}
