import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-gradient-to-b from-secondary/40 to-secondary/70">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Uz podršku
        </p>
        <div className="flex flex-col items-center gap-1">
          <div className="relative h-10 w-32">
            <Image
              src="/sponsors/triglav.png"
              alt="Triglav osiguranje"
              fill
              sizes="128px"
              className="object-contain"
            />
          </div>
          <span className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">
            Sponzor
          </span>
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
