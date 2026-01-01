# ADR-0002: 3D Library Choice

## Status

**Accepted**

**Date**: 2025-12-31
**Deciders**: Development Team
**Consulted**: Three.js community, performance benchmarks
**Informed**: Project stakeholders

---

## Context

The portfolio requires 3D rendering capabilities for the book visualization, desk scene, and animations. We need to select a 3D library that:

- Works well with SvelteKit
- Provides sufficient control for custom animations
- Has good performance on various devices
- Is well-documented and maintained
- Can render realistic book pages with physics-based interactions

### Assumptions

- Users have devices with WebGL support (99%+ of modern browsers)
- Fallback to 2D is acceptable for unsupported devices
- Developer has basic 3D graphics knowledge

### Constraints

- Must work in browser (WebGL)
- Must integrate with SvelteKit
- Must support custom shaders (for advanced effects)
- Should not significantly increase bundle size

### Requirements

- 3D scene management
- Lighting system
- Material system for realistic textures
- Animation support
- Camera controls
- Performance optimization features

---

## Decision Drivers

1. **Maturity**: Battle-tested in production
2. **Performance**: 60fps on mid-range devices
3. **Svelte Integration**: Native or good wrapper available
4. **Learning Resources**: Documentation and examples
5. **Bundle Size**: Keep overall bundle manageable
6. **Flexibility**: Custom animations and effects

---

## Options Considered

### Option 1: Three.js via Threlte (Recommended)

**Description**: Use Three.js (industry standard WebGL library) through Threlte, a Svelte wrapper that provides declarative, component-based 3D scene management.

**Pros**:

- Three.js is the de-facto standard for WebGL (90%+ market share)
- Massive ecosystem of examples, plugins, tutorials
- Threlte provides Svelte-native API (components, stores, reactivity)
- Excellent performance optimization features
- Active development and maintenance
- Can drop down to vanilla Three.js when needed
- Built-in helpers for common tasks
- Strong TypeScript support

**Cons**:

- Three.js alone is ~600KB (but tree-shakeable to ~150KB for our use)
- Threlte adds ~30KB
- Learning curve for 3D concepts if new to graphics
- Threlte is younger than some alternatives (but stable)

**Costs**:

- Bundle: ~180KB (minified, with what we need)
- Learning: Low if familiar with Three.js, Medium if new to both
- Maintenance: Low (stable APIs)

**Example**:

```svelte
<script>
	import { Canvas } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import Book from './Book.svelte';
</script>

<Canvas>
	<Book />
	<OrbitControls />
</Canvas>
```

---

### Option 2: Babylon.js

**Description**: Microsoft's comprehensive 3D engine with game engine features, physics, and more built-in.

**Pros**:

- More features out of the box (physics, particles, audio)
- Great documentation and playground
- TypeScript-first development
- Strong performance
- Inspector tool for debugging

**Cons**:

