# Architecture Documentation

## Overview

This directory contains architectural documentation for the Interactive 3D Book Portfolio project.

## Contents

### `/adrs` - Architecture Decision Records

Contains all architectural decisions made during the project lifecycle. Each ADR documents:

- The context and problem
- Considered options
- The decision made
- Consequences and trade-offs

### System Architecture

High-level system design, component relationships, and data flow.

---

## Document Index

### Architecture Decision Records

- [ADR-0001: Tech Stack Selection](./adrs/0001-tech-stack-selection.md)
- [ADR-0002: 3D Library Choice](./adrs/0002-3d-library-choice.md)
- [ADR-0003: Animation Framework](./adrs/0003-animation-framework.md)
- [ADR-0004: Data Validation Strategy](./adrs/0004-data-validation-strategy.md)
- [ADR-0005: Deployment Strategy](./adrs/0005-deployment-strategy.md)

### System Diagrams

- Component Architecture (to be created)
- Data Flow Diagram (to be created)
- Deployment Architecture (to be created)

---

## How to Use This Documentation

### For Developers

1. Read the system architecture overview first
2. Review relevant ADRs before making significant changes
3. Create new ADRs for any architectural decisions
4. Keep diagrams updated as system evolves

### For AI Assistant (Claude)

- Reference ADRs when making implementation decisions
- Follow established patterns from architecture docs
- Propose new ADRs for significant changes
- Maintain consistency with documented decisions

### Creating a New ADR

Use the template in `adrs/template.md`. Follow the naming convention:

```
XXXX-short-title.md
```

Where XXXX is the next sequential number (padded to 4 digits).

---

## Architecture Principles

### 1. Simplicity First

- Choose the simplest solution that meets requirements
- Avoid over-engineering
- Prefer boring, proven technologies

### 2. Performance by Default

- Optimize for Core Web Vitals
- Lazy load non-critical resources
- Minimize JavaScript payload
- Progressive enhancement

### 3. Accessibility is Non-Negotiable

- WCAG 2.1 AA compliance minimum
- Keyboard navigation for all features
- Screen reader friendly
- Respects user preferences (reduced motion, color scheme)

### 4. Maintainability

- Clear separation of concerns
- Consistent code patterns
- Comprehensive documentation
- Type safety everywhere

### 5. Deployability

- Works on standard web hosting (no special runtime requirements)
- Simple deployment process
- Fast build times
- Easy rollback

### 6. User Experience

- Intuitive interactions
- Meaningful animations
- Fast perceived performance
- Mobile-first responsive design

---

## Technology Constraints

### Must Support

- **Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Devices**: Desktop, tablet, mobile
- **Hosting**: Standard static file hosting (Hostinger Business Plan)

### Progressive Enhancement

- Works without JavaScript (basic content accessible)
- Works without WebGL (fallback 2D experience)
- Works without animations (for reduced motion preference)

---

## Key Architectural Decisions Summary

1. **SvelteKit with Static Adapter** - Chosen for performance, DX, and Hostinger compatibility
2. **Three.js + Threlte** - Native Three.js for 3D with Svelte-friendly wrapper
3. **GSAP** - Industry-standard animation library with excellent timeline control
4. **Zod** - Runtime validation and compile-time type inference
5. **Tailwind CSS** - Utility-first CSS for rapid development and consistency

See individual ADRs for detailed rationale.

---

## Component Architecture

### High-Level Structure

```
┌─────────────────────────────────────────┐
│           SvelteKit App                 │
│  ┌───────────────────────────────────┐  │
│  │         Layout                    │  │
│  │  ┌─────────────┬──────────────┐  │  │
│  │  │ Navigation  │ Theme Toggle │  │  │
│  │  └─────────────┴──────────────┘  │  │
│  │  ┌─────────────────────────────┐ │  │
│  │  │     Book Component          │ │  │
│  │  │  ┌────────────────────────┐ │ │  │
│  │  │  │ Three.js Scene (Desk) │ │ │  │
│  │  │  │  ┌──────────────────┐  │ │ │  │
│  │  │  │  │ Book Geometry    │  │ │ │  │
│  │  │  │  │ Page Components  │  │ │ │  │
│  │  │  │  └──────────────────┘  │ │ │  │
│  │  │  └────────────────────────┘ │ │  │
│  │  └─────────────────────────────┘ │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         Data Layer (Zod)                │
│  ┌────────────────────────────────────┐ │
│  │ CV Data (TypeScript + Validation)  │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│      Stores (Svelte Stores)             │
│  - Theme State                          │
│  - Current Page                         │
│  - Animation State                      │
└─────────────────────────────────────────┘
```

### Data Flow

```
CV Data (Static)
    ↓
Zod Validation (Build Time)
    ↓
TypeScript Types (Compile Time)
    ↓
Svelte Components (Runtime)
    ↓
Three.js Scene (Rendering)
    ↓
GSAP Animations (User Interaction)
```

---

## Performance Strategy

### Bundle Optimization

- Code splitting by route
- Dynamic imports for heavy 3D assets
- Tree shaking enabled
- Minification and compression

### Asset Optimization

- Images: WebP format with fallbacks
- Icons: SVG sprites
- Fonts: WOFF2 format, subset to used characters
- 3D Models: Low-poly with optimized textures

### Loading Strategy

```
Critical Path:
1. HTML (< 15KB)
2. Critical CSS (inline, < 10KB)
3. SvelteKit runtime (< 50KB)
4. Page component (< 30KB)

Deferred:
- Three.js library (lazy load)
- GSAP library (lazy load)
- Images (progressive/lazy)
- Contact form handler (on scroll)
```

### Rendering Strategy

- Static generation for all pages
- Client-side hydration for interactivity
- No server-side rendering needed
- Service worker for caching (optional)

---

## Security Considerations

### Content Security Policy

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval'; /* needed for Three.js */
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self';
connect-src 'self' [analytics-domain] [form-service-domain];
```

### Input Validation

- Contact form: Client and server-side validation
- No user-generated content (static site)
- Zod schemas for all data structures

### Dependencies

- Regular updates via Dependabot
- Audit with `pnpm audit`
- Lock file committed to ensure reproducible builds

---

## Testing Strategy

### Unit Tests (Vitest)

- Utility functions
- Data validation schemas
- Store logic

### Component Tests (Vitest + Testing Library)

- Individual Svelte components
- User interactions
- Accessibility

### E2E Tests (Playwright) - Optional

- Critical user flows
- Form submission
- Navigation
- Cross-browser

### Manual Testing

- Visual regression
- Performance (Lighthouse)
- Accessibility (aXe, WAVE)
- Real device testing

---

## Future Considerations

### Potential Enhancements

- Blog section with MDX
- Project case studies (detailed pages)
- Testimonials carousel
- Multilingual support (i18n)
- CMS integration for content updates
- More elaborate 3D scenes

### Scalability

- Current architecture supports up to 50+ pages
- Can migrate to SSR if dynamic content needed
- Can add API routes for dynamic features
- Can integrate with headless CMS

---

## References

- [SvelteKit Documentation](https://kit.svelte.dev/)
- [Three.js Documentation](https://threejs.org/docs/)
- [Threlte Documentation](https://threlte.xyz/)
- [GSAP Documentation](https://gsap.com/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Zod Documentation](https://zod.dev/)

---

**Last Updated**: 2025-12-31
**Maintained By**: Project Team
**Review Frequency**: Per phase or major change
