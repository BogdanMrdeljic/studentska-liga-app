import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getActiveSeason } from "@/lib/standings";
import { getPlayerSeasonStats } from "@/lib/player-stats";
import { updatePlayer } from "@/actions/admin/players";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PLAYER_POSITIONS } from "@/lib/positions";

export default async function EditPlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const season = await getActiveSeason();

  const [player, teams, statsMap] = await Promise.all([
    prisma.player.findUnique({ where: { id } }),
    prisma.team.findMany({ orderBy: { name: "asc" } }),
    season ? getPlayerSeasonStats(season.id, [id]) : Promise.resolve(new Map()),
  ]);

  if (!player) notFound();

  const stat = statsMap.get(id);
  const action = updatePlayer.bind(null, id);

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-2xl uppercase tracking-wide">
            Izmeni igrača
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ime i prezime</Label>
              <Input id="name" name="name" required defaultValue={player.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teamId">Ekipa</Label>
              <NativeSelect id="teamId" name="teamId" required defaultValue={player.teamId}>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="position">Pozicija</Label>
                <NativeSelect id="position" name="position" defaultValue={player.position ?? ""}>
                  <option value="">— Bez pozicije —</option>
                  {PLAYER_POSITIONS.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </NativeSelect>
              </div>
              <div className="space-y-2">
                <Label htmlFor="number">Broj</Label>
                <Input
                  id="number"
                  name="number"
                  type="number"
                  min={1}
                  max={99}
                  defaultValue={player.number ?? ""}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="indexNumber">Broj indeksa</Label>
              <Input
                id="indexNumber"
                name="indexNumber"
                placeholder="2026/0123"
                defaultValue={player.indexNumber ?? ""}
              />
            </div>

            <Button type="submit" className="w-full">
              Sačuvaj izmene
            </Button>
          </form>

          {season && (
            <>
              <Separator className="my-6" />
              <p className="mb-3 text-sm font-medium text-muted-foreground">
                Statistika za sezonu {season.name} (računa se automatski iz zapisnika
                utakmica — izmeni je preko zapisnika odigrane utakmice)
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Nastupi", value: stat?.appearances ?? 0 },
                  { label: "Poeni", value: stat?.points ?? 0 },
                  { label: "Trojke", value: stat?.threePointers ?? 0 },
                  { label: "Faulovi", value: stat?.fouls ?? 0 },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border bg-muted/40 p-3 text-center">
                    <p className="font-heading text-xl font-bold text-primary">{item.value}</p>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
