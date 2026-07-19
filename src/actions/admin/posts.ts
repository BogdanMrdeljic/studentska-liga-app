"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function createPost(formData: FormData) {
  const session = await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const matchId = String(formData.get("matchId") ?? "") || null;
  if (!title || !content) throw new Error("Naslov i sadržaj su obavezni.");

  await prisma.post.create({
    data: { title, content, matchId, authorId: session.user.id },
  });
  revalidatePath("/admin/objave");
  revalidatePath("/objave");
  revalidatePath("/");
  redirect("/admin/objave");
}

export async function updatePost(id: string, formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const matchId = String(formData.get("matchId") ?? "") || null;
  if (!title || !content) throw new Error("Naslov i sadržaj su obavezni.");

  await prisma.post.update({ where: { id }, data: { title, content, matchId } });
  revalidatePath("/admin/objave");
  revalidatePath(`/objave/${id}`);
  revalidatePath("/objave");
  redirect("/admin/objave");
}

export async function deletePost(id: string) {
  await requireAdmin();
  await prisma.post.delete({ where: { id } });
  revalidatePath("/admin/objave");
  revalidatePath("/objave");
}
