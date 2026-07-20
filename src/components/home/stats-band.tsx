"use client";

import { useEffect, useRef, useState } from "react";

type Stat = { label: string; value: number };

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frame: number;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = prefersReducedMotion ? 1 : Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return value;
}

function StatTile({ stat, active }: { stat: Stat; active: boolean }) {
  const value = useCountUp(stat.value, active);
  return (
    <div className="text-center">
      <p className="font-heading text-4xl font-bold tabular-nums text-accent sm:text-5xl">
        {value.toLocaleString("sr-RS")}
      </p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-background/70">
        {stat.label}
      </p>
    </div>
  );
}

export function StatsBand({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="bg-foreground py-10">
      <div className="mx-auto grid max-w-sm grid-cols-2 gap-6 px-4">
        {stats.map((stat) => (
          <StatTile key={stat.label} stat={stat} active={active} />
        ))}
      </div>
    </div>
  );
}
