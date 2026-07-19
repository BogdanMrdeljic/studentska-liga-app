"use client";

import { useActionState } from "react";
import { addComment } from "@/actions/comments";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function CommentForm({ postId }: { postId: string }) {
  const action = addComment.bind(null, postId);
  const [state, formAction, isPending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-2">
      <Textarea name="content" placeholder="Napiši komentar..." required rows={3} />
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={isPending} size="sm">
        {isPending ? "Slanje..." : "Pošalji komentar"}
      </Button>
    </form>
  );
}
