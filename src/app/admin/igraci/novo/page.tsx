import { prisma } from "@/lib/prisma";
import { createPlayer } from "@/actions/admin/players";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NoviIgracPage() {
  const teams = await prisma.team.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-2xl uppercase tracking-wide">
            Novi igrač
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPlayer} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ime i prezime</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teamId">Ekipa</Label>
              <NativeSelect id="teamId" name="teamId" required defaultValue="">
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Pozicija</Label>
                <Input id="position" name="position" placeholder="Napadač" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="number">Broj</Label>
                <Input id="number" name="number" type="number" min={1} max={99} />
              </div>
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
