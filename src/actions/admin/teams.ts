"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function createTeam(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim() || null;
  const colorPrimary = String(formData.get("colorPrimary") ?? "#1d4ed8");
  const colorSecondary = String(formData.get("colorSecondary") ?? "#facc15");
  if (!name) throw new Error("Ime ekipe je obavezno.");

  await prisma.team.create({ data: { name, city, colorPrimary, colorSecondary } });
  revalidatePath("/admin/ekipe");
  revalidatePath("/ekipe");
  redirect("/admin/ekipe");
}

export async function updateTeam(id: string, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim() || null;
  const colorPrimary = String(formData.get("colorPrimary") ?? "#1d4ed8");
  const colorSecondary = String(formData.get("colorSecondary") ?? "#facc15");
  if (!name) throw new Error("Ime ekipe je obavezno.");

  await prisma.team.update({
    where: { id },
    data: { name, city, colorPrimary, colorSecondary },
  });
  revalidatePath("/admin/ekipe");
  revalidatePath(`/ekipe/${id}`);
  revalidatePath("/ekipe");
  redirect("/admin/ekipe");
}

export async function deleteTeam(id: string) {
  await requireAdmin();
  await prisma.team.delete({ where: { id } });
  revalidatePath("/admin/ekipe");
  revalidatePath("/ekipe");
}
