import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

type TeamCardProps = {
  team: {
    id: string;
    name: string;
    city: string | null;
    colorPrimary: string;
    colorSecondary: string;
    playerCount: number;
  };
};

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Link href={`/ekipe/${team.id}`}>
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <div className="h-2" style={{ backgroundColor: team.colorPrimary }} />
        <CardContent className="flex items-center gap-3 pt-4">
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-full font-heading text-lg font-bold"
            style={{ backgroundColor: team.colorPrimary, color: team.colorSecondary }}
          >
            {team.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-heading font-semibold uppercase tracking-wide">{team.name}</p>
            <p className="text-sm text-muted-foreground">
              {team.city ?? "Nepoznat grad"} · {team.playerCount} igrača
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
