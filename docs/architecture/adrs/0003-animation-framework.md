# ADR-0003: Animation Framework Selection

## Status

**Accepted**

**Date**: 2025-12-31
**Deciders**: Development Team
**Consulted**: Animation library benchmarks, community feedback
**Informed**: All stakeholders

---

## Context

The 3D book portfolio requires sophisticated animations including:

- Page-turning with realistic physics
- Scroll-triggered content reveals
- Timeline-based orchestration
- Micro-interactions and hover effects
- Smooth transitions between states
- Respecting user accessibility preferences (prefers-reduced-motion)

We need an animation library that provides:

- Precise timeline control
- Easing functions
- ScrollTrigger support
- Performance optimization
- Cross-browser compatibility
- Integration with Svelte's reactivity

### Assumptions

- Animations are core to the portfolio experience
- Users expect smooth 60fps animations
- Performance on mobile devices is critical

### Constraints

- Must integrate with SvelteKit
- Must work with Three.js scenes
- Should not significantly increase bundle size
- Must respect accessibility preferences

### Requirements

- Timeline-based animation orchestration
- Scroll-based triggers
- Complex easing functions
- Declarative API preferred
- Good performance
- Active maintenance

---

## Decision Drivers

1. **Animation Control**: Precise control over timing, easing, and sequencing
2. **ScrollTrigger**: Scroll-based animation capabilities
3. **Performance**: 60fps on mid-range devices
4. **Bundle Size**: Reasonable impact on overall bundle
5. **Browser Support**: Works across all modern browsers
6. **Developer Experience**: Clear API and documentation
7. **Svelte Integration**: Works well with Svelte's reactivity

---

## Options Considered

### Option 1: GSAP (GreenSock Animation Platform)

**Description**: Industry-leading JavaScript animation library with extensive features and excellent performance.

**Pros**:

- Industry standard for complex animations
- Excellent performance (optimized for 60fps)
- ScrollTrigger plugin (best scroll-based animation tool)
- Timeline orchestration with precise control
- Rich easing functions (hundreds of options)
- Extensive plugin ecosystem
- Works seamlessly with Three.js
- Cross-browser compatibility (back to IE11)
- Active development and support
- Massive community and resources
- Works well with Svelte (framework-agnostic)

**Cons**:

- ~50KB (core + ScrollTrigger)
- Some advanced features require paid license (we only need free features)
- Imperative API (but fits animation needs)
- Learning curve for advanced features

**Costs**:

- Bundle: ~50KB (gzipped: ~15KB)
- Learning: Low-Medium (excellent docs)
- Maintenance: Low (stable APIs)
- License: Free (for standard features)

---

### Option 2: Framer Motion

**Description**: React-focused animation library with declarative API.

**Pros**:

- Declarative, component-based API
- Spring-based physics animations
- Layout animations out of the box
- Gesture support
- Good documentation

**Cons**:

