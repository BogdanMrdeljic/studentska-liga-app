import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import type { MatchStatus } from "@/generated/prisma/enums";

type MatchCardProps = {
  match: {
    id: string;
    date: Date;
    venue: string | null;
    status: MatchStatus;
    homeScore: number | null;
    awayScore: number | null;
    homeTeam: { id: string; name: string; colorPrimary: string };
    awayTeam: { id: string; name: string; colorPrimary: string };
  };
};

const statusLabel: Record<MatchStatus, string> = {
  SCHEDULED: "Zakazano",
  FINISHED: "Odigrano",
  POSTPONED: "Odloženo",
};

const statusVariant: Record<MatchStatus, "default" | "secondary" | "destructive" | "outline"> = {
  SCHEDULED: "outline",
  FINISHED: "default",
  POSTPONED: "destructive",
};

export function MatchCard({ match }: MatchCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center justify-between gap-2 sm:justify-end sm:text-right">
        <Link href={`/ekipe/${match.homeTeam.id}`} className="font-medium hover:underline">
          {match.homeTeam.name}
        </Link>
        <span
          className="size-3 shrink-0 rounded-full"
          style={{ backgroundColor: match.homeTeam.colorPrimary }}
        />
      </div>

      <div className="flex shrink-0 flex-col items-center gap-1 px-2">
        {match.status === "FINISHED" ? (
          <span className="font-heading text-xl font-bold">
            {match.homeScore} : {match.awayScore}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">{formatDate(match.date)}</span>
        )}
        <Badge variant={statusVariant[match.status]}>{statusLabel[match.status]}</Badge>
      </div>

      <div className="flex flex-1 items-center gap-2">
        <span
          className="size-3 shrink-0 rounded-full"
          style={{ backgroundColor: match.awayTeam.colorPrimary }}
        />
        <Link href={`/ekipe/${match.awayTeam.id}`} className="font-medium hover:underline">
          {match.awayTeam.name}
        </Link>
      </div>
    </div>
  );
}
