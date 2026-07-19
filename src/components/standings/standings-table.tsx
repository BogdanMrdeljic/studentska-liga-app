import Link from "next/link";
import { cn } from "@/lib/utils";
import { TeamLogo } from "@/components/teams/team-logo";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { StandingRow } from "@/lib/standings";

export function StandingsTable({
  rows,
  playoffCutoff = 8,
}: {
  rows: StandingRow[];
  playoffCutoff?: number;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/60 hover:bg-muted/60">
            <TableHead className="w-10 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              #
            </TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Tim
            </TableHead>
            <TableHead className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Odigrano
            </TableHead>
            <TableHead className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              W
            </TableHead>
            <TableHead className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              L
            </TableHead>
            <TableHead className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Koš razlika
            </TableHead>
            <TableHead className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Poeni
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={row.teamId}
              className={cn(
                "border-l-4!",
                index < playoffCutoff
                  ? "border-l-success/60!"
                  : "border-l-destructive/50!"
              )}
            >
              <TableCell className="font-medium text-muted-foreground">
                <span
                  className={cn(
                    "inline-flex size-6 items-center justify-center rounded-full text-xs font-bold tabular-nums",
                    index === 0
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {index + 1}
                </span>
              </TableCell>
              <TableCell>
                <Link href={`/ekipe/${row.teamId}`} className="flex items-center gap-2 font-medium hover:underline">
                  <TeamLogo
                    logoUrl={row.logoUrl}
                    name={row.teamName}
                    colorPrimary={row.colorPrimary}
                    colorSecondary={row.colorSecondary}
                    size={24}
                  />
                  {row.teamName}
                </Link>
                {row.note && (
                  <span className="mt-0.5 block text-xs font-normal italic text-muted-foreground">
                    {row.note}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-center">{row.played}</TableCell>
              <TableCell className="text-center">{row.won}</TableCell>
              <TableCell className="text-center">{row.lost}</TableCell>
              <TableCell className="text-center">
                {row.pointDiff > 0 ? "+" : ""}
                {row.pointDiff}
              </TableCell>
              <TableCell className="text-center text-lg font-bold text-primary">
                {row.points}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