- Much larger bundle size (~800KB minimum)
- Overkill for our needs (we don't need game engine features)
- No official Svelte integration
- More complex API for simple tasks
- Smaller community than Three.js

**Costs**:

- Bundle: ~800KB+ (much larger than Three.js)
- Learning: High (complex API)
- Maintenance: Medium

---

### Option 3: Vanilla Three.js (No Wrapper)

**Description**: Use Three.js directly without Threlte wrapper, managing scene imperatively.

**Pros**:

- Direct control over everything
- Slightly smaller bundle (no wrapper overhead)
- Maximum flexibility
- More learning resources available

**Cons**:

- Imperative API doesn't fit Svelte's reactive paradigm
- More boilerplate code
- Harder to manage component lifecycle
- Manual cleanup required
- Less idiomatic Svelte code

**Costs**:

- Bundle: ~150KB (our needed features)
- Learning: Medium (Three.js concepts)
- Maintenance: Medium (more manual work)

**Example**:

```javascript
// Lots of imperative code in onMount/onDestroy
let scene, camera, renderer;
onMount(() => {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(/*...*/);
	renderer = new THREE.WebGLRenderer();
	// ... manual setup
});
```

---

### Option 4: CSS 3D Transforms Only

**Description**: Use pure CSS 3D transforms for the book effect, no WebGL.

**Pros**:

- Zero bundle size for 3D library
- Hardware accelerated
- Simpler to implement for basic effects
- Better browser compatibility
- Easier to debug

**Cons**:

- Very limited compared to WebGL
- No realistic lighting or materials
- Can't render complex desk scene
- Limited animation capabilities
- Harder to achieve photorealistic effects

**Costs**:

- Bundle: 0KB (CSS only)
- Learning: Low
- Maintenance: Low

---

## Decision

**Chosen Option**: **Option 1 - Three.js via Threlte**

### Rationale

1. **Industry Standard**: Three.js is the proven choice for WebGL in browsers. Nearly every major 3D web project uses it. This provides:
   - Extensive documentation
   - Huge community for support
   - Abundant examples and tutorials
   - Long-term stability

2. **Svelte Integration**: Threlte transforms Three.js imperative API into Svelte's declarative paradigm:

   ```svelte
   <!-- Declarative and reactive -->
   <T.Mesh {position} {rotation}>
   	<T.BoxGeometry args={[1, 1, 1]} />
   	<T.MeshStandardMaterial color={$themeColor} />
   </T.Mesh>
   ```

   This is much more maintainable than managing WebGL state manually.

3. **Right Level of Control**: Three.js provides low-level control when needed (custom shaders, optimization) but also high-level abstractions (materials, lights, helpers).

4. **Performance**: Three.js has excellent performance optimization features:
   - Frustum culling (automatic)
   - LOD (Level of Detail) system
   - Efficient batching
   - Optimized for 60fps

5. **Bundle Size Acceptable**: While Three.js is large, we can tree-shake to include only what we need (~180KB total). This is acceptable for a portfolio site where visual impact is important.

6. **Flexibility**: If Threlte's abstractions are ever limiting, we can drop down to vanilla Three.js for specific features.

7. **Future-Proof**: Three.js is actively maintained by a large team and community. It's not going anywhere.

### Implementation Notes

- Use Threlte components for scene structure
- Drop to vanilla Three.js for custom animations
- Implement LOD for complex models
- Use DRACO compression for any external 3D models
- Lazy load Three.js bundle until needed (after hero content)
- Provide 2D fallback for browsers without WebGL

```javascript
// Lazy load strategy
if (WebGLSupported) {
	const { initializeScene } = await import('./3d-scene');
	initializeScene();
} else {
	const { init2DFallback } = await import('./2d-fallback');
	init2DFallback();
}
```

---

## Consequences

### Positive

- **Proven Technology**: Using battle-tested library reduces technical risk
- **Rich Ecosystem**: Can leverage existing Three.js resources
- **Developer Experience**: Threlte makes 3D code feel natural in Svelte
- **Performance**: Can achieve 60fps on mid-range devices with proper optimization
- **Flexibility**: Can implement advanced effects when needed
- **Portfolio Value**: Demonstrates WebGL/3D expertise

### Negative

- **Bundle Size**: Adds ~180KB to bundle (but lazy-loaded)
- **Learning Curve**: Team needs to understand both Three.js and Threlte concepts
- **Overkill for Simple Interactions**: If we only need basic page flips, this is overkill (but we want immersive experience)

### Neutral

- **Abstraction Layer**: Threlte adds abstraction but makes code more maintainable
- **WebGL Dependency**: Requires WebGL support (99%+ of browsers, fallback available)

### Risks

- **Risk**: Bundle size impacts initial load
  - **Mitigation**: Lazy load after critical content; code split; show loading state

- **Risk**: Performance issues on low-end devices
  - **Mitigation**: Implement quality settings; detect device capability; provide 2D fallback

- **Risk**: Threlte wrapper has bugs or limitations
  - **Mitigation**: Can bypass Threlte and use vanilla Three.js for specific features

---

## Validation

Success criteria:

- [ ] 3D book renders smoothly at 60fps on mid-range devices
- [ ] Bundle size for 3D scene < 200KB (gzipped)
- [ ] Page turn animations feel natural and responsive
- [ ] Desk scene loads within 2 seconds
- [ ] No console errors related to Three.js/Threlte
- [ ] 2D fallback works on browsers without WebGL

**Performance Targets**:

- 60fps on desktop (Chrome/Firefox/Safari)
- 30fps minimum on mobile (iPhone 11+, Android equivalent)
- < 2s to render first frame

---

## Follow-up Actions

- [ ] Create proof-of-concept with Threlte
- [ ] Test page turn animation performance
- [ ] Implement device capability detection
- [ ] Build 2D fallback version
- [ ] Optimize bundle size (tree-shaking)
- [ ] Document 3D component patterns

---

## Related Decisions

- [ADR-0001: Tech Stack Selection](./0001-tech-stack-selection.md) - Overall framework choice
- [ADR-0003: Animation Framework](./0003-animation-framework.md) - GSAP integration with Three.js

---

## References

- [Three.js Official Site](https://threejs.org/)
- [Threlte Documentation](https://threlte.xyz/)
- [Three.js Fundamentals](https://threejs.org/manual/)
- [WebGL Stats](https://caniuse.com/webgl)
- [Three.js Performance Tips](https://discoverthreejs.com/tips-and-tricks/)

---

## Notes

- Monitor Threlte development for new features
- Consider contributing back to Threlte if we build useful abstractions
- Keep eye on bundle size as features are added

---

**Revision History**:

- 2025-12-31: Initial decision recorded
