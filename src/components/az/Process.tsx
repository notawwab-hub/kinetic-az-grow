import { useRef } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
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
  // Translate in vw so it doesn't depend on the flex container's own width.
  // Move by (n-1) * 100vw so the last step lands fully centered.
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
  return (
    <section id="process" className="relative w-full px-6 py-24">
      <div className="mb-10 flex items-baseline justify-between">
        <h2 className="font-display text-[clamp(2rem,8vw,3rem)] leading-[0.95] tracking-[-0.03em]">
          Our Process.
        </h2>
        <span className="font-mono text-[10px] tracking-[0.2em] text-[color:var(--color-muted-foreground)] uppercase">
          [ 04 / 06 ]
        </span>
      </div>
      <ol className="flex flex-col gap-16">
        {steps.map((s, i) => (
          <motion.li
            key={s.n}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="border-l border-[color:var(--color-border)] pl-4"
          >
            <div className="font-display font-bold leading-[0.85] text-[clamp(5rem,26vw,10rem)]">
              {s.n}
            </div>
            <div className="mt-2 font-display text-xl">{s.label}</div>
            {i === steps.length - 1 ? null : (
              <div className="mt-8 h-px w-8 bg-[color:var(--color-ember)]" />
            )}
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
