import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const lines = [
  "Suboptimal Systems",
  "Weak Core Operations",
  "Lack of Strategy",
  "Weak Market Positioning",
  "Inefficient Processes",
  "Inability to Scale",
];

export function Challenges() {
  return (
    <section id="challenges" className="relative w-full px-6 py-32 md:px-16 md:py-48">
      <div className="mb-16 flex items-baseline justify-between">
        <h2 className="font-display text-[clamp(2rem,6vw,4.5rem)] leading-[0.95] tracking-[-0.03em]">
          The Challenges<br />We Solve.
        </h2>
        <span className="hidden font-mono text-xs tracking-[0.2em] text-[color:var(--color-muted-foreground)] uppercase md:inline">
          [ 02 / 06 ]
        </span>
      </div>
      <div className="mx-auto flex max-w-5xl flex-col gap-8 md:gap-14">
        {lines.map((l, i) => (
          <ChallengeLine key={l} text={l} index={i} />
        ))}
      </div>
    </section>
  );
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*<>?/";

function ChallengeLine({ text, index }: { text: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // 0 before entering, 0.5 centered, 1 leaving
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.35, 0.5, 0.65, 1],
    [0, 0.2, 1, 0.2, 0.2],
  );
  const scale = useTransform(scrollYProgress, [0.35, 0.5, 0.65], [0.96, 1, 0.96]);

  const [display, setDisplay] = useState(reduced ? text : text.replace(/[a-zA-Z]/g, " "));
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (reduced) {
      setDisplay(text);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !revealed) {
            setRevealed(true);
            const total = 500;
            const start = performance.now();
            const timer = setInterval(() => {
              const t = Math.min(1, (performance.now() - start) / total);
              const revealCount = Math.floor(text.length * t);
              let out = "";
              for (let i = 0; i < text.length; i++) {
                if (i < revealCount || text[i] === " ") {
                  out += text[i];
                } else {
                  out += CHARS[Math.floor(Math.random() * CHARS.length)];
                }
              }
              setDisplay(out);
              if (t >= 1) {
                setDisplay(text);
                clearInterval(timer);
              }
            }, 40);
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [text, revealed, reduced]);

  return (
    <motion.div
      ref={ref}
      style={reduced ? undefined : { opacity, scale }}
      className="font-display text-[clamp(1.75rem,6.5vw,5rem)] leading-[1] tracking-[-0.03em]"
    >
      <span className="font-mono mr-4 align-middle text-[10px] tracking-[0.2em] text-[color:var(--color-ember)]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="tabular-nums">{display}</span>
    </motion.div>
  );
}
