import { prisma } from "@/lib/prisma";

export type PlayerSeasonStat = {
  appearances: number;
  points: number;
  threePointers: number;
  fouls: number;
};

// Season totals per player, computed live by summing their per-match box
// scores (MatchPlayerStat) for the season — never stored separately, so
// there's nothing to keep in sync by hand.
export async function getPlayerSeasonStats(
  seasonId: string,
  playerIds?: string[]
): Promise<Map<string, PlayerSeasonStat>> {
  const grouped = await prisma.matchPlayerStat.groupBy({
    by: ["playerId"],
    where: {
      match: { seasonId },
      ...(playerIds ? { playerId: { in: playerIds } } : {}),
    },
    _sum: { points: true, threePointers: true, fouls: true },
    _count: { _all: true },
  });

  const map = new Map<string, PlayerSeasonStat>();
  for (const g of grouped) {
    map.set(g.playerId, {
      appearances: g._count._all,
      points: g._sum.points ?? 0,
      threePointers: g._sum.threePointers ?? 0,
      fouls: g._sum.fouls ?? 0,
    });
  }
  return map;
}
