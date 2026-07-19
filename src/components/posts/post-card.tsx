import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateShort } from "@/lib/format";

type PostCardProps = {
  post: {
    id: string;
    title: string;
    content: string;
    imageUrl: string | null;
    createdAt: Date;
    author: { name: string };
    commentCount: number;
  };
};

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/objave/${post.id}`}>
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        {post.imageUrl && (
          <div className="relative aspect-[4/5] w-full bg-muted">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-contain"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="font-heading text-xl">{post.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {post.author.name} · {formatDateShort(post.createdAt)}
          </p>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 text-sm text-muted-foreground">{post.content}</p>
          <p className="mt-3 text-sm font-medium text-primary">{post.commentCount} komentara</p>
        </CardContent>
      </Card>
    </Link>
  );
}
