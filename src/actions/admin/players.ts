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

export async function updatePlayerWithStats(
  id: string,
  seasonId: string | null,
  formData: FormData
) {
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

  if (seasonId) {
    const appearances = Number(formData.get("appearances") ?? 0);
    const points = Number(formData.get("points") ?? 0);
    const threePointers = Number(formData.get("threePointers") ?? 0);
    const fouls = Number(formData.get("fouls") ?? 0);

    await prisma.playerStat.upsert({
      where: { playerId_seasonId: { playerId: id, seasonId } },
      update: { appearances, points, threePointers, fouls },
      create: { playerId: id, seasonId, appearances, points, threePointers, fouls },
    });
  }

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
