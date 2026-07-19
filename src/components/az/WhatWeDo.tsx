import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const items = [
  {
    word: "Transformation",
    desc: "Real operational assessments and turnaround planning — built on decades of hands-on experience, not theory.",
  },
  {
    word: "Growth",
    desc: "Growth systems designed by people who've actually built and run businesses in this region, not just advised on them.",
  },
  {
    word: "Market Entry",
    desc: "From the UAE to the wider Middle East — we know what it actually takes to set up and succeed here.",
  },
];

export function WhatWeDo() {
  return (
    <section id="what-we-do" className="relative w-full px-6 py-32 md:px-16 md:py-48">
      <div className="mb-16 flex items-baseline justify-between">
        <h2 className="font-display text-[clamp(2rem,6vw,4.5rem)] leading-[0.95] tracking-[-0.03em]">
          What We Do.
        </h2>
        <span className="hidden font-mono text-xs tracking-[0.2em] text-[color:var(--color-muted-foreground)] uppercase md:inline">
          [ 03 / 06 ]
        </span>
      </div>
      <div className="flex flex-col gap-4 md:gap-2">
        {items.map((it, i) => (
          <Row key={it.word} {...it} index={i} />
        ))}
      </div>
    </section>
  );
}

function Row({ word, desc, index }: { word: string; desc: string; index: number }) {
  const [active, setActive] = useState(false);
  return (
    <div
      data-cursor="link"
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      onClick={() => setActive((v) => !v)}
      className="group relative flex cursor-pointer flex-col gap-3 border-t border-[color:var(--color-border)] py-6 md:flex-row md:items-center md:gap-10 md:py-8"
    >
      <span className="font-mono text-[10px] tracking-[0.2em] text-[color:var(--color-muted-foreground)]">
        0{index + 1}
      </span>
      <motion.h3
        animate={{
          color: active ? "var(--color-ember)" : "transparent",
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`font-display leading-[0.9] tracking-[-0.03em] text-[clamp(2.5rem,10vw,8rem)] ${
          active ? "" : "text-stroke"
        }`}
      >
        {word}
      </motion.h3>
      <AnimatePresence>
        {active && (
          <motion.p
            key="desc"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-md font-display text-base leading-snug text-[color:var(--color-foreground)] md:ml-auto md:text-lg"
          >
            {desc}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
