import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Fills in placeholder ("fiktivni") index numbers for players that don't
// have one yet, so the field isn't empty before the admin enters real ones
// once the league actually starts.
async function main() {
  const players = await prisma.player.findMany({
    where: { indexNumber: null },
    orderBy: [{ teamId: "asc" }, { name: "asc" }],
  });

  const used = new Set<string>();
  for (const player of players) {
    let indexNumber: string;
    do {
      const year = 2021 + Math.floor(Math.random() * 4);
      const number = String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0");
      indexNumber = `${year}/${number}`;
    } while (used.has(indexNumber));
    used.add(indexNumber);

    await prisma.player.update({ where: { id: player.id }, data: { indexNumber } });
  }

  console.log(`Postavljen fiktivan broj indeksa za ${players.length} igrača.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
