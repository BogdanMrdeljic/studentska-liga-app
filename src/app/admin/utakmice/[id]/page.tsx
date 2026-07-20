import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateMatch, updateMatchStats } from "@/actions/admin/matches";
import { toDatetimeLocalValue } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function EditMatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      homeTeam: { include: { players: { orderBy: { number: "asc" } } } },
      awayTeam: { include: { players: { orderBy: { number: "asc" } } } },
      playerStats: true,
    },
  });
  if (!match) notFound();

  const action = updateMatch.bind(null, id);
  const playerIds = [...match.homeTeam.players, ...match.awayTeam.players].map((p) => p.id);
  const statsAction = updateMatchStats.bind(null, id, playerIds);
  const statByPlayer = new Map(match.playerStats.map((s) => [s.playerId, s]));

  const rosterSections = [
    { label: `Domaćin — ${match.homeTeam.name}`, players: match.homeTeam.players },
    { label: `Gost — ${match.awayTeam.name}`, players: match.awayTeam.players },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-2xl uppercase tracking-wide">
            {match.homeTeam.name} vs {match.awayTeam.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">Datum i vreme</Label>
              <Input
                id="date"
                name="date"
                type="datetime-local"
                required
                defaultValue={toDatetimeLocalValue(match.date)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue">Mesto</Label>
              <Input id="venue" name="venue" defaultValue={match.venue ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <NativeSelect id="status" name="status" defaultValue={match.status}>
                <option value="SCHEDULED">Zakazano</option>
                <option value="FINISHED">Odigrano</option>
                <option value="POSTPONED">Odloženo</option>
              </NativeSelect>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="homeScore">Poeni ({match.homeTeam.name})</Label>
                <Input
                  id="homeScore"
                  name="homeScore"
                  type="number"
                  min={0}
                  defaultValue={match.homeScore ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="awayScore">Poeni ({match.awayTeam.name})</Label>
                <Input
                  id="awayScore"
                  name="awayScore"
                  type="number"
                  min={0}
                  defaultValue={match.awayScore ?? ""}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scoresheetUrl">Fotografija zapisnika</Label>
              <Input
                id="scoresheetUrl"
                name="scoresheetUrl"
                placeholder="/zapisnici/naziv-slike.jpg"
                defaultValue={match.scoresheetUrl ?? ""}
              />
            </div>
            <Button type="submit" className="w-full">
              Sačuvaj izmene
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-xl uppercase tracking-wide">
            Zapisnik — statistika po igraču
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={statsAction} className="space-y-6">
            {rosterSections.map((section) => (
              <div key={section.label} className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground">{section.label}</p>
                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Igrač</TableHead>
                        <TableHead className="w-20 text-center">Poeni</TableHead>
                        <TableHead className="w-20 text-center">Trojke</TableHead>
                        <TableHead className="w-20 text-center">Faulovi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {section.players.map((player) => {
                        const stat = statByPlayer.get(player.id);
                        return (
                          <TableRow key={player.id}>
                            <TableCell className="font-medium">{player.name}</TableCell>
                            <TableCell>
                              <Input
                                name={`points-${player.id}`}
                                aria-label={`Poeni — ${player.name}`}
                                type="number"
                                min={0}
                                defaultValue={stat?.points ?? 0}
                                className="h-8 text-center"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                name={`threes-${player.id}`}
                                aria-label={`Trojke — ${player.name}`}
                                type="number"
                                min={0}
                                defaultValue={stat?.threePointers ?? 0}
                                className="h-8 text-center"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                name={`fouls-${player.id}`}
                                aria-label={`Faulovi — ${player.name}`}
                                type="number"
                                min={0}
                                defaultValue={stat?.fouls ?? 0}
                                className="h-8 text-center"
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
            <Separator />
            <Button type="submit" className="w-full">
              Sačuvaj zapisnik
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
