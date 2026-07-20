import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getActiveSeason } from "@/lib/standings";
import { updatePlayerWithStats } from "@/actions/admin/players";
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

  const [player, teams] = await Promise.all([
    prisma.player.findUnique({
      where: { id },
      include: { stats: { where: season ? { seasonId: season.id } : undefined } },
    }),
    prisma.team.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!player) notFound();

  const stat = player.stats[0];
  const action = updatePlayerWithStats.bind(null, id, season?.id ?? null);

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

            {season && (
              <>
                <Separator />
                <p className="text-sm font-medium text-muted-foreground">
                  Statistika za sezonu {season.name}
                </p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="appearances">Nastupi</Label>
                    <Input
                      id="appearances"
                      name="appearances"
                      type="number"
                      min={0}
                      defaultValue={stat?.appearances ?? 0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="points">Poeni</Label>
                    <Input
                      id="points"
                      name="points"
                      type="number"
                      min={0}
                      defaultValue={stat?.points ?? 0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rebounds">Skokovi</Label>
                    <Input
                      id="rebounds"
                      name="rebounds"
                      type="number"
                      min={0}
                      defaultValue={stat?.rebounds ?? 0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assists">Asistencije</Label>
                    <Input
                      id="assists"
                      name="assists"
                      type="number"
                      min={0}
                      defaultValue={stat?.assists ?? 0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="steals">Ukradene lopte</Label>
                    <Input
                      id="steals"
                      name="steals"
                      type="number"
                      min={0}
                      defaultValue={stat?.steals ?? 0}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blocks">Blokade</Label>
                    <Input
                      id="blocks"
                      name="blocks"
                      type="number"
                      min={0}
                      defaultValue={stat?.blocks ?? 0}
                    />
                  </div>
                </div>
              </>
            )}

            <Button type="submit" className="w-full">
              Sačuvaj izmene
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
