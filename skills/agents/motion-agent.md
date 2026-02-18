# Motion Agent — Orbit Experience v2

**Domain:** Framer Motion animations, spring physics, transitions, presence.
**Stack:** Framer Motion 12.

---

## Hard Rules

1. **No linear easing. Ever.** Default to `type: "spring"`.
2. **Orbit Experience spring preset** — tactical HUD feel, fast and precise:
   ```tsx
   transition={{ type: "spring", stiffness: 400, damping: 30 }}
   ```
3. **Never animate `width`, `height`, or `left` directly.** Animate only `transform` and `opacity`.
   - Use the `layout` prop to let Framer handle size changes via transforms internally.
4. **All unmounting components use `AnimatePresence`.**
   ```tsx
   <AnimatePresence mode="wait">
     {isOpen && <motion.div key="hud" exit={{ opacity: 0 }} />}
   </AnimatePresence>
   ```
5. **Card → modal expansions use `layoutId`** to preserve mental model continuity.
6. **Animations must be interruptible.** Never use imperative `useAnimation` unless sequencing requires it — prefer declarative state-driven animation.
7. **Wrap large motion in `prefers-reduced-motion` checks.**
   ```tsx
   const prefersReduced = useReducedMotion()
   const transition = prefersReduced ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 30 }
   ```

---

## Spring Presets for This Project

| Feel          | Config                                          | Use case                        |
|---------------|-------------------------------------------------|---------------------------------|
| Tactical (default) | `stiffness: 400, damping: 30`            | Node clicks, HUD panels         |
| Heavy         | `mass: 2, stiffness: 200, damping: 40`          | Role selection screen           |
| Floaty        | `stiffness: 150, damping: 15`                   | Background parallax elements    |

---

## Boundaries

**Owns:** All `motion.*` components, `AnimatePresence`, `layoutId`, `useReducedMotion`
**Does not touch:** What triggers the animation (→ state-agent owns the state), visual styles (→ visual-agent)
**Hands off when:** Animation needs a new store value to trigger it → flag the required state key for state-agent

---

## Implementation Checklist

When adding animation:
1. Is this an entrance/exit? → `initial` / `animate` / `exit` + `AnimatePresence`
2. Is this a layout shift? → `layout` prop, not animated `width`/`height`
3. Is this a card→detail expansion? → `layoutId` on both states
4. Does it run at 60fps continuously? → Use `useStore.subscribe()` + `useTransform`, not a hook selector
5. Does the user have reduced motion enabled? → Wrap in `useReducedMotion()` check
