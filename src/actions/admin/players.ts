"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function createPlayer(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const position = String(formData.get("position") ?? "").trim() || null;
  const numberRaw = String(formData.get("number") ?? "").trim();
  const number = numberRaw ? Number(numberRaw) : null;
  const indexNumber = String(formData.get("indexNumber") ?? "").trim() || null;
  const teamId = String(formData.get("teamId") ?? "");
  if (!name || !teamId) throw new Error("Ime i ekipa su obavezni.");

  await prisma.player.create({ data: { name, position, number, indexNumber, teamId } });
  revalidatePath("/admin/igraci");
  revalidatePath(`/ekipe/${teamId}`);
  redirect("/admin/igraci");
}

export async function updatePlayer(id: string, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const position = String(formData.get("position") ?? "").trim() || null;
  const numberRaw = String(formData.get("number") ?? "").trim();
  const number = numberRaw ? Number(numberRaw) : null;
  const indexNumber = String(formData.get("indexNumber") ?? "").trim() || null;
  const teamId = String(formData.get("teamId") ?? "");
  if (!name || !teamId) throw new Error("Ime i ekipa su obavezni.");

  await prisma.player.update({
    where: { id },
    data: { name, position, number, indexNumber, teamId },
  });

  revalidatePath("/admin/igraci");
  revalidatePath(`/igraci/${id}`);
  revalidatePath(`/ekipe/${teamId}`);
  redirect("/admin/igraci");
}

export async function deletePlayer(id: string) {
  await requireAdmin();
  await prisma.player.delete({ where: { id } });
  revalidatePath("/admin/igraci");
  revalidatePath("/ekipe");
}
