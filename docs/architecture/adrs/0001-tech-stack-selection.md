# ADR-0001: Tech Stack Selection

## Status

**Accepted**

**Date**: 2025-12-31
**Deciders**: Project Owner, Development Team
**Consulted**: Industry best practices, hosting provider docs
**Informed**: All stakeholders

---

## Context

We need to select a modern, production-grade tech stack for building an interactive 3D book-style portfolio website. The website must:

- Be deployable on Hostinger Business Web Hosting (static file hosting)
- Support 3D graphics and complex animations
- Provide excellent performance and user experience
- Demonstrate technical expertise to potential employers/clients
- Be maintainable and scalable for future enhancements

### Assumptions

- Developer has experience with modern JavaScript frameworks
- Hostinger supports only static file hosting (no Node.js runtime)
- Users will access the site on modern browsers (latest 2 versions)
- Primary audience is technical recruiters and potential clients

### Constraints

- Must generate static HTML/CSS/JS files (no server-side runtime)
- Must work without custom server configuration
- Must achieve Lighthouse score 90+ across all metrics
- Budget: No paid libraries or services required for MVP

### Requirements

- TypeScript for type safety
- 3D rendering capabilities (WebGL)
- Advanced animation framework
- Schema validation for data integrity
- Modern styling solution
- Fast build times and development experience
- Small bundle size (< 200KB initial JS)

---

## Decision Drivers

1. **Hosting Compatibility**: Must work on standard static hosting
2. **Performance**: Smallest possible bundle, fastest load times
3. **Developer Experience**: Modern tooling, good documentation
4. **Type Safety**: Strong typing to prevent runtime errors
5. **Learning Value**: Stack should demonstrate modern best practices
6. **Maintainability**: Easy to update and extend
7. **Community Support**: Active ecosystem, good libraries

---

## Options Considered

### Option 1: SvelteKit + TypeScript + Three.js + GSAP

**Description**: SvelteKit as the meta-framework with static adapter, Three.js for 3D via Threlte wrapper, GSAP for animations, Tailwind for styling, Zod for validation.

**Pros**:

- Smallest bundle size among frameworks (Svelte compiles to vanilla JS)
- Built-in animation and transition support
- Excellent developer experience
- Static adapter perfect for Hostinger
- Threlte provides great Three.js integration
- Growing ecosystem, cutting-edge reputation
- Fast build times with Vite
- TypeScript support out of the box

**Cons**:

- Smaller ecosystem compared to React
- Fewer available component libraries
- Less common in job market (but shows initiative)
- Some libraries may lack Svelte wrappers

**Costs**:

- Learning curve: Low-Medium (if new to Svelte)
- Implementation: ~50-60 hours
- Maintenance: Low (simple architecture)

---

### Option 2: Next.js + React Three Fiber + Framer Motion

**Description**: Next.js with static export, React Three Fiber for 3D, Framer Motion for animations, Tailwind CSS, Zod validation.

**Pros**:

- Most popular framework, largest ecosystem
- Excellent TypeScript support
- React Three Fiber is mature and well-documented
- Framer Motion provides great animation APIs
- Easy to find help and resources
- More familiar to most developers
- Strong job market presence

**Cons**:

- Larger bundle size compared to Svelte
- More boilerplate code
- Static export can be tricky with some features
- Slower build times
- More complex configuration
- React's hydration can cause issues

**Costs**:

- Learning curve: Low (widely known)
- Implementation: ~55-65 hours
- Maintenance: Medium (more complexity)

---

### Option 3: Astro + Framework Islands

**Description**: Astro for static generation with React/Svelte islands for interactivity, Three.js directly, GSAP for animations, Tailwind CSS.

**Pros**:

- Zero JS by default, ship only what's needed
- Can mix frameworks (React for 3D, Svelte for UI)
- Best possible Core Web Vitals scores
- Simple mental model
- Excellent for content-heavy sites
- Native TypeScript support
- Fast builds

**Cons**:

- Interactivity requires "island" architecture (learning curve)
- 3D scenes might need entire pages to be islands
- Less conventional for highly interactive apps
- Communication between islands can be complex
- Smaller community than Next/React

**Costs**:

- Learning curve: Medium (new mental model)
- Implementation: ~60-70 hours
- Maintenance: Medium (island complexity)

---

### Option 4: Vue 3 + Nuxt + TresJS + GSAP

