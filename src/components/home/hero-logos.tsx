import Image from "next/image";

type Team = { id: string; name: string; logoUrl: string | null };

const layout = [
  { top: "8%", left: "5%", size: 90, rotate: -8 },
  { top: "66%", left: "9%", size: 64, rotate: 10 },
  { top: "12%", left: "87%", size: 100, rotate: 12 },
  { top: "70%", left: "91%", size: 72, rotate: -10 },
  { top: "40%", left: "95%", size: 56, rotate: 6 },
  { top: "86%", left: "32%", size: 60, rotate: -6 },
  { top: "2%", left: "46%", size: 52, rotate: 8 },
  { top: "78%", left: "62%", size: 70, rotate: -4 },
] as const;

export function HeroLogos({ teams }: { teams: Team[] }) {
  const withLogo = teams.filter((t) => t.logoUrl).slice(0, layout.length);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {withLogo.map((team, i) => {
        const spot = layout[i];
        return (
          <div
            key={team.id}
            className="absolute opacity-[0.14] brightness-[3] grayscale"
            style={{
              top: spot.top,
              left: spot.left,
              width: spot.size,
              height: spot.size,
              transform: `rotate(${spot.rotate}deg)`,
            }}
          >
            <Image
              src={team.logoUrl!}
              alt=""
              fill
              sizes={`${spot.size}px`}
              className="object-contain"
              unoptimized={team.logoUrl!.endsWith(".gif")}
            />
          </div>
        );
      })}
    </div>
  );
}
