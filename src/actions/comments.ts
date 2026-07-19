"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type CommentState = { error?: string } | undefined;

export async function addComment(
  postId: string,
  _prevState: CommentState,
  formData: FormData
): Promise<CommentState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Moraš biti prijavljen da bi ostavio komentar." };
  }

  const content = String(formData.get("content") ?? "").trim();
  if (!content) {
    return { error: "Komentar ne može biti prazan." };
  }

  await prisma.comment.create({
    data: { content, postId, authorId: session.user.id },
  });

  revalidatePath(`/objave/${postId}`);
  return undefined;
}
