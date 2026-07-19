import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { useIsTouch } from "./hooks";

const steps = [
  { n: "01", label: "Deep-Dive Analysis" },
  { n: "02", label: "Problem Isolation" },
  { n: "03", label: "Recovery Roadmap" },
  { n: "04", label: "Supported Execution" },
  { n: "05", label: "Continuous Improvement" },
];

export function Process() {
  const touch = useIsTouch();
  if (touch) return <ProcessMobile />;
  return <ProcessDesktop />;
}

function ProcessDesktop() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const xVw = useTransform(scrollYProgress, [0, 1], [0, -(steps.length - 1) * 100]);
  const x = useMotionTemplate`${xVw}vw`;
  const progressW = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="process"
      ref={ref}
      className="relative w-full"
      style={{ height: `${steps.length * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen w-full flex-col justify-center overflow-hidden">
        <div className="mb-12 flex items-baseline justify-between px-6 md:px-16">
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-[-0.03em]">
            Our Process.
          </h2>
          <span className="font-mono text-xs tracking-[0.2em] text-[color:var(--color-muted-foreground)] uppercase">
            [ 04 / 06 ]
          </span>
        </div>
        <motion.div style={{ x }} className="flex will-change-transform">
          {steps.map((s) => (
            <div
              key={s.n}
              className="flex w-screen shrink-0 flex-col items-start justify-center px-6 md:px-16"
            >
              <div className="font-display font-bold leading-[0.85] tracking-[-0.05em] text-[clamp(10rem,28vw,26rem)]">
                {s.n}
              </div>
              <div className="mt-6 font-display text-[clamp(1.5rem,3vw,2.5rem)] tracking-[-0.02em]">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
        <div className="mx-6 mt-12 h-px bg-[color:var(--color-border)] md:mx-16">
          <motion.div
            style={{ width: progressW }}
            className="h-px bg-[color:var(--color-ember)]"
          />
        </div>
      </div>
    </section>
  );
}

function ProcessMobile() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(0);
  const [hintDismissed, setHintDismissed] = useState(false);
  const x = useMotionValue(0);
  const maxDrag = vw * (steps.length - 1);
  const progressW = useTransform(x, [0, -maxDrag || -1], ["0%", "100%"]);

  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("az-process-hint") === "1") setHintDismissed(true);
    } catch {
      /* noop */
    }
  }, []);

  const dismissHint = () => {
    if (hintDismissed) return;
    setHintDismissed(true);
    try {
      sessionStorage.setItem("az-process-hint", "1");
    } catch {
      /* noop */
    }
  };

  return (
    <section
      id="process"
      ref={containerRef}
      className="relative w-full overflow-hidden py-16"
    >
      <div className="mb-8 flex items-baseline justify-between px-6">
        <h2 className="font-display text-[clamp(2rem,8vw,3rem)] leading-[0.95] tracking-[-0.03em]">
          Our Process.
        </h2>
        <span className="font-mono text-[10px] tracking-[0.2em] text-[color:var(--color-muted-foreground)] uppercase">
          [ 04 / 06 ]
        </span>
      </div>

      <div className="relative touch-pan-y">
        <motion.div
          drag="x"
          dragConstraints={{ left: -maxDrag, right: 0 }}
          dragElastic={0.08}
          style={{ x }}
          onDragStart={dismissHint}
          className="flex w-max will-change-transform"
        >
          {steps.map((s) => (
            <div
              key={s.n}
              style={{ width: vw || "100vw" }}
              className="flex shrink-0 flex-col items-start justify-center px-6"
            >
              <div className="font-display font-bold leading-[0.85] tracking-[-0.05em] text-[clamp(7rem,42vw,14rem)]">
                {s.n}
              </div>
              <div className="mt-6 font-display text-[clamp(1.25rem,6vw,2rem)] tracking-[-0.02em]">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        {!hintDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="pointer-events-none absolute right-6 bottom-2 flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[color:var(--color-ember)] uppercase"
          >
            <span>Swipe</span>
            <motion.span
              aria-hidden
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </motion.div>
        )}
      </div>

      <div className="mx-6 mt-10 h-px bg-[color:var(--color-border)]">
        <motion.div
          style={{ width: progressW }}
          className="h-px bg-[color:var(--color-ember)]"
        />
      </div>
    </section>
  );
}
