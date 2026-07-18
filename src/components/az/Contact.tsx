import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function Contact() {
  const reduced = useReducedMotion();
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) return;
    const el = h2Ref.current;
    if (!el) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = Math.abs(e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      targetRef.current = Math.min(1, dx) * 40;
    };
    const leave = () => {
      targetRef.current = 0;
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    const loop = () => {
      currentRef.current += (targetRef.current - currentRef.current) * 0.12;
      if (dispRef.current) {
        dispRef.current.setAttribute("scale", currentRef.current.toFixed(2));
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  return (
    <section
      id="contact"
      className="relative flex min-h-screen w-full flex-col justify-between px-6 pt-32 pb-10 md:px-16 md:pt-40"
    >
      <svg width="0" height="0" className="absolute" aria-hidden>
        <filter id="az-distort">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" seed="4" />
          <feDisplacementMap ref={dispRef} in="SourceGraphic" scale="0" />
        </filter>
      </svg>

      <div>
        <p className="mb-8 font-mono text-xs tracking-[0.2em] text-[color:var(--color-muted-foreground)] uppercase">
          [ 06 / 06 ] · Book a confidential business consultation.
        </p>
        <motion.h2
          ref={h2Ref}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: reduced ? undefined : "url(#az-distort)" }}
          className="font-display leading-[0.9] tracking-[-0.03em] text-[clamp(3rem,13vw,13rem)]"
        >
          Partner With<br />
          <span className="text-[color:var(--color-ember)] font-serif italic">
            AZ Ventures.
          </span>
        </motion.h2>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
        <ContactLink
          label="Email"
          value="azventuresadvisory@gmail.com"
          href="mailto:azventuresadvisory@gmail.com"
        />
        <ContactLink label="Landline" value="04 269 8181" href="tel:+97142698181" />
        <div>
          <div className="mb-2 font-mono text-[10px] tracking-[0.2em] text-[color:var(--color-muted-foreground)] uppercase">
            Mobile / WhatsApp
          </div>
          <div className="flex flex-col gap-1">
            <a
              href="tel:+971521882668"
              data-cursor="link"
              className="group inline-flex min-h-11 items-center font-display text-xl tracking-tight md:text-2xl"
            >
              <span className="relative">
                052 188 2668
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[color:var(--color-ember)] transition-transform duration-500 group-hover:scale-x-100" />
              </span>
            </a>
            <a
              href="https://wa.me/971521882668"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="group inline-flex min-h-11 items-center font-mono text-[11px] tracking-[0.2em] text-[color:var(--color-ember)] uppercase"
            >
              → Open WhatsApp
            </a>
          </div>
        </div>
      </div>

      <footer className="mt-24 border-t border-[color:var(--color-border)] pt-8">
        <p className="font-mono text-[10px] leading-relaxed tracking-[0.15em] text-[color:var(--color-muted-foreground)] uppercase md:text-xs">
          AZ Ventures Advisory LLC — Dubai, UAE. Backed by 30+ years of trusted advisory
          experience through KAR Business Services.
        </p>
      </footer>
    </section>
  );
}

function ContactLink({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <div>
      <div className="mb-2 font-mono text-[10px] tracking-[0.2em] text-[color:var(--color-muted-foreground)] uppercase">
        {label}
      </div>
      <a
        href={href}
        data-cursor="link"
        className="group inline-flex min-h-11 items-center font-display text-xl tracking-tight break-all md:text-2xl"
      >
        <span className="relative">
          {value}
          <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[color:var(--color-ember)] transition-transform duration-500 group-hover:scale-x-100" />
        </span>
      </a>
    </div>
  );
}
