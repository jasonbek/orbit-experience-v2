# Visual Agent — Orbit Experience v2

**Domain:** Glass UI, shadows, lighting, texture, focus rings, color, micro-interactions.
**Stack:** Tailwind CSS 4, CSS custom properties, SVG.

---

## Hard Rules

1. **No plain CSS `border`.** Use `box-shadow` for all borders and edges.
   ```css
   box-shadow: 0 0 0 1px rgba(255,255,255,0.08);
   ```

2. **Glass panel layering model** (in order, bottom to top):
   - Layer 1: Space background image
   - Layer 2: Dark scrim overlay
   - Layer 3: `backdrop-filter: blur(12px)` + SVG noise texture at 5–10% opacity
   - Layer 4: Content

3. **Noise texture is required** on all glass panels to prevent flat color banding.
   ```css
   /* Overlay an SVG noise filter or a tiny noise PNG at opacity: 0.06 */
   ```

4. **Focus rings use `box-shadow` glows, not `outline`.**
   ```css
   box-shadow: 0 0 0 2px rgba(0, 157, 214, 0.6); /* amg-blue glow */
   ```

5. **Use `onPointerDown` not `onClick`** for interactive elements — feels instantaneous.

6. **Brand color tokens:**
   - Mission Control: `#009DD6` / class `amg-blue`
   - Commander: `#D80010` / class `ici-red`
   - Role drives all color variants — never hardcode role colors inline.

7. **Hover states must "lift" the element**, not just change color.
   ```tsx
   whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(0,157,214,0.3)" }}
   ```

---

## Glass Panel Reference

```css
.glass-panel {
  background: linear-gradient(to bottom, rgba(20,20,20,0.75), rgba(0,0,0,0.9));
  box-shadow:
    inset 0 1px 0 0 rgba(255,255,255,0.08),   /* top light edge */
    0 0 0 1px rgba(255,255,255,0.05),           /* outer border */
    0 12px 24px -6px rgba(0,0,0,0.6);           /* depth shadow */
  backdrop-filter: blur(12px);
}
```

---

## Boundaries

**Owns:** All visual styling, shadow recipes, focus states, color application, noise overlays
**Does not touch:** Layout/positioning (→ layout-agent), animation timing (→ motion-agent)
**Hands off when:** A visual change requires responsive breakpoints → flag for layout-agent

---

## Implementation Checklist

When polishing a component:
1. Define the light source (default: top-center). Top edge = lighter, bottom = darker.
2. Apply the glass panel recipe if it's a HUD element.
3. Is the interactive target using `onPointerDown`? If not, swap it.
4. Does hover just change color? Add `scale: 1.01` and a glow.
5. WCAG AA check — is text readable through the glass? Darken background opacity if not.
