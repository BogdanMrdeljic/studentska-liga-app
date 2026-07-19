import { prisma } from "@/lib/prisma";

export type StandingRow = {
  teamId: string;
  teamName: string;
  colorPrimary: string;
  played: number;
  won: number;
  lost: number;
  pointDiff: number;
  points: number;
  note: string | null;
};

// Live table for the active season, computed from finished matches.
// Win = 2 points, loss = 1 point, matching the league's scoring convention.
export async function getStandings(seasonId: string): Promise<StandingRow[]> {
  const teams = await prisma.team.findMany();

  const table = new Map<string, StandingRow & { pointsFor: number; pointsAgainst: number }>();
  for (const team of teams) {
    table.set(team.id, {
      teamId: team.id,
      teamName: team.name,
      colorPrimary: team.colorPrimary,
      played: 0,
      won: 0,
      lost: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      pointDiff: 0,
      points: 0,
      note: null,
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
    teamId: row.teamId,
    teamName: row.teamName,
    colorPrimary: row.colorPrimary,
    played: row.played,
    won: row.won,
    lost: row.lost,
    pointDiff: row.pointsFor - row.pointsAgainst,
    points: row.won * 2 + row.lost * 1,
    note: null,
  }));

  rows.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.pointDiff - a.pointDiff;
  });

  return rows;
}

// Standings for any season: uses the archived final table if one was entered
// (past seasons, where we only have the end result, not match history),
// otherwise falls back to computing it live from matches (active season).
export async function getSeasonStandings(seasonId: string): Promise<StandingRow[]> {
  const archived = await prisma.seasonStanding.findMany({
    where: { seasonId },
    include: { team: true },
    orderBy: { position: "asc" },
  });

  if (archived.length > 0) {
    return archived.map((row) => ({
      teamId: row.teamId,
      teamName: row.team.name,
      colorPrimary: row.team.colorPrimary,
      played: row.played,
      won: row.won,
      lost: row.lost,
      pointDiff: row.pointDiff,
      points: row.points,
      note: row.note,
    }));
  }

  return getStandings(seasonId);
}

export async function getActiveSeason() {
  const active = await prisma.season.findFirst({ where: { isActive: true } });
  if (active) return active;
  return prisma.season.findFirst({ orderBy: { name: "desc" } });
}

export async function getAllSeasons() {
  return prisma.season.findMany({ orderBy: { name: "desc" } });
}
