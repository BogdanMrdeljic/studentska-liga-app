import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateMatch } from "@/actions/admin/matches";
import { toDatetimeLocalValue } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditMatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const match = await prisma.match.findUnique({
    where: { id },
    include: { homeTeam: true, awayTeam: true },
  });
  if (!match) notFound();

  const action = updateMatch.bind(null, id);

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
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
            <div className="grid grid-cols-2 gap-4">
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
            <Button type="submit" className="w-full">
              Sačuvaj izmene
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
