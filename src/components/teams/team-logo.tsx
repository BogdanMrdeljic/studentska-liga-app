import Image from "next/image";
import { cn } from "@/lib/utils";

type TeamLogoProps = {
  logoUrl: string | null;
  name: string;
  colorPrimary: string;
  colorSecondary: string;
  size?: number;
  className?: string;
};

export function TeamLogo({
  logoUrl,
  name,
  colorPrimary,
  colorSecondary,
  size = 40,
  className,
}: TeamLogoProps) {
  if (logoUrl) {
    return (
      <span
        className={cn(
          "relative inline-block shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-border",
          className
        )}
        style={{ width: size, height: size }}
      >
        <Image
          src={logoUrl}
          alt={`${name} logo`}
          fill
          sizes={`${size}px`}
          className="object-contain p-1"
          unoptimized={logoUrl.endsWith(".gif")}
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-heading font-bold",
        className
      )}
      style={{
        width: size,
        height: size,
        backgroundColor: colorPrimary,
        color: colorSecondary,
        fontSize: size * 0.35,
      }}
    >
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}