**Description**: Nuxt 3 with static generation, TresJS (Vue's Three.js wrapper), GSAP, Tailwind CSS, Zod validation.

**Pros**:

- Vue 3 Composition API with excellent TypeScript support
- TresJS provides Vue-native Three.js integration
- Nuxt has good static generation
- Great developer experience
- Good ecosystem
- Progressive framework

**Cons**:

- Larger bundle than Svelte
- TresJS is newer, less mature than React Three Fiber
- Vue 3 adoption still growing
- Less common in English-speaking job markets
- More complex than needed for this project

**Costs**:

- Learning curve: Medium
- Implementation: ~55-65 hours
- Maintenance: Medium

---

## Decision

**Chosen Option**: **Option 1 - SvelteKit + TypeScript + Three.js (Threlte) + GSAP**

### Rationale

SvelteKit was chosen because:

1. **Performance**: Svelte's compilation approach results in the smallest bundle size, which directly impacts Core Web Vitals. For a portfolio site, performance is crucial for first impressions.

2. **Hosting Compatibility**: The `@sveltejs/adapter-static` generates pure static files that work perfectly on Hostinger without any special configuration.

3. **Developer Experience**: Svelte's syntax is intuitive and requires less boilerplate than React. Built-in transitions and stores reduce dependency count.

4. **Differentiation**: Using SvelteKit demonstrates staying current with modern frameworks and willingness to adopt cutting-edge technology. This aligns with the goal of showcasing technical expertise.

5. **Threlte Integration**: Threlte provides excellent Svelte-native bindings for Three.js, making 3D development more intuitive with component-based approach.

6. **GSAP Compatibility**: GSAP works seamlessly with Svelte and provides industry-leading animation control needed for complex page-turning effects.

7. **Type Safety**: First-class TypeScript support with Zod integration provides both compile-time and runtime validation.

8. **Build Speed**: Vite-powered builds are significantly faster than webpack-based solutions, improving development iteration speed.

### Implementation Notes

- Use `pnpm` as package manager for fast, efficient installs
- Configure strict TypeScript mode from the start
- Setup ESLint + Prettier with Svelte plugins
- Use Threlte for all Three.js scene management
- Keep GSAP animations in separate composable files
- Implement theme system with CSS custom properties + Svelte stores
- Use SvelteKit's load functions for data validation with Zod

---

## Consequences

### Positive

- **Exceptional performance**: Lighthouse scores will likely exceed 95 across all categories
- **Small bundle size**: Faster downloads, especially on mobile networks
- **Simple deployment**: Static files can be drag-dropped to Hostinger
- **Clean codebase**: Less boilerplate means more readable code
- **Modern portfolio piece**: Shows initiative in learning new technology
- **Fast development**: Reactive statements and built-in features speed up implementation

### Negative

- **Smaller ecosystem**: May need to write custom solutions where React has libraries
- **Less familiar**: Team members or future contributors may need to learn Svelte
- **Fewer UI component libraries**: Will need to build more components from scratch (though this shows skill)
- **Job market**: Svelte less common in job postings (but growing rapidly)

### Neutral

- **Community size**: Smaller but highly engaged community
- **Learning curve**: Minimal for experienced developers but requires time investment
- **Documentation**: Good but not as extensive as React's ecosystem

### Risks

- **Risk**: Threlte may have bugs or limitations for complex 3D scenes
  - **Mitigation**: Can fall back to vanilla Three.js if needed; Threlte is just a wrapper

- **Risk**: Future contributors unfamiliar with Svelte
  - **Mitigation**: Comprehensive documentation; Svelte is easy to learn; portfolio is personal project

- **Risk**: Library incompatibilities
  - **Mitigation**: Most vanilla JS libraries work fine; test early with critical dependencies

---

## Validation

This decision will be validated by:

- Lighthouse audit achieving 90+ across all metrics
- Build size < 200KB for initial JS bundle
- Development velocity meeting timeline estimates
- Successful deployment to Hostinger without issues
- Positive feedback on portfolio performance and interactivity

**Success Criteria**:

- [ ] Lighthouse Performance: 90+
- [ ] Bundle size < 200KB
- [ ] Deploys successfully to Hostinger
- [ ] All interactive features work smoothly
- [ ] Development completed within estimated timeline

---

## Follow-up Actions

- [x] Document tech stack in claude.md
- [ ] Initialize SvelteKit project with TypeScript
- [ ] Install and configure all dependencies
- [ ] Create proof-of-concept for page-turning with Threlte + GSAP
- [ ] Setup CI/CD pipeline for automated testing

---

## Related Decisions

- [ADR-0002: 3D Library Choice](./0002-3d-library-choice.md) - Deep dive into Three.js selection
- [ADR-0003: Animation Framework](./0003-animation-framework.md) - Why GSAP over alternatives
- [ADR-0004: Data Validation Strategy](./0004-data-validation-strategy.md) - Zod for schemas

---

## References

- [SvelteKit Documentation](https://kit.svelte.dev/)
- [Svelte Performance Benchmarks](https://krausest.github.io/js-framework-benchmark/)
- [Threlte Documentation](https://threlte.xyz/)
- [Static Adapter Docs](https://kit.svelte.dev/docs/adapter-static)
- [Hostinger Static Site Hosting Guide](https://www.hostinger.com/tutorials/how-to-upload-a-website)

---

## Notes

- This decision can be revisited if Threlte proves inadequate for 3D requirements
- If bundle size exceeds targets, may need to evaluate code splitting strategies
- Keep monitoring Svelte ecosystem growth and adoption

---

**Revision History**:

- 2025-12-31: Initial decision recorded
