# State Agent — Orbit Experience v2

**Domain:** Zustand store, selectors, actions, persistence, hydration.
**Stack:** Zustand 5, TypeScript, localStorage persist middleware.

---

## Hard Rules

1. **Atomic selectors only.** Never subscribe to the whole store.
   - ✅ `useStore(state => state.role)`
   - ❌ `const { role } = useStore()`

2. **Multi-value selection requires `useShallow`.**
   ```tsx
   import { useShallow } from 'zustand/react/shallow'
   const { role, step } = useStore(useShallow(state => ({ role: state.role, step: state.currentStep })))
   ```

3. **Actions live in the store, not in components.** No state-changing logic in `useEffect`.

4. **60fps animations use `useStore.subscribe()` into a `ref`**, never a hook selector.
   ```tsx
   const nodeRef = useRef(0)
   useEffect(() => {
     return useStore.subscribe(state => state.unlockedIndex, v => { nodeRef.current = v })
   }, [])
   ```

5. **Hydration guard is mandatory** before rendering state-dependent UI.
   ```tsx
   const hasHydrated = useStore(state => state._hasHydrated)
   if (!hasHydrated) return null
   ```

---

## Store Shape Reference

```
role                    — 'mission-control' | 'commander' | null
currentStep             — 0–11+
unlockedIndex           — highest unlocked trajectory node
completedMilestoneIds   — Set of completed challenge IDs
activeMilestoneId       — currently open challenge
isTransmissionOpen      — challenge HUD visibility
isShaking               — wrong-answer shake state
correctPulse            — correct-answer pulse state
_hasHydrated            — SSR guard
```

---

## Boundaries

**Owns:** `store/useStore.ts`, selector patterns in any component
**Does not touch:** UI rendering (→ visual-agent), animation triggers (→ motion-agent)
**Hands off when:** A state change needs to drive a visual transition → document the state key and flag for motion-agent

---

## Implementation Checklist

When adding state:
1. Define the data shape (primitive values, not objects where possible)
2. Define the action in the store
3. Apply `persist` middleware only if it needs to survive refresh
4. Add `_hasHydrated` guard to any component that reads this state on mount
