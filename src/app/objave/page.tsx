import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/posts/post-card";

export default async function ObjavePage() {
  const postsRaw = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true, _count: { select: { comments: true } } },
  });
  const posts = postsRaw.map((p) => ({ ...p, commentCount: p._count.comments }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-heading text-3xl font-bold uppercase tracking-wide">Objave</h1>
      <p className="mt-1 text-muted-foreground">Promocije i najave utakmica studentske lige.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.length === 0 ? (
          <p className="text-muted-foreground">Još nema objava.</p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
