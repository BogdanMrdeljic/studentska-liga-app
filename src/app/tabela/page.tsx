import { getActiveSeason, getStandings } from "@/lib/standings";
import { StandingsTable } from "@/components/standings/standings-table";

export default async function TabelaPage() {
  const season = await getActiveSeason();
  const rows = season ? await getStandings(season.id) : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-heading text-3xl font-bold uppercase tracking-wide">Tabela lige</h1>
      <p className="mt-1 text-muted-foreground">
        Sezona: {season?.name ?? "Nema aktivne sezone"}
      </p>

      <div className="mt-8">
        {rows.length === 0 ? (
          <p className="text-muted-foreground">Nema podataka o ekipama.</p>
        ) : (
          <StandingsTable rows={rows} />
        )}
      </div>
    </div>
  );
}
