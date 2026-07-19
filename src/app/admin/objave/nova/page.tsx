import { prisma } from "@/lib/prisma";
import { createPost } from "@/actions/admin/posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NovaObjavaPage() {
  const matches = await prisma.match.findMany({
    orderBy: { date: "desc" },
    include: { homeTeam: true, awayTeam: true },
  });

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-2xl uppercase tracking-wide">
            Nova objava
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPost} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Naslov</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Sadržaj</Label>
              <Textarea id="content" name="content" required rows={5} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="matchId">Promovisana utakmica (opciono)</Label>
              <NativeSelect id="matchId" name="matchId" defaultValue="">
                <option value="">Bez utakmice</option>
                {matches.map((match) => (
                  <option key={match.id} value={match.id}>
                    {match.homeTeam.name} vs {match.awayTeam.name}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <Button type="submit" className="w-full">
              Objavi
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
