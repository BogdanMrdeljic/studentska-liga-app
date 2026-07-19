import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const VENUE = "Enfild";

// Plej-of parovi sezone 2025/26 (izmišljeni rezultati, dogovoreni pobednici).
const quarterfinals = [
  { home: "SAOB", away: "MASINAC", homeScore: 68, awayScore: 74, date: "2026-06-11T18:00:00" },
  { home: "FON", away: "MED", homeScore: 79, awayScore: 65, date: "2026-06-11T19:30:00" },
  { home: "ETF", away: "MATF", homeScore: 71, awayScore: 66, date: "2026-06-12T18:00:00" },
  { home: "EKOF", away: "PRAVNI", homeScore: 60, awayScore: 64, date: "2026-06-12T19:30:00" },
] as const;

const POST_TITLE = "Plej-of: poznati učesnici Final 4 turnira!";

const POST_CONTENT = `Odigrani su parovi plej-ofa Studentske lige i poznati su učesnici Final 4 turnira!

Rezultati:
SAOB - Mašinac 68:74
FON - Medicina 79:65
ETF - MATF 71:66
EKOF - Pravni fakultet 60:64

Mašinac, FON, ETF i Pravni fakultet su izborili plasman na Final 4 turnir koji se igra 13. juna u Hali "David Kalinić". Ostanite u toku - uskoro i raspored mečeva!`;

async function main() {
  const season = await prisma.season.findUnique({ where: { name: "2025/26" } });
  if (!season) throw new Error("Sezona 2025/26 ne postoji.");

  const teams = await prisma.team.findMany();
  const teamIdByName = new Map(teams.map((t) => [t.name, t.id]));

  const alreadySeeded = await prisma.match.findFirst({
    where: { seasonId: season.id, venue: VENUE, date: new Date(quarterfinals[0].date) },
  });
  if (alreadySeeded) {
    console.log("Plej-of utakmice već postoje, preskačem.");
  } else {
    for (const m of quarterfinals) {
      const homeTeamId = teamIdByName.get(m.home);
      const awayTeamId = teamIdByName.get(m.away);
      if (!homeTeamId || !awayTeamId) throw new Error(`Nepoznat tim: ${m.home} ili ${m.away}`);

      await prisma.match.create({
        data: {
          seasonId: season.id,
          homeTeamId,
          awayTeamId,
          date: new Date(m.date),
          venue: VENUE,
          status: "FINISHED",
          homeScore: m.homeScore,
          awayScore: m.awayScore,
        },
      });
    }
    console.log(`Uneto ${quarterfinals.length} plej-of utakmica.`);
  }

  const admin = await prisma.user.findUnique({ where: { email: "admin@liga.rs" } });
  if (!admin) throw new Error("Admin nalog ne postoji.");

  const final4Post = await prisma.post.findFirst({
    where: { title: "Završni turnir Studentske lige – Final 4!" },
  });

  const existingPost = await prisma.post.findFirst({ where: { title: POST_TITLE } });
  if (existingPost) {
    console.log("Objava o plej-ofu već postoji, preskačem.");
    return;
  }

  // Postavi objavu da hronološki bude pre Final4 najave.
  const createdAt = final4Post
    ? new Date(final4Post.createdAt.getTime() - 24 * 60 * 60 * 1000)
    : undefined;

  await prisma.post.create({
    data: {
      title: POST_TITLE,
      content: POST_CONTENT,
      authorId: admin.id,
      ...(createdAt ? { createdAt } : {}),
    },
  });

  console.log("Objava o plej-ofu je kreirana.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
