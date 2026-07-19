import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateShort } from "@/lib/format";

type PostCardProps = {
  post: {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    author: { name: string };
    commentCount: number;
  };
};

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/objave/${post.id}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
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
