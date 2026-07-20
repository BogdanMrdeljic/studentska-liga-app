"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import type { MatchStatus } from "@/generated/prisma/enums";

export async function createMatch(formData: FormData) {
  await requireAdmin();
  const seasonId = String(formData.get("seasonId") ?? "");
  const homeTeamId = String(formData.get("homeTeamId") ?? "");
  const awayTeamId = String(formData.get("awayTeamId") ?? "");
  const dateStr = String(formData.get("date") ?? "");
  const venue = String(formData.get("venue") ?? "").trim() || null;
  if (!seasonId || !homeTeamId || !awayTeamId || !dateStr) {
    throw new Error("Popuni sva obavezna polja.");
  }
  if (homeTeamId === awayTeamId) {
    throw new Error("Ekipa ne može igrati sama protiv sebe.");
  }

  await prisma.match.create({
    data: {
      seasonId,
      homeTeamId,
      awayTeamId,
      date: new Date(dateStr),
      venue,
      status: "SCHEDULED",
    },
  });
  revalidatePath("/admin/utakmice");
  revalidatePath("/raspored");
  revalidatePath("/");
  redirect("/admin/utakmice");
}

export async function updateMatch(id: string, formData: FormData) {
  await requireAdmin();
  const dateStr = String(formData.get("date") ?? "");
  const venue = String(formData.get("venue") ?? "").trim() || null;
  const status = String(formData.get("status") ?? "SCHEDULED") as MatchStatus;
  const homeScoreRaw = String(formData.get("homeScore") ?? "").trim();
  const awayScoreRaw = String(formData.get("awayScore") ?? "").trim();
  const scoresheetUrl = String(formData.get("scoresheetUrl") ?? "").trim() || null;
  if (!dateStr) throw new Error("Datum je obavezan.");

  await prisma.match.update({
    where: { id },
    data: {
      date: new Date(dateStr),
      venue,
      status,
      homeScore: homeScoreRaw ? Number(homeScoreRaw) : null,
      awayScore: awayScoreRaw ? Number(awayScoreRaw) : null,
      scoresheetUrl,
    },
  });

  revalidatePath("/admin/utakmice");
  revalidatePath(`/admin/utakmice/${id}`);
  revalidatePath(`/utakmice/${id}`);
  revalidatePath("/raspored");
  revalidatePath("/tabela");
  revalidatePath("/");
  redirect("/admin/utakmice");
}

export async function updateMatchStats(matchId: string, playerIds: string[], formData: FormData) {
  await requireAdmin();

  await prisma.$transaction(
    playerIds.map((playerId) => {
      const points = Number(formData.get(`points-${playerId}`) ?? 0);
      const threePointers = Number(formData.get(`threes-${playerId}`) ?? 0);
      const fouls = Number(formData.get(`fouls-${playerId}`) ?? 0);
      return prisma.matchPlayerStat.upsert({
        where: { matchId_playerId: { matchId, playerId } },
        update: { points, threePointers, fouls },
        create: { matchId, playerId, points, threePointers, fouls },
      });
    })
  );

  revalidatePath(`/admin/utakmice/${matchId}`);
  revalidatePath(`/utakmice/${matchId}`);
  redirect(`/admin/utakmice/${matchId}`);
}

export async function deleteMatch(id: string) {
  await requireAdmin();
  await prisma.match.delete({ where: { id } });
  revalidatePath("/admin/utakmice");
  revalidatePath("/raspored");
  revalidatePath("/tabela");
}
