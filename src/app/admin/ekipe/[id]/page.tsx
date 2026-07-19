import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateTeam } from "@/actions/admin/teams";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditTeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const team = await prisma.team.findUnique({ where: { id } });
  if (!team) notFound();

  const action = updateTeam.bind(null, id);

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-2xl uppercase tracking-wide">
            Izmeni ekipu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ime ekipe</Label>
              <Input id="name" name="name" required defaultValue={team.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Grad</Label>
              <Input id="city" name="city" defaultValue={team.city ?? ""} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="colorPrimary">Primarna boja</Label>
                <Input
                  id="colorPrimary"
                  name="colorPrimary"
                  type="color"
                  defaultValue={team.colorPrimary}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="colorSecondary">Sekundarna boja</Label>
                <Input
                  id="colorSecondary"
                  name="colorSecondary"
                  type="color"
                  defaultValue={team.colorSecondary}
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
