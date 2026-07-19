import { formatDate } from "@/lib/format";

type CommentListProps = {
  comments: {
    id: string;
    content: string;
    createdAt: Date;
    author: { name: string };
  }[];
};

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return <p className="text-sm text-muted-foreground">Još nema komentara. Budi prvi!</p>;
  }

  return (
    <ul className="space-y-3">
      {comments.map((comment) => (
        <li key={comment.id} className="rounded-lg border bg-card p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">{comment.author.name}</span>
            <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
          </div>
          <p className="mt-1 text-sm">{comment.content}</p>
        </li>
      ))}
    </ul>
  );
}
