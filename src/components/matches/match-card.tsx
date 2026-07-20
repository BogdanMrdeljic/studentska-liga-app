import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { TeamLogo } from "@/components/teams/team-logo";
import type { MatchStatus } from "@/generated/prisma/enums";

type MatchCardProps = {
  match: {
    id: string;
    date: Date;
    venue: string | null;
    status: MatchStatus;
    homeScore: number | null;
    awayScore: number | null;
    homeTeam: { id: string; name: string; logoUrl: string | null; colorPrimary: string; colorSecondary: string };
    awayTeam: { id: string; name: string; logoUrl: string | null; colorPrimary: string; colorSecondary: string };
  };
};

const statusLabel: Record<MatchStatus, string> = {
  SCHEDULED: "Zakazano",
  FINISHED: "Odigrano",
  POSTPONED: "Odloženo",
};

const statusVariant: Record<MatchStatus, "success" | "destructive" | "outline"> = {
  SCHEDULED: "outline",
  FINISHED: "success",
  POSTPONED: "destructive",
};

export function MatchCard({ match }: MatchCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center justify-between gap-2 sm:justify-end sm:text-right">
        <Link href={`/ekipe/${match.homeTeam.id}`} className="font-medium hover:underline">
          {match.homeTeam.name}
        </Link>
        <TeamLogo
          logoUrl={match.homeTeam.logoUrl}
          name={match.homeTeam.name}
          colorPrimary={match.homeTeam.colorPrimary}
          colorSecondary={match.homeTeam.colorSecondary}
          size={28}
        />
      </div>

      <div className="flex shrink-0 flex-col items-center gap-1.5 px-3">
        {match.status === "FINISHED" ? (
          <Link
            href={`/utakmice/${match.id}`}
            className="font-heading text-2xl font-bold tabular-nums transition-colors hover:text-primary"
          >
            {match.homeScore} <span className="text-muted-foreground">:</span> {match.awayScore}
          </Link>
        ) : (
          <span className="text-sm font-medium text-muted-foreground">
            {formatDate(match.date)}
          </span>
        )}
        <Badge variant={statusVariant[match.status]}>{statusLabel[match.status]}</Badge>
      </div>

      <div className="flex flex-1 items-center gap-2">
        <TeamLogo
          logoUrl={match.awayTeam.logoUrl}
          name={match.awayTeam.name}
          colorPrimary={match.awayTeam.colorPrimary}
          colorSecondary={match.awayTeam.colorSecondary}
          size={28}
        />
        <Link href={`/ekipe/${match.awayTeam.id}`} className="font-medium hover:underline">
          {match.awayTeam.name}
        </Link>
      </div>
    </div>
  );
}
