import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { MatchCard } from "@/components/matches/match-card";
import { CommentList } from "@/components/posts/comment-list";
import { CommentForm } from "@/components/posts/comment-form";
import { Button } from "@/components/ui/button";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
      match: { include: { homeTeam: true, awayTeam: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: { author: true },
      },
    },
  });

  if (!post) notFound();

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <h1 className="font-heading text-3xl font-bold uppercase tracking-wide">{post.title}</h1>
        {isAdmin && (
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            nativeButton={false}
            render={<Link href={`/admin/objave/${post.id}`} />}
          >
            Izmeni objavu
          </Button>
        )}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {post.author.name} · {formatDate(post.createdAt)}
      </p>

      {post.imageUrl && (
        <div className="relative mx-auto mt-6 aspect-[4/5] w-full max-w-md overflow-hidden rounded-lg bg-muted sm:max-w-lg">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, 512px"
            className="object-contain"
            priority
          />
        </div>
      )}

      <p className="mt-6 whitespace-pre-wrap leading-relaxed">{post.content}</p>

      {post.match && (
        <div className="mt-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Promovisana utakmica
          </p>
          <MatchCard match={post.match} />
        </div>
      )}

      <div className="mt-10 border-t pt-6">
        <h2 className="mb-4 font-heading text-xl font-semibold uppercase tracking-wide">
          Komentari ({post.comments.length})
        </h2>

        <CommentList comments={post.comments} />

        <div className="mt-6">
          {session?.user ? (
            <CommentForm postId={post.id} />
          ) : (
            <p className="text-sm text-muted-foreground">
              <Link href={`/prijava?callbackUrl=/objave/${post.id}`} className="text-primary hover:underline">
                Prijavi se
              </Link>{" "}
              da bi ostavio komentar.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
