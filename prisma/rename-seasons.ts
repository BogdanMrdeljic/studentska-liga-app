import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Rename current active season first, freeing up "2025/26" for the
  // previous season, then rename the previous season into it.
  await prisma.season.update({
    where: { name: "2025/26" },
    data: { name: "2026/27" },
  });

  const previousSeason = await prisma.season.update({
    where: { name: "2024/25" },
    data: { name: "2025/26" },
  });

  // Shift the (now) 2025/26 season's match dates forward a year so they
  // still fall in the right calendar window (May/June 2026 instead of 2025).
  const matches = await prisma.match.findMany({ where: { seasonId: previousSeason.id } });
  for (const match of matches) {
    const newDate = new Date(match.date);
    newDate.setFullYear(newDate.getFullYear() + 1);
    await prisma.match.update({ where: { id: match.id }, data: { date: newDate } });
  }

  const atuss = await prisma.team.findUnique({ where: { name: "ATUSS" } });
  if (atuss) {
    await prisma.seasonStanding.update({
      where: { seasonId_teamId: { seasonId: previousSeason.id, teamId: atuss.id } },
      data: { note: "Ekipa odustala" },
    });
  }

  console.log("Sezone preimenovane, datumi pomereni, napomena za ATUSS dodata.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
