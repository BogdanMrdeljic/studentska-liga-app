import Link from "next/link";
import { getAllSeasons, getActiveSeason, getSeasonStandings } from "@/lib/standings";
import { StandingsTable } from "@/components/standings/standings-table";
import { cn } from "@/lib/utils";

export default async function TabelaPage({
  searchParams,
}: {
  searchParams: Promise<{ sezona?: string }>;
}) {
  const { sezona } = await searchParams;
  const [seasons, activeSeason] = await Promise.all([getAllSeasons(), getActiveSeason()]);

  const season = sezona ? (seasons.find((s) => s.id === sezona) ?? activeSeason) : activeSeason;
  const rows = season ? await getSeasonStandings(season.id) : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="flex items-center gap-3 font-heading text-3xl font-bold uppercase tracking-wide">
        <span className="kicker" aria-hidden />
        Tabela lige
      </h1>

      {seasons.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {seasons.map((s) => (
            <Link
              key={s.id}
              href={`/tabela?sezona=${s.id}`}
              className={cn(
                "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
                season?.id === s.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {s.name}
            </Link>
          ))}
        </div>
      )}

      <p className="mt-4 text-muted-foreground">Sezona: {season?.name ?? "Nema sezona"}</p>

      <div className="mt-4">
        {rows.length === 0 ? (
          <p className="text-muted-foreground">Nema podataka o ekipama.</p>
        ) : (
          <StandingsTable rows={rows} />
        )}
      </div>
    </div>
  );
}
