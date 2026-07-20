import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type RosterTableProps = {
  players: {
    id: string;
    name: string;
    position: string | null;
    number: number | null;
    stats: {
      points: number;
      threePointers: number;
      fouls: number;
      appearances: number;
    }[];
  }[];
};

export function RosterTable({ players }: RosterTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead>Igrač</TableHead>
            <TableHead>Pozicija</TableHead>
            <TableHead className="text-center">Nastupi</TableHead>
            <TableHead className="text-center">Poeni</TableHead>
            <TableHead className="text-center">Trojke</TableHead>
            <TableHead className="text-center">Faulovi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => {
            const stat = player.stats[0];
            return (
              <TableRow key={player.id}>
                <TableCell className="text-muted-foreground">{player.number ?? "-"}</TableCell>
                <TableCell>
                  <Link href={`/igraci/${player.id}`} className="font-medium hover:underline">
                    {player.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{player.position ?? "-"}</TableCell>
                <TableCell className="text-center">{stat?.appearances ?? 0}</TableCell>
                <TableCell className="text-center font-semibold text-primary">
                  {stat?.points ?? 0}
                </TableCell>
                <TableCell className="text-center">{stat?.threePointers ?? 0}</TableCell>
                <TableCell className="text-center">{stat?.fouls ?? 0}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
