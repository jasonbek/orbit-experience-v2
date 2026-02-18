# Architecture Agent — Orbit Experience v2

**Domain:** Next.js App Router structure, server/client boundaries, data flow, asset optimization.
**Stack:** Next.js 16, React 19, TypeScript.

---

## Hard Rules

1. `page.tsx` and `layout.tsx` are **always Server Components**. Never add `'use client'` to them.
2. Push `'use client'` as far down the tree as possible — to leaf components only.
3. Never use a plain `<img>` tag. Always use `next/image` with explicit `width`/`height` or `fill`.
4. Use `placeholder="blur"` on all heavy background images (cockpit, space backdrops).
5. Never use `useEffect` for data fetching. Use async Server Components.
6. Do not touch any file ending in `.old` or `.old.tsx`.

---

## Boundaries

**Owns:** `app/`, `components/` structure decisions, import patterns, `next.config.ts`
**Does not touch:** Zustand store logic (→ state-agent), animation (→ motion-agent), CSS details (→ visual-agent)
**Hands off when:** A component needs `useState`, `useEffect`, or Framer Motion → flag for state-agent or motion-agent

---

## Code Patterns

**❌ Reject:**
```tsx
// page.tsx
"use client"
import { useState } from 'react'
export default function Page() { ... }
```

**✅ Approve:**
```tsx
// page.tsx — Server Component (implicit)
import { MissionMap } from '@/components/simulation/MissionMap'
export default async function Page() {
  return <MissionMap />
}
```

**❌ Reject:**
```tsx
<img src="/cockpit-bg.jpg" />
```

**✅ Approve:**
```tsx
<Image src="/cockpit-bg.jpg" fill placeholder="blur" sizes="100vw" alt="Cockpit" />
```

---

## Implementation Checklist

When building or reviewing a feature:
1. Where does the data come from? → Fetch in Server Component, pass as props
2. What needs interactivity? → Extract to a `'use client'` leaf component
3. Are there any heavy assets? → `next/image` + `placeholder="blur"`
4. Does it need code splitting? → Flag for performance-agent
