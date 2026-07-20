import Image from "next/image";

export function SponsorBar() {
  return (
    <div className="border-b bg-secondary/60">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4 py-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Generalni sponzor lige
        </span>
        <div className="relative h-8 w-16 overflow-hidden rounded-md shadow-sm">
          <Image
            src="/sponsors/yettel.jpg"
            alt="Yettel"
            fill
            sizes="64px"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
