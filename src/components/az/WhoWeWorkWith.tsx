import { useEffect, useRef, useState } from "react";

const items = [
  "Forward-Thinking SME Owners",
  "High-Growth Entrepreneurs",
  "Family-Owned Conglomerates",
  "Regional Trading & Logistics Companies",
  "Scalable Service Enterprises",
  "Corporations Organizing For Market Expansion",
];

export function WhoWeWorkWith() {
  return (
    <section className="relative w-full overflow-hidden py-32 md:py-48">
      <div className="mb-12 flex items-baseline justify-between px-6 md:px-16">
        <h2 className="font-display text-[clamp(2rem,6vw,4.5rem)] leading-[0.95] tracking-[-0.03em]">
          Who We Work With.
        </h2>
        <span className="hidden font-mono text-xs tracking-[0.2em] text-[color:var(--color-muted-foreground)] uppercase md:inline">
          [ 05 / 06 ]
        </span>
      </div>
      <Marquee direction="left" speed={55} />
      <div className="h-4 md:h-6" />
      <Marquee direction="right" speed={50} />
    </section>
  );
}

function Marquee({ direction, speed }: { direction: "left" | "right"; speed: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const offsetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const widthRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    // Measure half-width (content is duplicated so loop is width/2)
    const measure = () => {
      widthRef.current = track.scrollWidth / 2;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    const pxPerSec = widthRef.current / speed;

    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      if (!paused && widthRef.current > 0) {
        const delta = pxPerSec * dt * (direction === "left" ? -1 : 1);
        offsetRef.current += delta;
        // wrap
        if (offsetRef.current <= -widthRef.current) offsetRef.current += widthRef.current;
        if (offsetRef.current >= 0 && direction === "right")
          offsetRef.current -= widthRef.current;
        track.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      lastTsRef.current = null;
    };
  }, [direction, speed, paused]);

  const content = [...items, ...items, ...items];

  return (
    <div
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      className="w-full overflow-hidden"
    >
      <div
        ref={trackRef}
        className="flex w-max whitespace-nowrap will-change-transform"
        style={{ transform: "translate3d(0,0,0)" }}
      >
        {[...content, ...content].map((t, i) => (
          <span
            key={i}
            className="text-stroke inline-block px-6 font-display leading-[1] tracking-[-0.02em] text-[clamp(2.5rem,9vw,7rem)]"
          >
            {t}
            <span aria-hidden className="mx-6 text-[color:var(--color-ember)]">
              ✳
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
