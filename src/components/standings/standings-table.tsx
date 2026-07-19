import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { StandingRow } from "@/lib/standings";

export function StandingsTable({ rows }: { rows: StandingRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead>Ekipa</TableHead>
            <TableHead className="text-center">Odigrano</TableHead>
            <TableHead className="text-center">Pobede</TableHead>
            <TableHead className="text-center">Porazi</TableHead>
            <TableHead className="text-center">Poeni +/-</TableHead>
            <TableHead className="text-center font-bold">% Pobeda</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={row.teamId}>
              <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
              <TableCell>
                <Link href={`/ekipe/${row.teamId}`} className="flex items-center gap-2 font-medium hover:underline">
                  <span
                    className="size-3 shrink-0 rounded-full"
                    style={{ backgroundColor: row.colorPrimary }}
                  />
                  {row.teamName}
                </Link>
              </TableCell>
              <TableCell className="text-center">{row.played}</TableCell>
              <TableCell className="text-center">{row.won}</TableCell>
              <TableCell className="text-center">{row.lost}</TableCell>
              <TableCell className="text-center">
                {row.pointsFor}:{row.pointsAgainst} ({row.pointDiff >= 0 ? "+" : ""}
                {row.pointDiff})
              </TableCell>
              <TableCell className="text-center text-lg font-bold text-primary">
                {Math.round(row.winPct * 100)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
