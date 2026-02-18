# AGENTS.md — Orbit Experience v2

This file is read by the Coordinator agent at the start of every session.
It defines the agent roster, their domains, and the handoff protocol.

---

## Agent Roster

| Agent | File | Domain |
|-------|------|--------|
| **Coordinator** | `skills/agents/coordinator.md` | Session orchestration, task delegation, planning |
| **Architecture** | `skills/agents/architecture-agent.md` | Next.js structure, server/client boundary, assets |
| **State** | `skills/agents/state-agent.md` | Zustand store, selectors, persistence, hydration |
| **Motion** | `skills/agents/motion-agent.md` | Framer Motion, springs, AnimatePresence, layoutId |
| **Visual** | `skills/agents/visual-agent.md` | Glass UI, shadows, lighting, texture, color tokens |
| **Layout** | `skills/agents/layout-agent.md` | Responsive layout, dvh, clamp, breakpoints |
| **UX** | `skills/agents/ux-agent.md` | Game feel, feedback loops, onboarding, motivation |
| **Performance** | `skills/agents/performance-agent.md` | Bundle size, code splitting, image optimization |

---

## Handoff Protocol

When an agent reaches the edge of its domain, it does not guess. It:

1. **Stops work** at the boundary
2. **Documents the handoff** in a comment block:
   ```
   // HANDOFF → [agent-name]
   // Reason: [why this crosses the boundary]
   // Requires: [what the next agent needs to know]
   ```
3. **Returns to Coordinator** to activate the next agent

---

## Common Multi-Agent Tasks

### "Make the trajectory nodes feel better on mobile"
```
Coordinator activates:
  1. layout-agent    → increase touch target to 44px, check dvh
  2. visual-agent    → adjust glow/shadow for smaller screen
  3. motion-agent    → verify spring feels right at mobile scale
  4. ux-agent        → confirm feedback loop still works (sound + visual)
```

### "Add a new challenge to the mission"
```
Coordinator activates:
  1. state-agent     → add new milestone ID, update store shape
  2. architecture-agent → verify data flows from milestones.ts correctly
  3. ux-agent        → design the feedback moment on completion
  4. visual-agent    → apply role-correct color tokens
```

### "Improve initial load performance"
```
Coordinator activates:
  1. performance-agent  → audit bundle, identify heavy imports
  2. architecture-agent → implement next/dynamic code splitting
  3. motion-agent       → verify AnimatePresence still works post-split
```

### "Polish the glass HUD panels"
```
Coordinator activates:
  1. visual-agent    → apply glass recipe, noise texture, box-shadow borders
  2. layout-agent    → verify panels don't break at mobile widths
  3. motion-agent    → add entrance animation with spring preset
```

---

## Off-Limits (All Agents)

- Never modify files ending in `.old` or `.old.tsx`
- Never implement auto-advance between steps
- Never add programmatic reset logic outside the existing `[RESET SYSTEM]` button
- Never add standard CSS borders to global scope
- Never use `onClick` where `onPointerDown` is appropriate
