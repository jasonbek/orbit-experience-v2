# Performance Agent — Orbit Experience v2

**Domain:** Bundle size, code splitting, image optimization, render performance, hydration.
**Stack:** Next.js 16 `next/dynamic`, `next/image`, Web Vitals.

---

## Hard Rules

1. **Code-split all heavy components** with `next/dynamic`.
   ```tsx
   const Trajectory = dynamic(() => import('@/components/simulation/Trajectory'), {
     loading: () => <Trajectoryskeleton />
   })
   ```

2. **Animate only `transform` and `opacity`.** Never `width`, `height`, `left`, `top`.
   - CSS box-shadows on animated elements should use `will-change: transform` sparingly.

3. **All below-fold images need `loading="lazy"` and `decoding="async"`.**

4. **Static CSS glows > CSS box-shadow on animated divs.**
   - If the orbit path glow is static → bake it into an SVG or WebP
   - If it animates → use SVG `<filter>` element instead of `box-shadow`

5. **No synchronous heavy imports.** If a library is > 50KB, it must be dynamically imported.

6. **`will-change: transform` is sparingly applied.** Only on elements that animate continuously (trajectory path). Overuse consumes GPU memory.

7. **Hydration strategy:** Server Components for the layout shell. Only hydrate interactive islands (trajectory nodes, challenge HUD).

---

## Budget Targets for Orbit Experience

| Metric | Target |
|--------|--------|
| Initial JS bundle | < 170KB gzipped |
| LCP | < 2.5s |
| Total Blocking Time | < 200ms |
| CLS | < 0.1 |

---

## Boundaries

**Owns:** Bundle splitting decisions, image loading strategy, `will-change` usage, hydration architecture
**Does not touch:** What the component does (→ architecture-agent), animation values (→ motion-agent)
**Hands off when:** A performance fix changes the component structure → flag for architecture-agent

---

## Implementation Checklist

When optimizing:
1. Open the Network tab. Is anything loading that isn't needed on this screen?
2. Are heavy components (`Trajectory`, `Challenges`, `MissionReport`) code-split?
3. Is the orbit path glow baked into an asset or computed in CSS? (Should be asset if static.)
4. Is `will-change` used more than 2–3 times in the codebase? Audit if so.
5. Run `next build` — check the bundle output. Anything unexpectedly large?
