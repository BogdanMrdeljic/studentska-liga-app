import Image from "next/image";
import Link from "next/link";
import { FileText } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { TeamLogo } from "@/components/teams/team-logo";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MatchStatus } from "@/generated/prisma/enums";

const statusLabel: Record<MatchStatus, string> = {
  SCHEDULED: "Zakazano",
  FINISHED: "Odigrano",
  POSTPONED: "Odloženo",
};

const statusVariant: Record<MatchStatus, "success" | "destructive" | "outline"> = {
  SCHEDULED: "outline",
  FINISHED: "success",
  POSTPONED: "destructive",
};

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      homeTeam: true,
      awayTeam: true,
      playerStats: {
        include: { player: true },
        orderBy: { player: { number: "asc" } },
      },
    },
  });
  if (!match) notFound();

  const homeStats = match.playerStats.filter((s) => s.player.teamId === match.homeTeamId);
  const awayStats = match.playerStats.filter((s) => s.player.teamId === match.awayTeamId);

  const boxScoreSections = [
    { label: match.homeTeam.name, stats: homeStats },
    { label: match.awayTeam.name, stats: awayStats },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-col items-center gap-4 rounded-lg border bg-card p-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <Link
          href={`/ekipe/${match.homeTeam.id}`}
          className="flex flex-1 flex-col items-center gap-2 hover:underline sm:items-start"
        >
          <TeamLogo
            logoUrl={match.homeTeam.logoUrl}
            name={match.homeTeam.name}
            colorPrimary={match.homeTeam.colorPrimary}
            colorSecondary={match.homeTeam.colorSecondary}
            size={56}
          />
          <span className="font-heading font-bold uppercase tracking-wide">
            {match.homeTeam.name}
          </span>
        </Link>

        <div className="flex shrink-0 flex-col items-center gap-2">
          {match.status === "FINISHED" ? (
            <span className="font-heading text-3xl font-bold tabular-nums">
              {match.homeScore} <span className="text-muted-foreground">:</span> {match.awayScore}
            </span>
          ) : (
            <span className="text-sm font-medium text-muted-foreground">
              {formatDate(match.date)}
            </span>
          )}
          <Badge variant={statusVariant[match.status]}>{statusLabel[match.status]}</Badge>
          <p className="text-xs text-muted-foreground">
            {formatDate(match.date)}
            {match.venue ? ` · ${match.venue}` : ""}
          </p>
        </div>

        <Link
          href={`/ekipe/${match.awayTeam.id}`}
          className="flex flex-1 flex-col items-center gap-2 hover:underline sm:items-end"
        >
          <TeamLogo
            logoUrl={match.awayTeam.logoUrl}
            name={match.awayTeam.name}
            colorPrimary={match.awayTeam.colorPrimary}
            colorSecondary={match.awayTeam.colorSecondary}
            size={56}
          />
          <span className="font-heading font-bold uppercase tracking-wide">
            {match.awayTeam.name}
          </span>
        </Link>
      </div>

      {match.scoresheetUrl && (
        <>
          {match.scoresheetUrl.toLowerCase().endsWith(".pdf") ? (
            <a
              href={match.scoresheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto mt-6 flex w-full max-w-md items-center gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-muted"
            >
              <FileText className="size-8 shrink-0 text-primary" />
              <div>
                <p className="font-medium">Zapisnik utakmice</p>
                <p className="text-sm text-muted-foreground">Otvori PDF dokument</p>
              </div>
            </a>
          ) : (
            <div className="relative mx-auto mt-6 aspect-[3/4] w-full max-w-md overflow-hidden rounded-lg bg-muted">
              <Image
                src={match.scoresheetUrl}
                alt={`Zapisnik: ${match.homeTeam.name} - ${match.awayTeam.name}`}
                fill
                sizes="(max-width: 640px) 100vw, 448px"
                className="object-contain"
              />
            </div>
          )}
        </>
      )}

      <div className="mt-10 space-y-8">
        {match.playerStats.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Detalji utakmice (statistika po igraču) još nisu uneti.
          </p>
        ) : (
          boxScoreSections.map((section) => (
            <div key={section.label}>
              <h2 className="mb-3 font-heading text-lg font-semibold uppercase tracking-wide">
                {section.label}
              </h2>
              {section.stats.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nema unetih podataka.</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/60 hover:bg-muted/60">
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Igrač
                        </TableHead>
                        <TableHead className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Poeni
                        </TableHead>
                        <TableHead className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Trojke
                        </TableHead>
                        <TableHead className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Faulovi
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {section.stats.map((stat) => (
                        <TableRow key={stat.id}>
                          <TableCell>
                            <Link
                              href={`/igraci/${stat.player.id}`}
                              className="font-medium hover:underline"
                            >
                              {stat.player.name}
                            </Link>
                          </TableCell>
                          <TableCell className="text-center text-lg font-bold tabular-nums text-primary">
                            {stat.points}
                          </TableCell>
                          <TableCell className="text-center tabular-nums">
                            {stat.threePointers}
                          </TableCell>
                          <TableCell className="text-center tabular-nums">{stat.fouls}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
