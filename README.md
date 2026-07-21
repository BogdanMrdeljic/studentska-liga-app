# Studentska Košarkaška Liga

Web aplikacija Studentske košarkaške lige Univerziteta u Beogradu — raspored utakmica, tabela lige, statistika ekipa i igrača, profili 16 fakultetskih timova i sistem objava sa komentarima za navijače.

🔗 **Sajt:** [studentskaligaapp.vercel.app](https://studentskaligaapp.vercel.app)

## Šta sajt nudi

- **Raspored i rezultati** — pregled odigranih i zakazanih utakmica po sezonama
- **Tabela lige** — automatski računata iz odigranih utakmica za aktuelnu sezonu, arhivirane tabele za prošle sezone
- **Statistika po utakmici** — box score po igraču (poeni, trojke, faulovi) za svaku odigranu utakmicu, sa priloženim zapisnikom (slika ili PDF) kao dokazom regularnosti
- **Statistika sezone** — rang liste igrača po poenima, trojkama i faulovima, ukupno ili prosek po utakmici, računato automatski iz zapisnika utakmica
- **Ekipe i igrači** — profili svih 16 fakultetskih timova sa rosterima, zvaničnim logoima i statistikom po igraču
- **Objave** — najave utakmica i vesti lige, sa komentarima za prijavljene korisnike
- **Sponzori** — istaknuto mesto za generalnog sponzora i sekundarne sponzore
- **Admin panel** — zaštićen deo za unos i izmenu ekipa, igrača, utakmica, zapisnika i objava

## Tehnologije

- **[Next.js 16](https://nextjs.org/)** (App Router, Turbopack) + **TypeScript**
- **Tailwind CSS v4** + **[shadcn/ui](https://ui.shadcn.com/)** (na Base UI komponentama)
- **[Prisma 7](https://www.prisma.io/)** ORM sa driver adapterima
- **PostgreSQL** baza hostovana na **[Neon](https://neon.tech/)**
- **[NextAuth.js](https://authjs.dev/)** (v5) — autentifikacija i uloge korisnika (admin/korisnik)
- Deploy na **[Vercel](https://vercel.com/)**, automatski pri svakom push-u na `main`

## Pokretanje lokalno

```bash
npm install
npm run dev
```

Potreban je `.env` fajl sa `DATABASE_URL` (Neon/PostgreSQL connection string) i NextAuth promenljivama. Šema baze se primenjuje preko Prisma migracija:

```bash
npx prisma migrate deploy
npx prisma generate
```

Sajt je zatim dostupan na [http://localhost:3000](http://localhost:3000).

