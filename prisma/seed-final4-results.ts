import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SEASON_NAME = "2025/26";
const VENUE = 'Hala "David Kalinić"';
const POST_TITLE = "FON – šampion Studentske lige 2025/26!";

const games = [
  { home: "ETF", away: "PRAVNI", homeScore: 62, awayScore: 57, date: "2026-06-13T13:00:00" },
  { home: "FON", away: "MASINAC", homeScore: 95, awayScore: 85, date: "2026-06-13T14:30:00" },
  { home: "MASINAC", away: "PRAVNI", homeScore: 76, awayScore: 71, date: "2026-06-13T16:45:00" },
  { home: "FON", away: "ETF", homeScore: 79, awayScore: 68, date: "2026-06-13T18:15:00" },
] as const;

const POST_CONTENT = `Odigran je Final 4 turnir Studentske lige i imamo šampiona!

Polufinale:
ETF - Pravni fakultet 62:57
FON - Mašinski fakultet 95:85

Meč za treće mesto:
Mašinski fakultet - Pravni fakultet 76:71

Finale:
FON - ETF 79:68

Čestitamo FON-u na tituli šampiona Studentske lige 2025/26! ETF je osvojio drugo mesto posle borbenog finala, Mašinski fakultet je treći, a Pravni fakultet zatvara Final 4.

Hvala svim ekipama na odigranoj sezoni i svima koji su navijali - vidimo se naredne sezone!`;

async function main() {
  const season = await prisma.season.findUnique({ where: { name: SEASON_NAME } });
  if (!season) throw new Error(`Sezona ${SEASON_NAME} ne postoji.`);

  const teams = await prisma.team.findMany();
  const teamIdByName = new Map(teams.map((t) => [t.name, t.id]));

  const alreadySeeded = await prisma.match.findFirst({
    where: { seasonId: season.id, date: new Date(games[0].date) },
  });

  if (alreadySeeded) {
    console.log("Final 4 utakmice već postoje, preskačem unos utakmica.");
  } else {
    for (const g of games) {
      const homeTeamId = teamIdByName.get(g.home);
      const awayTeamId = teamIdByName.get(g.away);
      if (!homeTeamId || !awayTeamId) throw new Error(`Nepoznat tim: ${g.home} ili ${g.away}`);

      await prisma.match.create({
        data: {
          seasonId: season.id,
          homeTeamId,
          awayTeamId,
          date: new Date(g.date),
          venue: VENUE,
          status: "FINISHED",
          homeScore: g.homeScore,
          awayScore: g.awayScore,
        },
      });
    }
    console.log(`Uneto ${games.length} utakmica Final 4 turnira.`);
  }

  const admin = await prisma.user.findUnique({ where: { email: "admin@liga.rs" } });
  if (!admin) throw new Error("Admin nalog ne postoji.");

  const existingPost = await prisma.post.findFirst({ where: { title: POST_TITLE } });
  if (existingPost) {
    console.log("Objava o šampionu već postoji, preskačem.");
  } else {
    await prisma.post.create({
      data: {
        title: POST_TITLE,
        content: POST_CONTENT,
        authorId: admin.id,
        createdAt: new Date("2026-06-13T20:30:00"),
      },
    });
    console.log("Objava o šampionu je kreirana.");
  }

  const fon = await prisma.team.findUnique({ where: { name: "FON" } });
  if (fon) {
    await prisma.seasonStanding.update({
      where: { seasonId_teamId: { seasonId: season.id, teamId: fon.id } },
      data: { note: "Šampion" },
    });
    console.log("FON obeležen kao šampion sezone u tabeli.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
