import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePlayer } from "@/actions/admin/players";
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

export default async function AdminIgraciPage() {
  const players = await prisma.player.findMany({
    orderBy: { name: "asc" },
    include: { team: true },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold uppercase tracking-wide">Igrači</h1>
        <Button nativeButton={false} render={<Link href="/admin/igraci/novo" />}>
          + Novi igrač
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ime</TableHead>
              <TableHead>Ekipa</TableHead>
              <TableHead>Pozicija</TableHead>
              <TableHead className="text-right">Akcije</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.id}>
                <TableCell className="font-medium">{player.name}</TableCell>
                <TableCell className="text-muted-foreground">{player.team.name}</TableCell>
                <TableCell className="text-muted-foreground">{player.position ?? "-"}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={<Link href={`/admin/igraci/${player.id}`} />}
                  >
                    Izmeni
                  </Button>
                  <DeleteButton action={deletePlayer.bind(null, player.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
