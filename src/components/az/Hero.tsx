import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useIsTouch } from "./hooks";


const words = [
  { text: "Building", accent: false },
  { text: "stronger", accent: true },
  { text: "businesses.", accent: false },
];
const words2 = [
  { text: "Creating", accent: false },
  { text: "lasting", accent: false },
  { text: "value.", accent: false },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const touch = useIsTouch();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Weight morphs 200 -> 700 as scroll enters, and settles at 500 as it exits (heavier resting)
  const weight = useTransform(scrollYProgress, [0, 0.35, 1], [200, 700, 500]);

  // Skew: cursor-driven on desktop, scroll-linked fallback on touch
  const skew = useMotionValue(0);
  const sSkew = useSpring(skew, { stiffness: 150, damping: 20 });
  const scrollSkew = useTransform(scrollYProgress, [0, 0.5, 1], [-3, 0, 3]);
  useEffect(() => {
    if (prefersReduced || touch) return;
    const el = ref.current;
    if (!el) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
      skew.set(Math.max(-1, Math.min(1, nx * 2)) * 4);
    };
    const leave = () => skew.set(0);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [prefersReduced, touch, skew]);


  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden px-6 pt-32 pb-16 md:px-16 md:pt-40"
    >
      <motion.h1
        style={{ skewX: prefersReduced ? 0 : touch ? scrollSkew : sSkew }}
        className="w-full max-w-full break-words hyphens-auto pb-[0.15em] pr-2 font-display leading-[0.95] tracking-[-0.03em] text-[clamp(1.9rem,10.5vw,8.5rem)] md:max-w-[22ch] md:leading-[0.9]"
      >
        {[words, words2].map((row, ri) => (
          <span key={ri} className="block">
            {row.map((w, i) => (
              <HeroWord
                key={`${ri}-${i}`}
                text={w.text}
                accent={w.accent}
                index={ri * 3 + i}
                weight={weight}
                entered={entered}
                reduced={!!prefersReduced}
              />
            ))}
          </span>
        ))}
      </motion.h1>

      <div className="mt-10 min-h-[1.5rem]">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={entered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-mono text-xs tracking-[0.2em] text-[color:var(--color-muted-foreground)] uppercase"
        >
          [ Trusted UAE Advisory — 30+ Years of Experience ]
        </motion.p>
      </div>

      <div className="mt-10">
        <motion.a
          initial={{ opacity: 0, y: 10 }}
          animate={entered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          href="#contact"
          data-cursor="link"
          className="group inline-flex min-h-11 items-center font-display text-lg tracking-tight md:text-xl"
        >
          <span className="relative">
            Start a conversation
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[color:var(--color-ember)] transition-transform duration-500 ease-out group-hover:scale-x-100" />
          </span>
          <span className="ml-3 text-[color:var(--color-ember)] transition-transform duration-500 group-hover:translate-x-2">
            →
          </span>
        </motion.a>
      </div>

      <div className="mt-16 min-h-[3rem]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={entered ? { opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] tracking-[0.18em] text-[color:var(--color-muted-foreground)] uppercase md:text-xs"
        >
          <span>500+ Businesses Guided</span>
          <span aria-hidden>·</span>
          <span>30+ Years in the UAE Market</span>
          <span aria-hidden>·</span>
          <span>Backed by KAR Business Services</span>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute right-6 bottom-6 font-mono text-[10px] tracking-[0.2em] text-[color:var(--color-muted-foreground)] uppercase md:right-16">
        [ 01 / 06 ]
      </div>
    </section>
  );
}

function HeroWord({
  text,
  accent,
  index,
  weight,
  entered,
  reduced,
}: {
  text: string;
  accent: boolean;
  index: number;
  weight: ReturnType<typeof useTransform<number, number>>;
  entered: boolean;
  reduced: boolean;
}) {
  const delay = 0.15 + index * 0.07;
  const wghtStr = useTransform(weight, (v) => `"wght" ${Math.round(v)}`);
  const style = accent
    ? undefined
    : reduced
      ? { fontVariationSettings: `"wght" 500` }
      : ({ fontVariationSettings: wghtStr } as unknown as React.CSSProperties);
  return (
    <motion.span
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: "0.35em" }}
      animate={entered ? (reduced ? { opacity: 1 } : { opacity: 1, y: 0 }) : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      style={style}
      className={
        accent
          ? "font-serif italic text-[color:var(--color-ember)]"
          : "font-display"
      }
    >
      {text}
      {index !== 5 ? "\u00A0" : ""}
    </motion.span>
  );
}

