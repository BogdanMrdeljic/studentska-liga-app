import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Replaces the placeholder 5-per-team demo roster (same 5 names copy-pasted
// across every team) with a full, presentable 10-player roster per team —
// unique names, varied positions/numbers, and season stats flavored by
// position so the app looks like a real league to potential sponsors.

const firstNames = [
  "Marko", "Petar", "Nikola", "Stefan", "Aleksa", "Miloš", "Nemanja", "Vukašin",
  "Luka", "Filip", "Uroš", "Đorđe", "Vladimir", "Aleksandar", "Dušan", "Ognjen",
  "Bogdan", "Lazar", "Mihailo", "Andrija", "Jovan", "Strahinja", "Nenad", "Igor",
  "Ivan", "Milan", "Dragan", "Vladan", "Boris", "Dejan", "Goran", "Vuk", "Relja",
  "Pavle", "Teodor", "Kosta", "Matija", "Rastko", "Dimitrije", "Vasilije",
  "Aljoša", "Branko", "Dragoslav", "Vidak", "Milutin", "Radovan", "Slaviša",
  "Nikodim", "Vladeta", "Časlav", "Vukan", "Milovan", "Vojin", "Zdravko",
  "Predrag", "Miroslav", "Radoje", "Danilo", "Damjan", "Vojislav", "Gojko",
] as const;

const lastNames = [
  "Marković", "Petrović", "Nikolić", "Stefanović", "Aleksić", "Jovanović",
  "Ilić", "Popović", "Đorđević", "Stojanović", "Pavlović", "Simić", "Ristić",
  "Kovačević", "Vasić", "Vuković", "Mitrović", "Milošević", "Todorović",
  "Radovanović", "Antić", "Savić", "Živković", "Cvetković", "Lazić",
  "Obradović", "Đukić", "Marinković", "Tomić", "Nedeljković", "Pantić",
  "Blagojević", "Milanović", "Vujović", "Anđelković", "Perić", "Erić",
  "Radulović", "Milić", "Đukanović", "Vasiljević", "Filipović", "Gavrilović",
  "Maksimović", "Janković", "Božović", "Radosavljević", "Aćimović", "Micić",
  "Trifunović", "Kostić", "Dimitrijević", "Milutinović", "Jakšić", "Ninković",
  "Stanković", "Marić", "Krstić", "Đurić", "Rakić", "Bogdanović",
] as const;

const positions = [
  { label: "Plejmejker", count: 2 },
  { label: "Bek", count: 2 },
  { label: "Krilo", count: 2 },
  { label: "Krilni centar", count: 2 },
  { label: "Centar", count: 2 },
] as const;

function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function statsForPosition(label: string) {
  switch (label) {
    case "Plejmejker":
      return { points: randInt(6, 16), rebounds: randInt(1, 4), assists: randInt(4, 10), steals: randInt(2, 6), blocks: randInt(0, 1) };
    case "Bek":
      return { points: randInt(10, 20), rebounds: randInt(2, 5), assists: randInt(2, 6), steals: randInt(1, 4), blocks: randInt(0, 2) };
    case "Krilo":
      return { points: randInt(8, 18), rebounds: randInt(3, 7), assists: randInt(2, 5), steals: randInt(1, 4), blocks: randInt(0, 2) };
    case "Krilni centar":
      return { points: randInt(7, 15), rebounds: randInt(5, 10), assists: randInt(1, 3), steals: randInt(0, 3), blocks: randInt(1, 4) };
    default:
      return { points: randInt(6, 14), rebounds: randInt(7, 13), assists: randInt(0, 2), steals: randInt(0, 2), blocks: randInt(2, 6) };
  }
}

async function main() {
  const [teams, season] = await Promise.all([
    prisma.team.findMany({ orderBy: { name: "asc" } }),
    prisma.season.findFirst({ where: { isActive: true } }),
  ]);
  if (!season) throw new Error("Nema aktivne sezone.");

  await prisma.player.deleteMany({});

  const usedNames = new Set<string>();
  const usedIndexNumbers = new Set<string>();

  const shuffledFirst = shuffle(firstNames);
  const shuffledLast = shuffle(lastNames);
  let nameCursor = 0;

  function nextName(): string {
    for (let attempt = 0; attempt < 500; attempt++) {
      const first = shuffledFirst[nameCursor % shuffledFirst.length];
      const last = shuffledLast[(nameCursor * 7 + attempt) % shuffledLast.length];
      nameCursor++;
      const full = `${first} ${last}`;
      if (!usedNames.has(full)) {
        usedNames.add(full);
        return full;
      }
    }
    throw new Error("Ponestalo jedinstvenih imena.");
  }

  function nextIndexNumber(): string {
    let indexNumber: string;
    do {
      const year = 2021 + Math.floor(Math.random() * 4);
      const number = String(randInt(1, 9999)).padStart(4, "0");
      indexNumber = `${year}/${number}`;
    } while (usedIndexNumbers.has(indexNumber));
    usedIndexNumbers.add(indexNumber);
    return indexNumber;
  }

  let created = 0;
  for (const team of teams) {
    const usedNumbers = new Set<number>();
    const roster = positions.flatMap((p) => Array(p.count).fill(p.label));

    for (const positionLabel of roster) {
      let number: number;
      do {
        number = randInt(0, 99);
      } while (usedNumbers.has(number));
      usedNumbers.add(number);

      const player = await prisma.player.create({
        data: {
          name: nextName(),
          position: positionLabel,
          number,
          indexNumber: nextIndexNumber(),
          teamId: team.id,
        },
      });

      const stats = statsForPosition(positionLabel);
      await prisma.playerStat.create({
        data: {
          playerId: player.id,
          seasonId: season.id,
          appearances: randInt(3, 8),
          ...stats,
        },
      });
      created++;
    }
  }

  console.log(`Kreirano ${created} igrača za ${teams.length} ekipa.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
