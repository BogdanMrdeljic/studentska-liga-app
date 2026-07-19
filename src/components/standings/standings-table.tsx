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
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead>Tim</TableHead>
            <TableHead className="text-center">Odigrano</TableHead>
            <TableHead className="text-center">W</TableHead>
            <TableHead className="text-center">L</TableHead>
            <TableHead className="text-center">Koš razlika</TableHead>
            <TableHead className="text-center font-bold">Poeni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={row.teamId}
              className={cn(
                index < playoffCutoff
                  ? "bg-primary/5"
                  : "bg-destructive/5"
              )}
            >
              <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
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
