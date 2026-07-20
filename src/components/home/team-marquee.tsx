import Link from "next/link";
import { TeamLogo } from "@/components/teams/team-logo";

type Team = {
  id: string;
  name: string;
  logoUrl: string | null;
  colorPrimary: string;
  colorSecondary: string;
};

export function TeamMarquee({ teams }: { teams: Team[] }) {
  const track = [...teams, ...teams];

  return (
    <div className="overflow-hidden border-y bg-card py-6">
      <div className="flex w-max animate-marquee gap-10">
        {track.map((team, index) => (
          <Link
            key={`${team.id}-${index}`}
            href={`/ekipe/${team.id}`}
            className="group flex shrink-0 items-center gap-2.5"
          >
            <TeamLogo
              logoUrl={team.logoUrl}
              name={team.name}
              colorPrimary={team.colorPrimary}
              colorSecondary={team.colorSecondary}
              size={32}
            />
            <span className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors group-hover:text-foreground">
              {team.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
