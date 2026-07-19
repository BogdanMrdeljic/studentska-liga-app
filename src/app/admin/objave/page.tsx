import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePost } from "@/actions/admin/posts";
import { formatDateShort } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminObjavePage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true, _count: { select: { comments: true } } },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold uppercase tracking-wide">Objave</h1>
        <Button nativeButton={false} render={<Link href="/admin/objave/nova" />}>
          + Nova objava
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Naslov</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Datum</TableHead>
              <TableHead>Komentari</TableHead>
              <TableHead className="text-right">Akcije</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell className="text-muted-foreground">{post.author.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDateShort(post.createdAt)}
                </TableCell>
                <TableCell>{post._count.comments}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={<Link href={`/admin/objave/${post.id}`} />}
                  >
                    Izmeni
                  </Button>
                  <DeleteButton action={deletePost.bind(null, post.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
