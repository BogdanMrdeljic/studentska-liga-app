import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const TITLE = "Završni turnir Studentske lige – Final 4!";

const CONTENT = `Četiri fakulteta boriće se da podignu pehar namenjen šampionu:
- FON
- ETF
- Pravni fakultet
- Mašinski fakultet

Datum: 13. jun 2026.
Mesto: Hala "David Kalinić"
Početak: 13:00

Raspored:
13:00 - ETF vs Pravni fakultet
14:30 - FON vs Mašinski fakultet
16:10 - Takmičenje u šutiranju trojki
16:45 - Meč za treće mesto
18:15 - Finale

Očekuju nas utakmice pune energije, borbe do poslednjeg zvuka sirene i atmosfera kakva se viđa samo na završnicama. Svaki poen može odlučiti sezonu, svaka odbrana može doneti prevagu.

Sve utakmice završnog turnira prenosiće uživo Sportindeks Media, tako da nećete propustiti nijedan trenutak spektakla!

Dođi da podržiš svoj fakultet i vidiš ko podiže pehar Studentske lige Univerziteta u Beogradu!`;

async function main() {
  const admin = await prisma.user.findUnique({ where: { email: "admin@liga.rs" } });
  if (!admin) throw new Error("Admin nalog ne postoji.");

  const existing = await prisma.post.findFirst({ where: { title: TITLE } });
  if (existing) {
    console.log("Objava već postoji, preskačem.");
    return;
  }

  await prisma.post.create({
    data: {
      title: TITLE,
      content: CONTENT,
      imageUrl: "/posts/final4-najava.jpg",
      authorId: admin.id,
    },
  });

  console.log("Objava o Final 4 turniru je kreirana.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
