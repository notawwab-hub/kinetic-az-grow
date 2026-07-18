## Fixes for azventures.co pre-launch

### 1. Hero headline clipping
Current `Hero.tsx` uses `max-w-[18ch]` with `text-[clamp(2.75rem,10.5vw,10.5rem)]` and a skewX transform on the whole `<h1>`. At wide viewports the last word ("value.") gets pushed past the container edge and the italic "stronger" descender clips because `overflow-hidden` is on the section. Fix:
- Widen the headline container (`max-w-none`, or `max-w-[22ch]` with an outer `pr-*` guard) and reduce the max clamp (e.g. `clamp(2.5rem, 9vw, 8.5rem)`) so both lines fit on desktop and mobile.
- Add vertical breathing room (`pb-[0.15em]`) so italic/descenders aren't cropped by `overflow-hidden`.
- Reduce skew amplitude on small screens (disable skew under `md`) since it amplifies clipping on narrow widths.

### 2. Process section only shows steps 01–02
The desktop pinned-scroll uses `height: 500vh` and translates the strip by `-80%` of its own width (which is `500vw`), which mathematically should land on step 05. In practice the section stops scrolling early because it sits at the end of the page with no room below, so `scrollYProgress` never reaches 1 before the next section takes over and only steps 01–02 come into view. Fix:
- Compute translate as `-((n-1)/n * 100)%` = `-80%` but map it to `useTransform(scrollYProgress, [0, 0.95], ...)` and add a trailing spacer so the sticky container can actually complete its scroll range.
- Alternatively (simpler + more reliable): translate in `vw` units — `useTransform(scrollYProgress, [0, 1], [0, -(steps.length - 1) * 100])` and apply as `x: \`${v}vw\``. This decouples math from container width.
- Verify with a Playwright scroll test that steps 03/04/05 render.

### 3. Missing navbar / site menu
Add a fixed top navbar rendered inside `__root.tsx` (so it appears on every route, including future pages) with:
- Wordmark "AZ Ventures" linking to `/`.
- Section anchors: Challenges, What We Do, Process, Clients, Vision, Contact (add matching `id="..."` to each section component).
- CTA button "Start a conversation" → `#contact`.
- Mobile: hamburger opens a full-screen overlay menu with the same links, large tap targets (min 44px), smooth close on link tap.
- Style: transparent over hero, gains a subtle backdrop-blur + border when scrolled (IntersectionObserver on hero or scrollY listener).
- Respect `prefers-reduced-motion`.

### 4. Mobile optimization pass
Audit every section at 360–430px widths:
- Ensure headings use `clamp()` with a sensible min so nothing overflows; add `min-w-0` and `break-words` where needed.
- Replace any horizontal-scroll or pinned-scroll effects with stacked layouts on touch devices (Process already does this; verify Challenges, WhatWeDo, WhoWeWorkWith, Vision).
- Ensure section padding is `px-6` on mobile / `px-16` on desktop consistently.
- Tap targets ≥ 44px; disable custom cursor on touch (verify `CustomCursor`).
- Contact form/CTA reachable without horizontal scroll; email/phone are `tel:`/`mailto:` links.
- Confirm the `[ 0X / 06 ]` counters shown in corners don't overlap content on small screens.

### 5. Full pre-launch review
- **SEO / metadata**: add per-section anchor IDs, verify canonical URL uses the real domain (`https://azventures.co/`) not `/`; update `og:url`, canonical, and JSON-LD `url`. Replace `/og.jpg` with a real generated OG image at absolute URL. Ensure single H1 (Hero) and section H2s.
- **Favicon / manifest**: verify `favicon.ico`, `apple-touch-icon.png`, `site.webmanifest`, theme-color meta are present in `__root.tsx`.
- **Accessibility**: add `aria-label` to nav, ensure color contrast on `--color-muted-foreground` meets WCAG AA, add `alt` text to any imagery, add `aria-current` on active nav link, focus-visible outlines on interactive elements.
- **Performance**: lazy-load below-the-fold heavy motion sections; preconnect to any font hosts; ensure images are `loading="lazy"` and sized.
- **Content sweep**: verify the phone `+971 4 269 8181`, email `azventuresadvisory@gmail.com`, and any stats/claims ("500+ Businesses", "30+ Years") match what the user wants public.
- **Legal**: add a footer with copyright, links to Privacy Policy and Terms (stub pages under `src/routes/privacy.tsx`, `src/routes/terms.tsx` with placeholder copy the user can fill).
- **Sitemap**: verify `sitemap[.]xml.ts` lists the real routes and uses `azventures.co`.
- **Analytics**: (optional) ask whether to wire Plausible / GA4.

### Verification
After implementation:
1. Playwright script at 375px, 768px, 1440px viewports — screenshot each section, confirm no clipping.
2. Scroll test on Process section — confirm all 5 steps render.
3. Click through navbar links on desktop and mobile menu.
4. Build check.

### Open questions (please confirm before I build)
1. **Logo / wordmark**: use plain text "AZ Ventures" for now, or do you have a logo file to drop in?
2. **Footer legal pages**: create empty Privacy/Terms stubs, or skip until you have copy?
3. **OG image**: want me to generate a branded hero-style OG image, or leave `/og.jpg` for you to supply?
4. **Analytics**: add Plausible/GA4 now or later?
