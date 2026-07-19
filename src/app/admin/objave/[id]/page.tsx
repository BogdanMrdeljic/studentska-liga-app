import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePost } from "@/actions/admin/posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, matches] = await Promise.all([
    prisma.post.findUnique({ where: { id } }),
    prisma.match.findMany({
      orderBy: { date: "desc" },
      include: { homeTeam: true, awayTeam: true },
    }),
  ]);
  if (!post) notFound();

  const action = updatePost.bind(null, id);

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-2xl uppercase tracking-wide">
            Izmeni objavu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Naslov</Label>
              <Input id="title" name="title" required defaultValue={post.title} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Sadržaj</Label>
              <Textarea id="content" name="content" required rows={5} defaultValue={post.content} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Slika (URL, opciono)</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                placeholder="/posts/naziv-slike.jpg"
                defaultValue={post.imageUrl ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="matchId">Promovisana utakmica (opciono)</Label>
              <NativeSelect id="matchId" name="matchId" defaultValue={post.matchId ?? ""}>
                <option value="">Bez utakmice</option>
                {matches.map((match) => (
                  <option key={match.id} value={match.id}>
                    {match.homeTeam.name} vs {match.awayTeam.name}
                  </option>
                ))}
              </NativeSelect>
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
