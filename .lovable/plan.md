## Part 0 — Critical mobile bug fixes

**Hero overflow (`src/components/az/Hero.tsx`)**
- Lower the mobile end of the headline clamp so long words fit at 360–480px, e.g. `text-[clamp(1.9rem,11vw,8.5rem)]`, and remove the `max-w-[22ch]` cap on mobile (`max-w-full md:max-w-[22ch]`) so wrapping is driven by the viewport, not a ch-based ceiling that pushes "businesses." off-screen.
- Add `break-words` / `hyphens-auto` on the `<h1>`.

**Dead scroll gaps**
- `Process.tsx` desktop variant currently sets `height: steps.length * 100vh` even on mobile before `useIsTouch` resolves. Move the height onto the desktop branch only; mobile uses the new swipe version (Part 1) with `min-h-screen`, no oversized outer.
- `Vision.tsx` uses `min-h-[130vh]`; drop to `min-h-screen md:min-h-[130vh]` so the section isn't a tall empty box on mobile.
- Audit `Challenges.tsx` (`py-32`) and other sections — no scroll pinning there, but confirm no `100vh` spacers remain on mobile.

**Marquee clipping + stray icon (`WhoWeWorkWith.tsx`)**
- Wrap each `Marquee` in a `w-screen relative left-1/2 -translate-x-1/2 overflow-hidden` container so the tiling row is clipped at the true viewport edge (currently the parent `section` has default padding contexts that leave the track visible past its own overflow box on some widths).
- Increase content duplication (already `[...content, ...content]` where `content` is 3×; keep it and reset `offset` wrapping math so no gap appears mid-loop).
- Remove the ✳ separator span entirely (the "stray icon"); replace with plain spacing (e.g. `mx-8` gap) since the site is text-only.

**"What We Do" outline on mobile (`WhatWeDo.tsx`)**
- Current logic keys the outline off `active` which toggles on `pointerenter`. On touch, pointerenter fires on tap and stays until another tap elsewhere, so items look "solid" once tapped. Change at-rest to always use `.text-stroke`; only fill on hover (desktop) or while `active` (tap toggle) — ensure initial render on touch is stroke.
- Verify the `motion.h3` `animate.color` starts as `transparent` (stroke visible) and only becomes ember when `active`. Remove the inline `style` override so the utility class governs the resting look.

## Part 1 — Mobile animations match desktop (touch-driven)

**Hero skew**
- Keep pointer-driven skew on desktop. On touch, replace with a subtle scroll-linked skew: map `scrollYProgress` (0→1 across hero) to `skewX` ±3deg using `useTransform`. Optionally attempt `DeviceOrientationEvent` gyro with permission on iOS; fall back to scroll-linked when unavailable/denied. No feature removal.

**Process — swipe-driven horizontal (`Process.tsx`)**
- Replace `ProcessMobile` stacked list with a full-screen horizontal pager that uses framer-motion's `drag="x"` on the same `steps.map` row, with `dragConstraints` computed from `steps.length * viewportWidth`.
- Sync the same progress bar to drag position via a shared `MotionValue`.
- Keep desktop scroll-scrub variant unchanged.
- Add a one-time swipe hint (small "swipe →" label + arrow) that fades out on first drag, persisted with `sessionStorage`.

**Challenges + Vision on mobile**
- Both are scroll-driven already; verify `useScroll({ target })` offsets fire correctly at mobile viewport. Adjust Vision `offset` to `["start end","center center"]` (already so) and ensure section height on mobile still gives room for assembly (keep `min-h-screen` from Part 0).

**What We Do tap parity** — covered above; ensure animation duration/easing (`0.5s [0.22,1,0.36,1]`) is unchanged.

**Marquee touch-hold pause** — swap `onPointerEnter/Leave` for `onTouchStart/End` in addition to pointer events (pointer events already cover touch; verify no accidental pause-on-scroll).

**CustomCursor** — already gated by `useHasFinePointer`; leave as is.

## Part 2 — Copy refresh

**`Hero.tsx`**
- Tag: `[ STRATEGIC ADVISORY — MIDDLE EAST ]`
- Stat strip: `30+ Years of Family Expertise` · `Proven Across the UAE` · `Now Advising the Middle East`

**`WhatWeDo.tsx`** — replace the three `desc` strings with the new sentences (words unchanged).

**`Contact.tsx`** — footer paragraph replaced with the new Dubai/Middle East + KAR family line. Contact links untouched.

**`routes/index.tsx`**
- `DESC` → "Middle East-focused business transformation and growth advisory firm, founded by the family behind KAR Business Services' 30+ years of UAE expertise."
- JSON-LD `areaServed` → `["United Arab Emirates", "Middle East"]`.

## Verification
Run a Playwright pass at 375px and 1440px:
- screenshot hero to confirm no overflow
- scroll to confirm no black gaps before Challenges/Vision
- swipe the Process pager on mobile viewport
- confirm marquee has no ✳ and no clipped words
- confirm "What We Do" items render outline-only at rest on touch
- confirm updated copy renders throughout