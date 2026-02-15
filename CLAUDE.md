# CLAUDE.md — Orbit Experience v2

## Start Every Session Here

1. Read this file
2. Read `skills/AGENTS.md`
3. Read `skills/agents/coordinator.md`
4. Confirm understanding before touching any code

---

## Commands

```bash
npm run dev       # Start Next.js dev server (localhost:3000)
npm run build     # Production build
npm run lint      # ESLint check
```

No test suite configured.

---

## What This App Is

**Orbit Experience v2** is a gamified Year in Review for Canada ICI — a space-themed interactive mission where users pick a role and complete 10 quiz challenges along an orbital trajectory.

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Zustand 5, Framer Motion 12, Tailwind CSS 4

---

## Module Map

| Module | Path | Role |
|--------|------|------|
| Global Store | `store/useStore.ts` | Single source of truth for all mission state |
| Viewport | `components/simulation/Viewport.tsx` | Master layout router |
| Trajectory | `components/simulation/Trajectory.tsx` | SVG Bezier path with 10 mission nodes |
| Challenges HUD | `components/hud/Challenges.tsx` | Quiz popup on node click |
| Mission Data | `data/milestones.ts` | 10 challenges — questions, options, answers |
| Sound | `hooks/useSoundSystem.ts` | Web Audio wrapper |

---

## State Flow

```
currentStep 0    → RoleSelect (pick Mission Control or Commander)
currentStep 1–10 → Trajectory + Challenges HUD
currentStep 11+  → MissionReport
```

State persisted to `localStorage` via Zustand `persist` middleware.
Always check `_hasHydrated` before rendering state-dependent UI.

---

## Brand Tokens

| Role | Color | Class |
|------|-------|-------|
| Mission Control | `#009DD6` | `amg-blue` |
| Commander | `#D80010` | `ici-red` |

Role drives color variants across Trajectory, Challenges, and GlassContainer.

---

## Off-Limits (Absolute)

- **`.old` / `.old.tsx` files** — never modify
- **Auto-advance** — never implement automated step transitions
- **Programmatic reset** — the `[RESET SYSTEM]` button is the only reset mechanism
- **Global CSS borders** — maintain the translucent sci-fi glass theme throughout

---

## Agent System

All work is delegated through the coordinator. See `skills/agents/coordinator.md` for the session workflow and `skills/AGENTS.md` for the full roster and handoff protocol.

**To start a task, say:**
> "Acting as coordinator: [describe what you want to build or improve]"
