import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const FORFEIT_VENUE = "Službeni rezultat (forfe)";

// Utakmice sezone 2024/25, prepisane iz Google Sheets dokumenta (tabovi
// "1. KOLO" - "4. KOLO"). Gde je u dokumentu pisalo službeni rezultat 5:0
// (forfe), ovde je upisano 20:0 po dogovoru.
// Napomena: ATUSS u finalnoj tabeli ima 4 odigrane utakmice, ali u
// dokumentu su pronađena samo 2 njihova rezultata — ostale 2 nisu
// evidentirane u tabovima kola, pa nisu ni ovde.
const matches = [
  { home: "ETF", away: "FON", homeScore: 48, awayScore: 50, date: "2025-05-23T17:00:00", venue: "Enfild" },
  { home: "SAOB", away: "EKOF", homeScore: 29, awayScore: 66, date: "2025-05-25T18:00:00", venue: "Enfild" },
  { home: "BOGOSLOVIJA", away: "RAF", homeScore: 52, awayScore: 41, date: "2025-06-01T22:00:00", venue: "Enfild" },
  { home: "ARHITEKTURA", away: "MATF", homeScore: 37, awayScore: 47, date: "2025-06-06T22:00:00", venue: "SC Mirko Sandić" },
  { home: "MASINAC", away: "MED", homeScore: 52, awayScore: 38, date: "2025-06-01T17:00:00", venue: "Enfild" },
  { home: "GRADJ", away: "PRAVNI", homeScore: 41, awayScore: 46, date: "2025-05-28T19:45:00", venue: "KL centar" },
  { home: "TMF", away: "STOMATOLOGIJA", homeScore: 40, awayScore: 59, date: "2025-06-03T18:00:00", venue: "Enfild" },
  { home: "DIF", away: "RAF", homeScore: 84, awayScore: 34, date: "2025-06-09T20:30:00", venue: "balon Corn" },

  { home: "ETF", away: "GRADJ", homeScore: 63, awayScore: 30, date: "2025-05-27T17:00:00", venue: "Enfild" },
  { home: "FON", away: "PRAVNI", homeScore: 66, awayScore: 52, date: "2025-05-27T14:00:00", venue: "SD 4. april" },
  { home: "DIF", away: "BOGOSLOVIJA", homeScore: 63, awayScore: 59, date: "2025-05-31T15:00:00", venue: "Enfild" },
  { home: "EKOF", away: "MED", homeScore: 39, awayScore: 44, date: "2025-05-29T18:00:00", venue: "Enfild" },
  { home: "SAOB", away: "MASINAC", homeScore: 55, awayScore: 47, date: "2025-05-28T18:00:00", venue: "Enfild" },
  { home: "ARHITEKTURA", away: "STOMATOLOGIJA", homeScore: 45, awayScore: 50, date: "2025-05-31T21:00:00", venue: "SC Mirko Sandić" },
  { home: "MATF", away: "TMF", homeScore: 20, awayScore: 0, date: "2025-05-31T12:00:00", venue: FORFEIT_VENUE },

  { home: "FON", away: "ARHITEKTURA", homeScore: 63, awayScore: 48, date: "2025-06-03T15:00:00", venue: "SD 4. april" },
  { home: "MATF", away: "ETF", homeScore: 41, awayScore: 68, date: "2025-06-05T19:00:00", venue: "hala David Kalinić" },
  { home: "SAOB", away: "DIF", homeScore: 74, awayScore: 58, date: "2025-06-06T17:00:00", venue: "Enfild" },
  { home: "EKOF", away: "ATUSS", homeScore: 20, awayScore: 0, date: "2025-06-06T12:00:00", venue: FORFEIT_VENUE },
  { home: "PRAVNI", away: "STOMATOLOGIJA", homeScore: 51, awayScore: 47, date: "2025-06-05T22:00:00", venue: "balon Sava" },
  { home: "GRADJ", away: "TMF", homeScore: 20, awayScore: 0, date: "2025-06-05T12:00:00", venue: FORFEIT_VENUE },
  { home: "MASINAC", away: "BOGOSLOVIJA", homeScore: 52, awayScore: 42, date: "2025-06-06T15:00:00", venue: "Enfild" },
  { home: "MED", away: "RAF", homeScore: 20, awayScore: 0, date: "2025-06-06T12:00:00", venue: FORFEIT_VENUE },

  { home: "BOGOSLOVIJA", away: "SAOB", homeScore: 42, awayScore: 71, date: "2025-06-05T16:00:00", venue: "Enfild" },
  { home: "TMF", away: "ETF", homeScore: 40, awayScore: 80, date: "2025-06-02T17:00:00", venue: "Enfild" },
  { home: "MASINAC", away: "DIF", homeScore: 55, awayScore: 46, date: "2025-06-04T18:00:00", venue: "Enfild" },
  { home: "ATUSS", away: "MED", homeScore: 0, awayScore: 20, date: "2025-06-07T12:00:00", venue: FORFEIT_VENUE },
  { home: "RAF", away: "EKOF", homeScore: 32, awayScore: 62, date: "2025-06-04T18:00:00", venue: "Star Welness" },
  { home: "STOMATOLOGIJA", away: "FON", homeScore: 40, awayScore: 47, date: "2025-06-08T18:00:00", venue: "Enfild" },
  { home: "PRAVNI", away: "ARHITEKTURA", homeScore: 69, awayScore: 50, date: "2025-06-09T18:30:00", venue: "balon Sava" },
  { home: "GRADJ", away: "MATF", homeScore: 40, awayScore: 57, date: "2025-06-10T18:00:00", venue: "Enfild" },
] as const;

async function main() {
  const season = await prisma.season.findUnique({ where: { name: "2024/25" } });
  if (!season) throw new Error("Sezona 2024/25 ne postoji. Prvo pokreni seed-history.ts.");

  const existing = await prisma.match.count({ where: { seasonId: season.id } });
  if (existing > 0) {
    console.log(`Sezona 2024/25 već ima ${existing} utakmica, preskačem.`);
    return;
  }

  const teams = await prisma.team.findMany();
  const teamIdByName = new Map(teams.map((t) => [t.name, t.id]));

  for (const m of matches) {
    const homeTeamId = teamIdByName.get(m.home);
    const awayTeamId = teamIdByName.get(m.away);
    if (!homeTeamId || !awayTeamId) {
      throw new Error(`Nepoznat tim: ${m.home} ili ${m.away}`);
    }

    await prisma.match.create({
      data: {
        seasonId: season.id,
        homeTeamId,
        awayTeamId,
        date: new Date(m.date),
        venue: m.venue,
        status: "FINISHED",
        homeScore: m.homeScore,
        awayScore: m.awayScore,
      },
    });
  }

  console.log(`Uneto ${matches.length} utakmica za sezonu 2024/25.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
