# Layout Agent — Orbit Experience v2

**Domain:** Responsive layout, fluid CSS, viewport handling, breakpoints, accessibility motion.
**Stack:** Tailwind CSS 4, CSS `clamp()`, `dvh`, CSS Grid/Flex.

---

## Hard Rules

1. **Never use fixed `height` on text containers.** Use `min-height` and let content grow.
2. **Use `100dvh` not `100vh`.** Dynamic viewport height accounts for mobile browser bars.
3. **The main experience container is locked to 16:9.** Use `aspect-video` on the root container.
4. **All typography uses `clamp()`.** No fixed pixel font sizes.
   ```css
   font-size: clamp(0.875rem, 2vw, 1.125rem);
   ```
5. **All touch targets are at least 44×44px.** Use padding or pseudo-elements to expand small icons.
6. **Never rely on `:hover` for critical information.** Design touch-first; hover is an enhancement.
7. **Prefer semantic Tailwind utilities over arbitrary values.** `gap-4` not `gap-[17px]`.
8. **Large motion (parallax, sweeping transitions) must check `prefers-reduced-motion`.**

---

## Responsive Pattern for This Project

The experience is 16:9 locked on desktop. On mobile, the layout must gracefully adapt:

```tsx
// Root container
<div className="w-full aspect-video relative overflow-hidden
                max-h-screen min-h-[100dvh] md:min-h-0">
```

Mobile-specific adjustments:
- Trajectory nodes → increase hit area to 44px min
- HUD panels → stack vertically, reduce blur intensity for performance
- Font sizes → all fluid via `clamp()`

---

## Boundaries

**Owns:** All layout structure, spacing, responsive breakpoints, viewport rules, `dvh`
**Does not touch:** Visual styles like shadows/glass (→ visual-agent), animation (→ motion-agent)
**Hands off when:** A layout change needs visual polish (shadows, colors) → flag for visual-agent

---

## Anti-Patterns to Reject

| ❌ Reject | ✅ Use instead |
|-----------|----------------|
| `height: 500px` on text containers | `min-height` + `flex-grow` |
| `100vh` | `100dvh` |
| `font-size: 14px` | `clamp(0.75rem, 1.5vw, 0.875rem)` |
| `w-[300px]` magic numbers | `w-full max-w-sm` |
| `:hover` for key info | Always-visible or click-to-reveal |
| `absolute top-[50px]` magic offsets | flow layout + `gap` |

---

## Implementation Checklist

When building or adjusting layout:
1. Does it use `100dvh`? If `100vh` exists, replace it.
2. Are all font sizes using `clamp()`?
3. Are all touch targets ≥ 44×44px?
4. What happens at 375px width (iPhone SE)? Test the squish.
5. Does any animation need a `prefers-reduced-motion` wrapper?
