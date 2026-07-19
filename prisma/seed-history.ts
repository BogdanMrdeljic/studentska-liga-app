import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Final tabela sezone 2025/26, uneta ručno jer nemamo evidenciju utakmica
// iz te sezone (samo krajnji plasman). ATUSS je diskvalifikovan pre kraja
// sezone, otud i njihove 2 neodigrane utakmice iz raspoređa.
const standings = [
  { position: 1, team: "FON", played: 4, won: 4, lost: 0, pointDiff: 38, points: 8 },
  { position: 2, team: "ETF", played: 4, won: 3, lost: 1, pointDiff: 98, points: 7 },
  { position: 3, team: "EKOF", played: 4, won: 3, lost: 1, pointDiff: 67, points: 7 },
  { position: 4, team: "MASINAC", played: 4, won: 3, lost: 1, pointDiff: 25, points: 7 },
  { position: 5, team: "SAOB", played: 4, won: 3, lost: 1, pointDiff: 16, points: 7 },
  { position: 6, team: "PRAVNI", played: 4, won: 3, lost: 1, pointDiff: 14, points: 7 },
  { position: 7, team: "MATF", played: 4, won: 3, lost: 1, pointDiff: 5, points: 7 },
  { position: 8, team: "MED", played: 4, won: 3, lost: 1, pointDiff: 1, points: 7 },
  { position: 9, team: "DIF", played: 4, won: 2, lost: 2, pointDiff: 29, points: 6 },
  { position: 10, team: "STOMATOLOGIJA", played: 4, won: 2, lost: 2, pointDiff: 13, points: 6 },
  { position: 11, team: "BOGOSLOVIJA", played: 4, won: 1, lost: 3, pointDiff: -32, points: 5 },
  { position: 12, team: "GRADJ", played: 4, won: 1, lost: 3, pointDiff: -50, points: 5 },
  { position: 13, team: "ARHITEKTURA", played: 4, won: 0, lost: 4, pointDiff: -49, points: 4 },
  { position: 14, team: "RAF", played: 4, won: 0, lost: 4, pointDiff: -96, points: 3 },
  { position: 15, team: "TMF", played: 4, won: 0, lost: 4, pointDiff: -69, points: 2 },
  {
    position: 16,
    team: "ATUSS",
    played: 4,
    won: 0,
    lost: 4,
    pointDiff: -20,
    points: 0,
    note: "Ekipa odustala",
  },
] as const;

async function main() {
  const season = await prisma.season.upsert({
    where: { name: "2025/26" },
    update: {},
    create: { name: "2025/26", isActive: false },
  });

  for (const row of standings) {
    const team = await prisma.team.upsert({
      where: { name: row.team },
      update: {},
      create: { name: row.team, city: "Beograd" },
    });

    const note = "note" in row ? row.note : null;

    await prisma.seasonStanding.upsert({
      where: { seasonId_teamId: { seasonId: season.id, teamId: team.id } },
      update: {
        position: row.position,
        played: row.played,
        won: row.won,
        lost: row.lost,
        pointDiff: row.pointDiff,
        points: row.points,
        note,
      },
      create: {
        seasonId: season.id,
        teamId: team.id,
        position: row.position,
        played: row.played,
        won: row.won,
        lost: row.lost,
        pointDiff: row.pointDiff,
        points: row.points,
        note,
      },
    });
  }

  console.log("Istorijska tabela (2025/26) uneta.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
