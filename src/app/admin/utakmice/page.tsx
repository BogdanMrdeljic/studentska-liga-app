import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteMatch } from "@/actions/admin/matches";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/admin/delete-button";

const statusLabel: Record<string, string> = {
  SCHEDULED: "Zakazano",
  FINISHED: "Odigrano",
  POSTPONED: "Odloženo",
};

export default async function AdminUtakmicePage() {
  const matches = await prisma.match.findMany({
    orderBy: { date: "desc" },
    include: { homeTeam: true, awayTeam: true, season: true },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold uppercase tracking-wide">Utakmice</h1>
        <Button nativeButton={false} render={<Link href="/admin/utakmice/nova" />}>
          + Nova utakmica
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Datum</TableHead>
              <TableHead>Utakmica</TableHead>
              <TableHead>Rezultat</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Akcije</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((match) => (
              <TableRow key={match.id}>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatDate(match.date)}
                </TableCell>
                <TableCell className="font-medium">
                  {match.homeTeam.name} vs {match.awayTeam.name}
                </TableCell>
                <TableCell>
                  {match.homeScore !== null && match.awayScore !== null
                    ? `${match.homeScore} : ${match.awayScore}`
                    : "-"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{statusLabel[match.status]}</Badge>
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={<Link href={`/admin/utakmice/${match.id}`} />}
                  >
                    Izmeni
                  </Button>
                  <DeleteButton action={deleteMatch.bind(null, match.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
