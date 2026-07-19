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
    <Link href={`/ekipe/${team.id}`}>
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <div className="h-2" style={{ backgroundColor: team.colorPrimary }} />
        <CardContent className="flex items-center gap-3 pt-4">
          <TeamLogo
            logoUrl={team.logoUrl}
            name={team.name}
            colorPrimary={team.colorPrimary}
            colorSecondary={team.colorSecondary}
            size={48}
          />
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
