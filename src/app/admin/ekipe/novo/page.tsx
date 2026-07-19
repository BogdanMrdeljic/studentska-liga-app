import { createTeam } from "@/actions/admin/teams";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NovaEkipaPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-2xl uppercase tracking-wide">
            Nova ekipa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createTeam} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ime ekipe</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Grad</Label>
              <Input id="city" name="city" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="colorPrimary">Primarna boja</Label>
                <Input id="colorPrimary" name="colorPrimary" type="color" defaultValue="#1d4ed8" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="colorSecondary">Sekundarna boja</Label>
                <Input
                  id="colorSecondary"
                  name="colorSecondary"
                  type="color"
                  defaultValue="#facc15"
                />
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
