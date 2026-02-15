# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Next.js dev server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

No test suite is configured.

## Architecture

**Orbit Experience v2** is a gamified "Year in Review" for Canada ICI — a space-themed interactive mission where users pick a role and complete 10 quiz challenges along an orbital trajectory.

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Zustand 5, Framer Motion 12, Tailwind CSS 4.

### Module Map

| Module | Path | Role |
|---|---|---|
| Global Store | `store/useStore.ts` | Single source of truth for all mission state |
| Viewport | `components/simulation/Viewport.tsx` | Master layout router — renders RoleSelect / Challenges+Trajectory / MissionReport based on `currentStep` |
| Trajectory | `components/simulation/Trajectory.tsx` | SVG Bezier path with 10 interactive mission nodes |
| Challenges HUD | `components/hud/Challenges.tsx` | Quiz popup rendered when a node is clicked |
| Mission Data | `data/milestones.ts` | 10 challenges with questions, options, and correct answers |
| Sound | `hooks/useSoundSystem.ts` | Web Audio wrapper for click/success/error feedback |

### State Flow

```
currentStep 0  → RoleSelect (pick Mission Control or Commander)
currentStep 1–10 → Trajectory + Challenges HUD
currentStep 11+ → MissionReport
```

`useStore` drives everything. State includes: `role`, `currentStep`, `unlockedIndex`, `completedMilestoneIds`, `activeMilestoneId`, `isTransmissionOpen`, `isShaking`, `correctPulse`. Persisted to `localStorage` via Zustand's `persist` middleware.

**Hydration:** The store uses `_hasHydrated` to guard against SSR/client mismatches — check this before rendering state-dependent UI.

### Key Design Rules (enforced by the `skills/` leads)

**State (`state-lead.md`):**
- Always use atomic selectors: `useStore(state => state.role)` not `const { role } = useStore()`.
- For multi-value selection use `useShallow`: `useStore(useShallow(state => ({ a: state.a, b: state.b })))`.
- For 60fps animation, use `useStore.subscribe()` into a `ref` — never subscribe via hook.
- Actions belong in the store, not in `useEffect`.

**Architecture (`architecture-lead.md`):**
- `page.tsx` and `layout.tsx` must stay Server Components. Push `'use client'` to leaf components only.
- Never use a plain `<img>` tag — use `next/image` with explicit dimensions and `placeholder="blur"` on heavy backgrounds.
- Do not use `useEffect` for data fetching — use async Server Components.

**Motion (`physics-lead.md`):**
- Default to `type: "spring"`. Never use linear easing.
- For this project's tactical HUD feel: `stiffness: 400, damping: 30`.
- Use `layoutId` for shared element transitions (card → modal expansions).
- Use `AnimatePresence` for all unmounting components.
- Animate only `transform` and `opacity` — never `width`, `height`, or `left` directly.

**Visual (`visual-lead.md`):**
- Glass panels: `backdrop-filter: blur()` + SVG noise overlay at 5–10% opacity.
- Borders use `box-shadow: 0 0 0 1px rgba(...)` not CSS `border`.
- Focus rings use `box-shadow` glows, not `outline`.
- Prefer `onPointerDown` over `onClick` for snappy perceived responsiveness.

**Layout (`layout-lead.md`):**
- Never use fixed `height` on text containers — use `min-height` and let content grow.
- Use `100dvh` not `100vh` (accounts for mobile browser bars).
- The experience is locked to a **16:9 aspect ratio** — use `aspect-video` on the main container.
- Wrap large motion (parallax, sweeping transitions) in `prefers-reduced-motion` checks.

**Mobile (`mobile-responsiveness-lead.md`):**
- All touch targets must be at least 44×44px.
- Use `clamp()` for fluid typography. Never fixed-pixel font sizes.
- Do not rely on `:hover` for critical information — assume touch-first.

**Performance (`performance-lead.md`):**
- Code-split heavy components with `next/dynamic`.
- Animate with `transform`/`opacity` only; use `will-change: transform` sparingly.
- All below-fold images need `loading="lazy"` and `decoding="async"`.

### Brand Tokens

- Mission Control: `#009DD6` (blue), class `amg-blue`
- Commander: `#D80010` (red), class `ici-red`
- Role drives color variants across Trajectory, Challenges, and GlassContainer components.

### Off-Limits Rules

- **Legacy files:** Never modify any file ending in `.old` or `.old.tsx`.
- **Global CSS:** Do not add standard CSS borders to global scope — maintain the translucent sci-fi glass theme throughout.
- **Auto-advance:** Never implement automated transitions between steps. The user must manually click trajectory nodes to advance. All progression is intentional and user-driven.
- **Reset mechanism:** The `[RESET SYSTEM]` button in the UI clears `localStorage` and reloads the page — it is not a code-level reset; do not add programmatic equivalents elsewhere.

### Skills Files

The `skills/` directory contains detailed lead personas (architecture, state, visual, layout, physics, UX, mobile, performance). Consult them when working in their domain — they define the project's golden rules and code review standards.