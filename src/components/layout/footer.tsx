const sponsors = [
  { name: "Yettel", label: "Generalni sponzor", color: "#5C1F8C", size: "text-2xl" },
  { name: "Triglav", label: "Sponzor", color: "#00693C", size: "text-base" },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-gradient-to-b from-secondary/40 to-secondary/70">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Uz podršku
        </p>
        <div className="flex flex-wrap items-end justify-center gap-x-10 gap-y-4">
          {sponsors.map((sponsor) => (
            <div key={sponsor.name} className="flex flex-col items-center gap-1">
              <span
                className={`font-heading font-bold uppercase tracking-wide ${sponsor.size}`}
                style={{ color: sponsor.color }}
              >
                {sponsor.name}
              </span>
              <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                {sponsor.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4 text-center text-sm text-muted-foreground">
          <span className="font-heading font-semibold uppercase tracking-wide text-foreground/80">
            Studentska Košarkaška Liga
          </span>
          <span className="mx-2 text-border">•</span>©{new Date().getFullYear()} · Napravljeno za
          studente, od studenata.
        </div>
      </div>
    </footer>
  );
}
