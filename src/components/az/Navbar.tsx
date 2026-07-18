import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const links = [
  { href: "#challenges", label: "Challenges" },
  { href: "#what-we-do", label: "What We Do" },
  { href: "#process", label: "Process" },
  { href: "#clients", label: "Clients" },
  { href: "#vision", label: "Vision" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: reduced ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled || open
            ? "border-b border-[color:var(--color-border)] bg-[color:var(--color-background)]/85 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 w-full items-center justify-between px-6 md:h-20 md:px-16"
        >
          <a
            href="#top"
            data-cursor="link"
            onClick={() => setOpen(false)}
            className="font-display text-lg font-semibold tracking-tight md:text-xl"
          >
            AZ <span className="text-[color:var(--color-ember)]">Ventures</span>
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  data-cursor="link"
                  className="group relative font-mono text-[11px] tracking-[0.2em] text-[color:var(--color-muted-foreground)] uppercase transition-colors hover:text-[color:var(--color-foreground)]"
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[color:var(--color-ember)] transition-transform duration-500 group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            data-cursor="link"
            className="hidden items-center gap-2 rounded-full border border-[color:var(--color-ember)] px-4 py-2 font-mono text-[10px] tracking-[0.2em] text-[color:var(--color-ember)] uppercase transition-colors hover:bg-[color:var(--color-ember)] hover:text-[color:var(--color-background)] lg:inline-flex"
          >
            Start <span aria-hidden>→</span>
          </a>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 inline-flex h-11 w-11 items-center justify-center lg:hidden"
            data-cursor="link"
          >
            <span className="relative block h-3 w-6">
              <span
                className={`absolute left-0 block h-px w-6 bg-[color:var(--color-foreground)] transition-transform duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-6 bg-[color:var(--color-foreground)] transition-transform duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col bg-[color:var(--color-background)] px-6 pt-24 pb-10 lg:hidden"
          >
            <ul className="flex flex-col gap-2">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.4 }}
                  className="border-b border-[color:var(--color-border)]"
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-14 items-center justify-between font-display text-2xl tracking-tight"
                  >
                    <span>{l.label}</span>
                    <span className="font-mono text-[10px] tracking-[0.2em] text-[color:var(--color-ember)]">
                      0{i + 1}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-10 inline-flex min-h-14 w-full items-center justify-center rounded-full border border-[color:var(--color-ember)] font-mono text-[11px] tracking-[0.2em] text-[color:var(--color-ember)] uppercase"
            >
              Start a conversation →
            </a>
            <div className="mt-auto pt-10 font-mono text-[10px] tracking-[0.2em] text-[color:var(--color-muted-foreground)] uppercase">
              Dubai, UAE · azventuresadvisory@gmail.com
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
