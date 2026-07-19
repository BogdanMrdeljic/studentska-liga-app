import { prisma } from "@/lib/prisma";
import { createMatch } from "@/actions/admin/matches";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NovaUtakmicaPage() {
  const [teams, seasons] = await Promise.all([
    prisma.team.findMany({ orderBy: { name: "asc" } }),
    prisma.season.findMany({ orderBy: { name: "desc" } }),
  ]);

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-2xl uppercase tracking-wide">
            Nova utakmica
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createMatch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seasonId">Sezona</Label>
              <NativeSelect id="seasonId" name="seasonId" required defaultValue="">
                <option value="" disabled>
                  Izaberi sezonu
                </option>
                {seasons.map((season) => (
                  <option key={season.id} value={season.id}>
                    {season.name}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="homeTeamId">Domaćin</Label>
                <NativeSelect id="homeTeamId" name="homeTeamId" required defaultValue="">
                  <option value="" disabled>
                    Izaberi ekipu
                  </option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div className="space-y-2">
                <Label htmlFor="awayTeamId">Gost</Label>
                <NativeSelect id="awayTeamId" name="awayTeamId" required defaultValue="">
                  <option value="" disabled>
                    Izaberi ekipu
                  </option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </NativeSelect>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Datum i vreme</Label>
              <Input id="date" name="date" type="datetime-local" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue">Mesto</Label>
              <Input id="venue" name="venue" placeholder="Studentski sportski centar" />
            </div>
            <Button type="submit" className="w-full">
              Sačuvaj
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
