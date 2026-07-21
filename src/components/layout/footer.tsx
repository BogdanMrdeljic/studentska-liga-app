import Image from "next/image";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-gradient-to-b from-secondary/40 to-secondary/70">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Uz podršku naših sponzora
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <div className="relative h-10 w-20">
            <Image
              src="/sponsors/yettel.jpg"
              alt="Yettel"
              fill
              sizes="80px"
              className="rounded object-contain"
            />
          </div>
          <div className="relative h-10 w-32">
            <Image
              src="/sponsors/triglav.png"
              alt="Triglav osiguranje"
              fill
              sizes="128px"
              className="object-contain"
            />
          </div>
          <div className="relative h-10 w-14">
            <Image
              src="/sponsors/ardusport.jpg"
              alt="ArduSport"
              fill
              sizes="56px"
              className="object-contain"
            />
          </div>
          <div className="relative h-10 w-10">
            <Image
              src="/sponsors/aquaviva.png"
              alt="Aqua Viva"
              fill
              sizes="40px"
              className="object-contain"
            />
          </div>
        </div>

        <div className="mt-6 border-t pt-4 text-center text-sm text-muted-foreground">
          <span className="font-heading font-semibold uppercase tracking-wide text-foreground/80">
            Studentska Košarkaška Liga
          </span>
          <span className="mx-2 text-border">•</span>©{new Date().getFullYear()} · Napravljeno za
          studente, od studenata. Sva prava zadržana.
        </div>
      </div>
    </footer>
  );
}
