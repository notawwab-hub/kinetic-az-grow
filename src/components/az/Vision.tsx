import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const line =
  "We're evolving into a strategic investment and business transformation platform — deploying capital through joint ventures, growth equity, acquisitions, and corporate revival projects.";

export function Vision() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section
      id="vision"
      className="relative flex w-full flex-col justify-center overflow-hidden px-6 py-24 md:min-h-[130vh] md:px-16 md:py-32"
      suppressHydrationWarning
    >
      <div className="mb-12 flex items-baseline justify-between">
        <span className="font-mono text-xs tracking-[0.2em] text-[color:var(--color-muted-foreground)] uppercase">
          [ Our Vision ]
        </span>
        <span className="hidden font-mono text-xs tracking-[0.2em] text-[color:var(--color-muted-foreground)] uppercase md:inline">
          [ 06 / 06 ]
        </span>
      </div>
      {mounted ? (
        <VisionAnimated />
      ) : (
        <h2
          suppressHydrationWarning
          className="mx-auto max-w-6xl text-center font-display leading-[1.05] tracking-[-0.02em] text-[clamp(1.5rem,4.2vw,3.75rem)] opacity-0"
        >
          {line}
        </h2>
      )}
    </section>
  );
}

function VisionAnimated() {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const seeds = useMemo(() => {
    const rand = (n: number) => {
      const x = Math.sin(n * 9301 + 49297) * 233280;
      return x - Math.floor(x);
    };
    return Array.from(line).map((_, i) => ({
      x: (rand(i + 1) - 0.5) * 2000,
      y: (rand(i + 101) - 0.5) * 1200,
      r: (rand(i + 201) - 0.5) * 90,
    }));
  }, []);

  return (
    <h2
      ref={ref}
      className="mx-auto max-w-6xl text-center font-display leading-[1.05] tracking-[-0.02em] text-[clamp(1.5rem,4.2vw,3.75rem)]"
    >
      {reduced ? (
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          {line}
        </motion.span>
      ) : (
        Array.from(line).map((ch, i) => (
          <Char key={i} ch={ch} seed={seeds[i]} progress={scrollYProgress} />
        ))
      )}
    </h2>
  );
}

function Char({
  ch,
  seed,
  progress,
}: {
  ch: string;
  seed: { x: number; y: number; r: number };
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const x = useTransform(progress, [0, 1], [seed.x, 0]);
  const y = useTransform(progress, [0, 1], [seed.y, 0]);
  const rotate = useTransform(progress, [0, 1], [seed.r, 0]);
  const opacity = useTransform(progress, [0, 0.15, 1], [0, 1, 1]);
  if (ch === " ") return <span>&nbsp;</span>;
  return (
    <motion.span
      style={{ x, y, rotate, opacity, display: "inline-block" }}
      className="will-change-transform"
    >
      {ch}
    </motion.span>
  );
}
