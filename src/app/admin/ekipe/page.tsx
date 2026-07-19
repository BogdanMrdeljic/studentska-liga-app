import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteTeam } from "@/actions/admin/teams";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminEkipePage() {
  const teams = await prisma.team.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold uppercase tracking-wide">Ekipe</h1>
        <Button nativeButton={false} render={<Link href="/admin/ekipe/novo" />}>
          + Nova ekipa
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ime</TableHead>
              <TableHead>Grad</TableHead>
              <TableHead>Boje</TableHead>
              <TableHead className="text-right">Akcije</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell className="font-medium">{team.name}</TableCell>
                <TableCell className="text-muted-foreground">{team.city ?? "-"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <span
                      className="size-4 rounded-full border"
                      style={{ backgroundColor: team.colorPrimary }}
                    />
                    <span
                      className="size-4 rounded-full border"
                      style={{ backgroundColor: team.colorSecondary }}
                    />
                  </div>
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={<Link href={`/admin/ekipe/${team.id}`} />}
                  >
                    Izmeni
                  </Button>
                  <DeleteButton action={deleteTeam.bind(null, team.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
