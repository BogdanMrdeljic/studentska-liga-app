import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const logos: Record<string, string> = {
  FON: "/teams/fon.svg",
  ETF: "/teams/etf.png",
  EKOF: "/teams/ekof.png",
  MASINAC: "/teams/masinac.jpg",
  SAOB: "/teams/saob.png",
  PRAVNI: "/teams/pravni.png",
  MATF: "/teams/matf.gif",
  MED: "/teams/med.png",
  DIF: "/teams/dif.png",
  STOMATOLOGIJA: "/teams/stomatologija.png",
  BOGOSLOVIJA: "/teams/bogoslovija.png",
  GRADJ: "/teams/gradj.png",
  ARHITEKTURA: "/teams/arhitektura.png",
  RAF: "/teams/raf.png",
  TMF: "/teams/tmf.svg",
  ATUSS: "/teams/atuss.svg",
};

async function main() {
  for (const [name, logoUrl] of Object.entries(logos)) {
    const result = await prisma.team.updateMany({ where: { name }, data: { logoUrl } });
    console.log(`${name}: ${result.count} ažurirano -> ${logoUrl}`);
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
