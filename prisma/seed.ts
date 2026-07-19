import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const season = await prisma.season.upsert({
    where: { name: "2026/27" },
    update: {},
    create: { name: "2026/27", isActive: true },
  });

  const teamsData = [
    { name: "FON", colorPrimary: "#2563eb", colorSecondary: "#ffffff" },
    { name: "ETF", colorPrimary: "#ea580c", colorSecondary: "#ffffff" },
    { name: "EKOF", colorPrimary: "#16a34a", colorSecondary: "#ffffff" },
    { name: "MASINAC", colorPrimary: "#475569", colorSecondary: "#facc15" },
    { name: "SAOB", colorPrimary: "#ca8a04", colorSecondary: "#111827" },
    { name: "PRAVNI", colorPrimary: "#991b1b", colorSecondary: "#facc15" },
    { name: "MATF", colorPrimary: "#7c3aed", colorSecondary: "#ffffff" },
    { name: "MED", colorPrimary: "#dc2626", colorSecondary: "#ffffff" },
    { name: "DIF", colorPrimary: "#0d9488", colorSecondary: "#ffffff" },
    { name: "STOMATOLOGIJA", colorPrimary: "#db2777", colorSecondary: "#ffffff" },
    { name: "BOGOSLOVIJA", colorPrimary: "#1e3a8a", colorSecondary: "#facc15" },
    { name: "GRADJ", colorPrimary: "#c2410c", colorSecondary: "#ffffff" },
    { name: "ARHITEKTURA", colorPrimary: "#18181b", colorSecondary: "#dc2626" },
  ] as const;

  const teams: Awaited<ReturnType<typeof prisma.team.upsert>>[] = [];
  for (const t of teamsData) {
    const team = await prisma.team.upsert({
      where: { name: t.name },
      update: {},
      create: { name: t.name, city: "Beograd", colorPrimary: t.colorPrimary, colorSecondary: t.colorSecondary },
    });
    teams.push(team);
  }

  const playerNames = [
    ["Marko Marković", "Plejmejker", 4],
    ["Petar Petrović", "Bek", 7],
    ["Nikola Nikolić", "Krilo", 11],
    ["Stefan Stefanović", "Krilni centar", 15],
    ["Aleksa Aleksić", "Centar", 23],
  ] as const;

  for (const team of teams) {
    for (const [name, position, number] of playerNames) {
      const player = await prisma.player.create({
        data: {
          name: `${name} (${team.name})`,
          position,
          number,
          teamId: team.id,
        },
      });
      await prisma.playerStat.create({
        data: {
          playerId: player.id,
          seasonId: season.id,
          appearances: Math.floor(Math.random() * 4) + 2,
          points: Math.floor(Math.random() * 20) + 5,
          rebounds: Math.floor(Math.random() * 9) + 1,
          assists: Math.floor(Math.random() * 8),
          steals: Math.floor(Math.random() * 4),
          blocks: Math.floor(Math.random() * 3),
        },
      });
    }
  }

  const byName = (name: string) => teams.find((t) => t.name === name)!;

  const now = new Date();
  const matches = [
    { home: "FON", away: "ETF", daysOffset: -10, status: "FINISHED" as const, homeScore: 82, awayScore: 76 },
    { home: "EKOF", away: "MASINAC", daysOffset: -8, status: "FINISHED" as const, homeScore: 65, awayScore: 70 },
    { home: "SAOB", away: "PRAVNI", daysOffset: -6, status: "FINISHED" as const, homeScore: 90, awayScore: 88 },
    { home: "MATF", away: "MED", daysOffset: -4, status: "FINISHED" as const, homeScore: 55, awayScore: 60 },
    { home: "DIF", away: "STOMATOLOGIJA", daysOffset: -2, status: "FINISHED" as const, homeScore: 73, awayScore: 69 },
    { home: "BOGOSLOVIJA", away: "GRADJ", daysOffset: 2, status: "SCHEDULED" as const, homeScore: null, awayScore: null },
    { home: "ARHITEKTURA", away: "FON", daysOffset: 4, status: "SCHEDULED" as const, homeScore: null, awayScore: null },
    { home: "ETF", away: "EKOF", daysOffset: 6, status: "SCHEDULED" as const, homeScore: null, awayScore: null },
    { home: "MASINAC", away: "SAOB", daysOffset: 8, status: "SCHEDULED" as const, homeScore: null, awayScore: null },
    { home: "PRAVNI", away: "MATF", daysOffset: 10, status: "SCHEDULED" as const, homeScore: null, awayScore: null },
    { home: "MED", away: "DIF", daysOffset: 12, status: "SCHEDULED" as const, homeScore: null, awayScore: null },
    { home: "STOMATOLOGIJA", away: "BOGOSLOVIJA", daysOffset: 14, status: "SCHEDULED" as const, homeScore: null, awayScore: null },
  ];

  const createdMatches = [];
  for (const m of matches) {
    const date = new Date(now);
    date.setDate(date.getDate() + m.daysOffset);
    const match = await prisma.match.create({
      data: {
        seasonId: season.id,
        homeTeamId: byName(m.home).id,
        awayTeamId: byName(m.away).id,
        date,
        venue: "Sportski centar Studentski grad",
        status: m.status,
        homeScore: m.homeScore ?? undefined,
        awayScore: m.awayScore ?? undefined,
      },
    });
    createdMatches.push(match);
  }

  const adminPasswordHash = await bcrypt.hash("Admin123!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@liga.rs" },
    update: {},
    create: {
      name: "Admin Lige",
      email: "admin@liga.rs",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  const post = await prisma.post.create({
    data: {
      title: "Otvaranje sezone 2026/27!",
      content:
        "Nova sezona Studentske košarkaške lige počinje ovog vikenda. Pratite raspored i navijajte za svoj fakultet!",
      authorId: admin.id,
      matchId: createdMatches[0].id,
    },
  });

  await prisma.comment.create({
    data: {
      content: "Jedva čekamo početak sezone!",
      postId: post.id,
      authorId: admin.id,
    },
  });

  console.log("Seed završen.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
