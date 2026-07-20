import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// New columns (threePointers, fouls) default to 0 for existing PlayerStat
// rows after the schema change. Fills in plausible position-flavored values
// so the Statistika page isn't just zeros for two of the three categories.

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rangesForPosition(label: string | null) {
  switch (label) {
    case "Plejmejker":
      return { threes: [1, 4], fouls: [0, 3] } as const;
    case "Bek":
      return { threes: [2, 5], fouls: [0, 3] } as const;
    case "Krilo":
      return { threes: [1, 4], fouls: [1, 3] } as const;
    case "Krilni centar":
      return { threes: [0, 2], fouls: [1, 4] } as const;
    case "Centar":
      return { threes: [0, 1], fouls: [2, 5] } as const;
    default:
      return { threes: [0, 3], fouls: [0, 4] } as const;
  }
}

async function main() {
  const stats = await prisma.playerStat.findMany({
    where: { threePointers: 0, fouls: 0 },
    include: { player: true },
  });

  for (const stat of stats) {
    const { threes, fouls } = rangesForPosition(stat.player.position);
    await prisma.playerStat.update({
      where: { id: stat.id },
      data: {
        threePointers: randInt(threes[0], threes[1]),
        fouls: randInt(fouls[0], fouls[1]),
      },
    });
  }

  console.log(`Ažurirano ${stats.length} zapisa statistike.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