- **React-only** (doesn't work with Svelte without hacks)
- Less control over complex timelines
- Larger bundle for equivalent features
- Limited ScrollTrigger capabilities
- Not ideal for Three.js integration

**Costs**:

- Bundle: ~60KB
- Learning: Low
- Maintenance: Medium
- **Major Issue**: Not compatible with Svelte

---

### Option 3: Svelte's Built-in Transitions + Motion

**Description**: Use Svelte's native transition, animate, and motion APIs.

**Pros**:

- **Zero bundle cost** (built into Svelte)
- Declarative API that fits Svelte perfectly
- Works with Svelte stores
- Simple for basic transitions
- Excellent developer experience in Svelte

**Cons**:

- **Very limited** for complex animations
- No timeline orchestration
- No ScrollTrigger equivalent
- Basic easing functions only
- Not designed for Three.js integration
- Can't handle page-turning complexity
- No physics-based animations

**Costs**:

- Bundle: 0KB
- Learning: Very low
- Maintenance: Low
- **Capability Gap**: Can't achieve desired effects

---

### Option 4: Anime.js

**Description**: Lightweight JavaScript animation library.

**Pros**:

- Lightweight (~9KB)
- Simple, clean API
- Works with any framework
- Good documentation
- Timeline support

**Cons**:

- Less powerful than GSAP
- **No ScrollTrigger** (major limitation for our use case)
- Smaller community
- Fewer easing options
- Less optimized for complex scenes
- Limited Three.js integration examples

**Costs**:

- Bundle: ~9KB
- Learning: Low
- Maintenance: Medium
- **Major Gap**: No scroll-based animations

---

### Option 5: CSS Animations + Intersection Observer

**Description**: Use CSS animations/transitions triggered by Intersection Observer for scroll effects.

**Pros**:

- Native browser APIs (zero bundle)
- Hardware accelerated
- Simple to implement
- Good performance

**Cons**:

- **Very limited control** for complex animations
- No timeline orchestration
- Difficult to coordinate multiple animations
- Can't handle page-turning physics
- No JavaScript-driven dynamic animations
- Intersection Observer is basic (not scroll-position-based)

**Costs**:

- Bundle: 0KB
- Learning: Low
- Maintenance: Low
- **Capability Gap**: Can't achieve book-turning effect

---

## Decision

**Chosen Option**: **Option 1 - GSAP (GreenSock Animation Platform)**

### Rationale

GSAP was chosen because it's the **only option that meets all requirements**:

1. **Timeline Orchestration**: GSAP's timeline system allows precise sequencing of page-turning animations, where multiple elements need to animate in perfect coordination.

2. **ScrollTrigger**: The ScrollTrigger plugin is the industry's best tool for scroll-based animations. It provides:
   - Pin/scrub functionality
   - Start/end trigger points
   - Progress-based animation control
   - Smooth scrubbing

   This is **essential** for scroll-based page turning or alternative navigation.

3. **Performance**: GSAP is optimized for 60fps and includes:
   - Hardware acceleration
   - Automatic will-change management
   - Efficient render batching
   - Minimal layout thrashing

4. **Three.js Integration**: GSAP is widely used with Three.js. Can animate:
   - Camera positions
   - Object transformations
   - Material properties
   - Scene lighting

   Excellent for coordinating 2D and 3D animations.

5. **Easing Functions**: Hundreds of easing options including:
   - Elastic, bounce, back
   - Custom bezier curves
   - SteppedEase for mechanical effects

   Critical for realistic book page curls and physics-based motion.

6. **Svelte Compatibility**: GSAP is framework-agnostic and works perfectly with Svelte:

   ```svelte
   <script>
   	import { onMount } from 'svelte';
   	import gsap from 'gsap';

   	onMount(() => {
   		gsap.to('.element', { x: 100, duration: 1 });
   	});
   </script>
   ```

7. **Industry Standard**: Used by major companies (Google, Nike, Apple) and animation studios. This provides:
   - Confidence in stability
   - Abundant resources and examples
   - Active community support
   - Long-term viability

8. **Accessibility**: Built-in support for `prefers-reduced-motion`:
   ```javascript
   gsap.config({ reducedMotion: 'auto' });
   ```

### Implementation Notes

- Use GSAP core + ScrollTrigger plugin (~50KB total)
- Load GSAP early (needed for initial animations)
- Create reusable animation utilities:
  ```typescript
  // lib/animations/page-turn.ts
  export function animatePageTurn(page: HTMLElement) {
  	return gsap
  		.timeline()
  		.to(page, { rotationY: -180, duration: 1.2, ease: 'power2.inOut' })
  		.to(page, { z: -10, duration: 0.6 }, 0);
  }
  ```
- Integrate with Svelte stores for animation state
- Use GSAP Context for cleanup:
  ```javascript
  onMount(() => {
  	const ctx = gsap.context(() => {
  		// animations
  	});
  	return () => ctx.revert(); // cleanup
  });
  ```

---

## Consequences

### Positive

- **Complete Control**: Can create any animation effect needed
- **Best-in-Class ScrollTrigger**: Scroll-based interactions will be smooth and precise
- **Performance**: Achieves 60fps with proper optimization
- **Future-Proof**: Can add complex animations without library limitations
- **Portfolio Value**: GSAP experience is valuable and recognized in industry
- **Three.js Synergy**: Seamless integration with 3D elements

### Negative

- **Bundle Size**: Adds ~50KB (~15KB gzipped) to bundle
- **Imperative API**: Less "Svelte-like" than declarative approaches (but animation is inherently imperative)
- **Learning Curve**: Advanced features require study (but excellent docs available)
- **Commercial Features**: Some advanced plugins require paid license (not needed for our use case)

### Neutral

- **Overkill for Simple Animations**: Could use simpler solutions for basic transitions (but we need complex animations)
- **Framework-Agnostic**: Not specifically designed for Svelte (but this is actually a pro for portability)

### Risks

- **Risk**: Bundle size impacts load time
  - **Mitigation**: 15KB gzipped is acceptable for the capabilities gained; can lazy load if needed

- **Risk**: Learning curve slows development
  - **Mitigation**: Strong documentation; start with basic features; many examples available

- **Risk**: Over-animating the portfolio
  - **Mitigation**: Follow animation principles; respect reduced-motion; user testing

---

## Validation

Success criteria:

- [ ] Page-turning animation runs at 60fps on desktop
- [ ] Page-turning runs at 30fps minimum on mobile
- [ ] ScrollTrigger enables smooth scroll-based navigation
- [ ] Animations respect prefers-reduced-motion
- [ ] No jank or frame drops during complex animations
- [ ] Timeline orchestration works for multi-element sequences

**Performance Targets**:

- Desktop: 60fps sustained
- Mobile (iPhone 11+): 30fps minimum
- No layout thrashing
- Smooth scroll interactions

---

## Follow-up Actions

- [ ] Install GSAP and ScrollTrigger plugin
- [ ] Create animation utility library
- [ ] Build page-turn animation prototype
- [ ] Test scroll-based navigation
- [ ] Implement reduced-motion support
- [ ] Document animation patterns

---

## Related Decisions

- [ADR-0001: Tech Stack Selection](./0001-tech-stack-selection.md) - SvelteKit context
- [ADR-0002: 3D Library Choice](./0002-3d-library-choice.md) - Three.js integration

---

## References

- [GSAP Official Site](https://gsap.com/)
- [ScrollTrigger Documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP + Svelte Examples](https://gsap.com/community/forums/topic/33094-gsap-and-svelte/)
- [Three.js + GSAP Integration](https://greensock.com/forums/topic/16993-gsap-with-threejs/)
- [GSAP Performance Tips](https://gsap.com/resources/mistakes/)

---

## Notes

- GSAP is free for standard features (what we need)
- ClubGreenSock membership ($99/year) provides advanced plugins (not required for MVP)
- ScrollSmoother plugin (paid) could enhance experience but not essential
- Consider GSAP for future enhancements (drag interactions, morphing, etc.)

---

**Revision History**:

- 2025-12-31: Initial decision recorded
