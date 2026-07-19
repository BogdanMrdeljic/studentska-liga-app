import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { TeamLogo } from "@/components/teams/team-logo";

type TeamCardProps = {
  team: {
    id: string;
    name: string;
    city: string | null;
    logoUrl: string | null;
    colorPrimary: string;
    colorSecondary: string;
    playerCount: number;
  };
};

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Link href={`/ekipe/${team.id}`} className="group">
      <Card
        className="overflow-hidden transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg"
        style={{ ["--team-color" as string]: team.colorPrimary }}
      >
        <div className="h-1.5 bg-(--team-color)" />
        <CardContent className="flex items-center gap-3 pt-4">
          <TeamLogo
            logoUrl={team.logoUrl}
            name={team.name}
            colorPrimary={team.colorPrimary}
            colorSecondary={team.colorSecondary}
            size={48}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading font-semibold uppercase tracking-wide transition-colors group-hover:text-(--team-color)">
              {team.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {team.city ?? "Nepoznat grad"} · {team.playerCount} igrača
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
