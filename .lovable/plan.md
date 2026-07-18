
# AZ Ventures Advisory — Kinetic Typography Site

Single-page marketing site built on the existing TanStack Start + React + Tailwind v4 stack, adding Framer Motion for scroll-driven kinetic typography. Zero imagery/icons — type is the design.

## Stack & setup

- Add `framer-motion` via bun.
- Fonts loaded through `<link>` tags in `__root.tsx` head (Bricolage Grotesque variable, Instrument Serif, JetBrains Mono) with `preconnect` + `font-display: swap`. Preload Bricolage variable woff2.
- Register font family CSS vars in `src/styles.css` under `@theme`: `--font-display: "Bricolage Grotesque"`, `--font-serif: "Instrument Serif"`, `--font-mono: "JetBrains Mono"`.
- Override design tokens on `:root`: `--background: #0A0A0A`, `--foreground: #F2F0EA`, plus new `--color-ember: #FF4D1C`.
- Hide native cursor globally on `(pointer: fine)` only.

## Route & SEO

Rewrite `src/routes/index.tsx` with the full page. `head()` sets:
- title, meta description (as specified), canonical `/`, og:title/description/type=website/url=/, og:image=`/og.jpg`, twitter:card=summary_large_image.
- JSON-LD ProfessionalService script.

Update `__root.tsx` head: `<html lang="en">` already set; keep viewport; remove default "Lovable App" title so the leaf title wins. Add font `<link>` tags in root `links`.

Add:
- `public/robots.txt` (allow all).
- `src/routes/sitemap[.]xml.ts` server route with `/`.
- `public/og.jpg` — generated dark card with "AZ Ventures Advisory" wordmark (via imagegen, 1200x630).

## Component structure

All under `src/components/az/`:

- `CustomCursor.tsx` — spring-lagged ember dot via `useMotionValue` + `useSpring`. Grows on hover of `[data-cursor="link"]`. Gated by `matchMedia('(pointer: fine)')`; returns null on touch. Uses `requestAnimationFrame` implicit via Motion.
- `useReducedMotion.ts` wrapper — re-exports Motion's hook.
- `Hero.tsx` (Section 1) — h1 with per-word spans; each word's `fontVariationSettings` (`wght`) animates via `useScroll` on the hero section, so scrolling back up leaves a slightly heavier resting weight (target 200→700, resting 500). "stronger" span uses Instrument Serif italic + ember. Skew tied to pointer X via `useMotionValue` + spring, clamped ±4deg, resets on leave. Mono tag, text-link CTA with animated ember underline (scaleX 0→1). Stat strip fades in 200ms after headline, with reserved min-height to prevent CLS.
- `Challenges.tsx` (Section 2) — six lines. Each line is a component that uses `useScroll({ target, offset: ["start end","end start"] })` + `useTransform` to compute opacity/scale from distance to viewport center continuously. Scramble effect: on first entry within threshold, run a ~500ms interval swapping random chars until resolved; on reduced motion, plain fade.
- `WhatWeDo.tsx` (Section 3) — three stacked words. Default: `-webkit-text-stroke` outline, transparent fill, faint animated conic-gradient/noise clipped by `background-clip: text`. Hover (desktop) / tap (mobile via `useState` per row) fills solid ember + reveals adjacent line via width/opacity transition. Toggle via `onPointerEnter`/`onClick` so touch works.
- `Process.tsx` (Section 4) — `useScroll` on a tall wrapper (`height: 500vh`) with sticky inner. Horizontal `x` transform on step track tied to scroll progress; thin ember progress line width tied to same. Distance chosen so progress hits 100% exactly as the sticky releases (no dead scroll). Below `md`: renders as vertical stack with each step animating in via `whileInView`.
- `WhoWeWorkWith.tsx` (Section 5) — two marquee rows using Motion `animate` on `x` with `repeat: Infinity`, linear, 50s. Content array duplicated ×3 minimum, `whiteSpace: nowrap`. Pause on `hover` via `onHoverStart/End` setting `animationPlayState` — implemented by toggling a `paused` state that stops the animation. Outline-only text via `-webkit-text-stroke`.
- `Vision.tsx` (Section 6) — split closing sentence into chars. Each char starts at random offscreen offset (`x/y` between ±window dims) and rotate, `useScroll` on section with `offset: ["start end","center center"]` drives progress from 0→1; `useTransform` maps to per-char `x`,`y`,`rotate`→0 with 900–1200ms feel. Uses `useTransform` per char (memoized). Reduced motion: static fade.
- `Contact.tsx` (Section 7) — h2 with SVG `<filter>` displacement (`feTurbulence`+`feDisplacementMap`) applied conditionally; on pointer move update filter `scale` attr via ref (`requestAnimationFrame`) toward cursor distance; on leave spring back to 0. Fallback: transform skew. Three links (mailto, tel, tel + wa.me) each 44px tap target. Footer line.

## Interaction & motion rules

- All animation uses `transform` / `opacity` / `font-variation-settings` — no width/height/top layout thrash (marquee uses `x`).
- Easing: cubic-bezier `[0.22, 1, 0.36, 1]` (ease-out-quint), 600–900ms, Vision up to 1.2s.
- One major animated element per section (scramble lines are sequential by scroll position, not simultaneous).
- Reduced-motion: guard scramble, char assembly, weight-morph, and skew — replace with plain fade/opacity.
- Mobile: `useIsTouch` hook (matchMedia pointer:coarse) disables cursor, switches Process to vertical, WhatWeDo hover→tap.

## Responsive

- Headlines use `clamp()` via arbitrary Tailwind values (e.g. `text-[clamp(3rem,12vw,10rem)]`).
- Marquee text sized so at 375px width no words clip; `overflow: hidden` on marquee container, but inner track is `w-max`.
- Touch targets: min-h-11 min-w-11 on all links/buttons.

## Files created/modified

Created:
- `src/components/az/CustomCursor.tsx`
- `src/components/az/Hero.tsx`
- `src/components/az/Challenges.tsx`
- `src/components/az/WhatWeDo.tsx`
- `src/components/az/Process.tsx`
- `src/components/az/WhoWeWorkWith.tsx`
- `src/components/az/Vision.tsx`
- `src/components/az/Contact.tsx`
- `src/components/az/hooks.ts` (useIsTouch, useReducedMotionSafe)
- `src/routes/sitemap[.]xml.ts`
- `public/robots.txt`
- `public/og.jpg` (generated)

Modified:
- `src/routes/index.tsx` — assembles sections + mounts CustomCursor, sets head/JSON-LD.
- `src/routes/__root.tsx` — font `<link>`s, remove default title so leaf wins.
- `src/styles.css` — palette override, font tokens, cursor hiding, text-stroke utility.
- `package.json` — add `framer-motion`.

## Final QA

Manual scroll top-to-bottom in Playwright at 1280 and 390 widths, screenshotting each section, verifying: no images/icons rendered, no clipped marquee words, Process pin releases with no dead scroll, Vision fully assembles, contact links present.
