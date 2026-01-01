# Claude Context Document

## Project Overview

**Project Name**: Interactive 3D Book Portfolio
**Owner**: [Your Name]
**Status**: In Development
**Last Updated**: 2025-12-31

## Objective

Build a production-grade, interactive 3D book-style portfolio website that:

- Showcases professional experience, projects, and skills in an engaging way
- Demonstrates expertise in modern web technologies
- Provides an intuitive, memorable user experience
- Is deployable on Hostinger Business Web Hosting plan
- Achieves excellent performance and accessibility standards

## Core Concept

**3D Interactive Book Portfolio** - A digital book that users can flip through, with each page/spread containing different portfolio sections. The book sits on a 3D desk scene with ambient lighting and subtle animations.

### Key Features

- Realistic page-turning animations
- Smooth scroll-driven or click-based navigation
- Interactive elements that pop out from pages
- Responsive design (desktop: book, mobile: card swipes)
- Theme switcher (light/dark mode)
- Keyboard navigation support
- Downloadable CV/resume
- Contact form integration
- Analytics tracking

## Tech Stack

### Core Framework

- **SvelteKit** (v2.x) with Static Adapter
  - **IMPORTANT**: Always use **Svelte 5** (not Svelte 4)
  - Svelte 5 features: Runes, enhanced reactivity, better TypeScript support
  - Generates static HTML/CSS/JS for universal hosting compatibility
  - Excellent performance and small bundle size
  - Built-in transitions and animations
  - **MCP Server**: Svelte MCP configured for production-grade suggestions from official docs

### Languages & Type Safety

- **TypeScript** (strict mode enabled)
  - All code must be strongly typed
  - No `any` types without explicit justification
- **Zod** (v3.x) for runtime schema validation
  - All CV data validated at build time
  - Type inference for TypeScript integration

### 3D & Animations

- **Three.js** (latest) + **Threlte** (Svelte wrapper)
  - 3D desk scene, lighting, ambient effects
- **GSAP** (GreenSock Animation Platform)
  - Page turning animations
  - Scroll-triggered animations
  - Timeline orchestration

### Styling

- **Tailwind CSS** (v4.x)
  - Utility-first approach
  - Custom theme configuration
  - Responsive design utilities
- **PostCSS** with plugins
  - Autoprefixer
  - CSS nesting

### Build Tools

- **Vite** (bundled with SvelteKit)
  - Fast HMR during development
  - Optimized production builds
- **PNPM** as package manager
  - Faster installs, disk efficient

### Code Quality

- **ESLint** + **Prettier**
  - Consistent code formatting
  - Type-aware linting
- **Svelte Check**
  - Type checking for Svelte files
- **Vitest**
  - Unit testing framework
- **Playwright** (optional)
  - E2E testing for critical flows

### Deployment (Platform Agnostic)

- **Multiple Deployment Options** - Built to deploy anywhere:
  - **Hostinger Business Web Hosting** (primary target)
    - Static file deployment via FTP/SFTP
    - Custom domain configuration
    - SSL certificate included
  - **Vercel** (alternative, zero-config deployment)
    - Automatic deployments from Git
    - Global CDN
    - Preview deployments
  - **Netlify** (alternative)
    - Similar to Vercel with drag-and-drop support
  - **VPS/Cloud Hosting** (DigitalOcean, AWS, etc.)
    - Docker containerization ready
    - Nginx/Apache static file serving
  - **GitHub Pages** (fallback for testing)
- **Build Output**: Pure static HTML/CSS/JS - works on any web server

### Optional Enhancements

- **Vercel Analytics** or **Google Analytics 4**
- **Formspree** or **EmailJS** for contact form
- **Sharp** for image optimization
- **SVG Sprite** for icons

## Code Style Guidelines

### Core Development Principles (CRITICAL)

These principles are **non-negotiable** and must be followed throughout development:

1. **Single Responsibility Principle (SRP)**
   - Each file, component, and function does ONE thing well
   - Components should be small and focused (< 200 lines ideal)
   - Functions should be pure when possible
   - Example: `BookPage.svelte` only renders a page, not handle navigation

2. **Don't Repeat Yourself (DRY)**
   - Extract repeated logic into utility functions
   - Create composable components for reuse
   - Use Svelte stores for shared state
   - BUT: Don't over-abstract - 2 instances is not a pattern

3. **You Aren't Gonna Need It (YAGNI)**
   - Only implement what's needed NOW
   - No speculative features or abstractions
   - Don't build for hypothetical future requirements
   - Keep it simple until complexity is justified

4. **Production-Grade Standards**
   - **Write clean, readable code** - prioritize clarity over cleverness
   - **Type safety everywhere** - strict TypeScript, no `any` types
   - **Accessibility first** - semantic HTML, ARIA labels, keyboard navigation
   - **Performance conscious** - lazy loading, code splitting, optimized assets
   - **Test critical paths** - unit tests for business logic, E2E for user flows
   - **Document complex logic** - JSDoc comments for non-obvious code

### Industry-Standard Folder Structure (SvelteKit + Svelte 5)

```
portfolio/
├── src/
│   ├── lib/                           # Shared library code
│   │   ├── components/                # Reusable UI components
│   │   │   ├── ui/                    # Base UI components (Button, Card, etc.)
│   │   │   │   ├── button/
│   │   │   │   │   ├── Button.svelte
│   │   │   │   │   ├── button.test.ts
│   │   │   │   │   └── index.ts       # Barrel export
│   │   │   │   └── card/
│   │   │   │       ├── Card.svelte
│   │   │   │       └── index.ts
│   │   │   ├── book/                  # Book-specific components
│   │   │   │   ├── Book.svelte
│   │   │   │   ├── BookPage.svelte
│   │   │   │   ├── PageTurn.svelte
│   │   │   │   └── index.ts
│   │   │   └── layout/                # Layout components
│   │   │       ├── Header.svelte
│   │   │       ├── Footer.svelte
│   │   │       └── Navigation.svelte
│   │   ├── stores/                    # Svelte stores (state management)
│   │   │   ├── theme.svelte.ts       # Using Svelte 5 runes
│   │   │   ├── page-navigation.svelte.ts
│   │   │   └── animation.svelte.ts
│   │   ├── utils/                     # Utility functions
│   │   │   ├── animations/
│   │   │   │   ├── page-turn.ts
│   │   │   │   └── scroll-trigger.ts
│   │   │   ├── formatters/
│   │   │   │   ├── date.ts
│   │   │   │   └── duration.ts
│   │   │   └── validators/
│   │   │       └── form.ts
│   │   ├── types/                     # TypeScript type definitions
│   │   │   ├── cv.types.ts
│   │   │   ├── book.types.ts
│   │   │   └── index.ts
│   │   ├── constants/                 # Application constants
│   │   │   ├── theme.ts
│   │   │   └── config.ts
│   │   ├── hooks/                     # Svelte 5 composables (optional)
│   │   │   ├── use-page-turn.svelte.ts
│   │   │   └── use-theme.svelte.ts
│   │   └── server/                    # Server-side code (if needed)
│   │       └── api/
│   ├── routes/                        # SvelteKit routes
│   │   ├── +page.svelte              # Home page
│   │   ├── +layout.svelte            # Root layout
│   │   ├── +layout.ts                # Layout load function
│   │   └── +error.svelte             # Error page
│   ├── app.html                       # HTML template
│   ├── app.css                        # Global styles
│   └── app.d.ts                       # Global type definitions
├── static/                            # Static assets
│   ├── images/
│   ├── fonts/
│   └── favicon.png
├── data/                              # CV data (outside src/)
│   ├── schemas/
│   │   └── cv.schema.ts
│   └── cv-data.ts
├── tests/                             # Test files
│   ├── unit/
│   └── e2e/
└── docs/                              # Documentation
```

### File Naming Conventions

- **Components**: `PascalCase.svelte` (e.g., `BookPage.svelte`, `NavBar.svelte`)
- **Utilities**: `kebab-case.ts` (e.g., `date-formatter.ts`, `page-turn.ts`)
- **Stores**: `kebab-case.svelte.ts` (Svelte 5 runes) or `.ts` (e.g., `theme.svelte.ts`)
- **Types**: `kebab-case.types.ts` or `.d.ts` (e.g., `cv.types.ts`)
- **Tests**: `*.test.ts` or `*.spec.ts` alongside source files
- **Barrel Exports**: `index.ts` in component folders for clean imports

### TypeScript Standards (Strict Mode)

```typescript
// ✅ Good - Explicit types, descriptive names, proper exports
export interface ExperienceItem {
	id: string;
	title: string;
	company: string;
	startDate: Date;
	endDate: Date | null;
}

export function formatExperience(experience: ExperienceItem): string {
	const duration = calculateDuration(experience.startDate, experience.endDate);
	return `${experience.title} at ${experience.company} (${duration})`;
}

// ✅ Good - Type guards for runtime safety
export function isCurrentPosition(experience: ExperienceItem): boolean {
	return experience.endDate === null;
}

// ❌ Bad - Implicit any, vague names, no exports
function format(exp) {
	return exp.title;
}

// ❌ Bad - Using 'any' type
function processData(data: any) {
	return data.value;
}

// ✅ Good alternative - Use generics or unknown
function processData<T extends { value: string }>(data: T): string {
	return data.value;
}
```

### Svelte 5 Component Structure (Using Runes)

```svelte
<script lang="ts">
	/**
	 * BookPage Component
	 * Renders a single page in the 3D book with content
	 *
	 * @component
	 */

	// 1. Imports (grouped by type)
	// External libraries
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	// Internal components
	import Card from '$lib/components/ui/card/Card.svelte';

	// Types
	import type { PageContent } from '$lib/types';

	// Utils
	import { formatDate } from '$lib/utils/formatters/date';

	// 2. Props (Svelte 5 runes - NEW!)
	interface Props {
		content: PageContent;
		pageNumber: number;
		isActive?: boolean;
	}

	let { content, pageNumber, isActive = $bindable(false) }: Props = $props();

	// 3. State (Svelte 5 runes - NEW!)
	let isLoading = $state(false);
	let animationProgress = $state(0);

	// 4. Derived state (Svelte 5 runes - NEW!)
	let displayTitle = $derived(content.title.toUpperCase());
	let isOddPage = $derived(pageNumber % 2 !== 0);

	// 5. Effects (Svelte 5 runes - NEW!)
	$effect(() => {
		// Runs when dependencies change
		if (isActive) {
			console.log(`Page ${pageNumber} is now active`);
		}
	});

	// 6. Functions (pure, single responsibility)
	function handleClick(event: MouseEvent) {
		isActive = true;
		// Emit custom event if needed
	}

	function animateEntry() {
		gsap.to(element, { opacity: 1, duration: 0.5 });
	}

	// 7. Lifecycle
	let element: HTMLDivElement;

	onMount(() => {
		animateEntry();
		return () => {
			// Cleanup
		};
	});
</script>

<!-- 8. Template (semantic HTML, accessible) -->
<div
	bind:this={element}
	class="book-page"
	class:active={isActive}
	class:odd={isOddPage}
	role="article"
	aria-label={`Page ${pageNumber}: ${content.title}`}
>
	<Card>
		<h2>{displayTitle}</h2>
		<p>{content.description}</p>
		<button onclick={handleClick} aria-label="Activate page"> View Details </button>
	</Card>
</div>

<!-- 9. Component-scoped styles (prefer Tailwind, use scoped for unique cases) -->
<style>
	.book-page {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.book-page.active {
		z-index: 10;
	}
</style>
```

### Key Svelte 5 Changes (IMPORTANT)

- **`$props()`** - Replace `export let` for props
- **`$state()`** - Replace `let` for reactive state
- **`$derived()`** - Replace `$:` for derived values
- **`$effect()`** - Replace reactive statements for side effects
- **`$bindable()`** - For two-way binding of props
- **Event handlers** - Use `onclick` instead of `on:click` (lowercase)

### Git Commit Convention

Follow Conventional Commits:

```
feat: add page turn animation
fix: resolve mobile layout issue
docs: update architecture decision record
style: format code with prettier
refactor: simplify book navigation logic
test: add unit tests for date formatter
chore: update dependencies
perf: optimize 3D scene rendering
```

### CSS/Tailwind Usage

- Use Tailwind utilities for common patterns
- Extract repeated patterns into components
- Use CSS custom properties for theming
- Avoid inline styles unless dynamic

```svelte
<!-- ✅ Good -->
<div class="rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
	<h2 class="text-2xl font-bold text-gray-900 dark:text-white">
		{title}
	</h2>
</div>

<!-- ❌ Bad -->
<div style="padding: 24px; background: white;">
	<h2 style="font-size: 24px;">{title}</h2>
</div>
```

## Content Structure (CV Sections)

### 1. Cover Page

- Full name
- Professional title
- Tagline/motto
- Subtle animations

### 2. Table of Contents

- Clickable chapter navigation
- Progress indicator

### 3. About Me (Spread)

- Professional photo
- Bio paragraph
- Key highlights
- Location, contact preview

### 4. Experience Timeline

- Work history (reverse chronological)
- Company, role, duration
- Key achievements
- Technologies used

### 5. Technical Skills

- Categorized skill groups
- Proficiency indicators
- Interactive visualizations

### 6. Featured Projects

- 3-5 major projects
- Screenshots/demos
- Tech stack
- Links to live/GitHub
- Pop-up details on interaction

### 7. Education & Certifications

- Degrees
- Certifications
- Courses
- Awards

### 8. Contact Page

- Contact form
- Email, phone
- Social media links
- Download CV button

### 9. Back Cover

- Thank you message
- Footer links
- Copyright

## Design Principles

### Visual Design

- **Clean & Professional** - not too playful, not too corporate
- **Consistent Typography** - max 2-3 font families
- **Purposeful Color Palette** - primary, secondary, accent colors
- **Ample White Space** - let content breathe
- **Subtle 3D Effects** - enhance but don't overwhelm

### Animation Guidelines

- **Meaningful Motion** - animations should serve a purpose
- **Smooth & Natural** - 60fps target, easing functions
- **Respects Prefers-Reduced-Motion** - accessibility consideration
- **Progressive Enhancement** - works without JS/3D support

### Performance Targets

- **Lighthouse Score**: 90+ across all metrics
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: < 200KB initial JS

## Hosting Requirements

### Hostinger Business Plan Compatibility

- Outputs static HTML/CSS/JS files
- No server-side rendering required
- No Node.js runtime needed
- Uses standard file structure
- Optimized assets (compressed images, minified code)

### Deployment Process

1. Build static site: `pnpm build`
2. Test production build locally
3. Upload `build/` folder to Hostinger via FTP/File Manager
4. Configure custom domain (if applicable)
5. Verify SSL certificate
6. Test on multiple devices

## Development Environment

### Prerequisites

- Node.js v20+ (LTS)
- PNPM v9+
- Git
- VS Code (recommended) with extensions:
  - Svelte for VS Code
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier

### Environment Variables

```env
# .env.local (not committed)
VITE_ANALYTICS_ID=your_analytics_id
VITE_FORMSPREE_ID=your_form_id
```

## Success Criteria

- ✅ All CV sections implemented and populated
- ✅ Smooth page turning on all modern browsers
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Passes accessibility audit (WCAG 2.1 AA)
- ✅ Achieves performance targets
- ✅ Successfully deployed on Hostinger
- ✅ Contact form functional
- ✅ Downloadable CV available
- ✅ No console errors or warnings

## References & Inspiration

- Bruno Simon Portfolio: bruno-simon.com
- Richard Mattka: richardmattka.com
- Three.js Examples: threejs.org/examples
- GSAP Demos: gsap.com/demos
- Threlte Documentation: threlte.xyz

## MCP Servers Configured

This project has the following MCP (Model Context Protocol) servers configured for enhanced AI assistance:

### 1. Svelte MCP Server ✅

- **Command**: `npx -y @sveltejs/mcp`
- **Scope**: Project
- **Purpose**: Provides production-grade Svelte 5 guidance directly from official documentation
- **Usage**: Automatically consulted for Svelte-specific questions and code generation
- **Features**:
  - Svelte 5 runes syntax (`$props`, `$state`, `$derived`, `$effect`)
  - SvelteKit best practices
  - Component patterns and conventions
  - Performance optimization tips

### 2. CAP/CDS MCP Server

- **Status**: Available (for SAP CAP projects)
- **Not actively used** in this portfolio project

### 3. UI5 MCP Server

- **Status**: Available (for SAP UI5 projects)
- **Not actively used** in this portfolio project

### When to Consult MCP Servers

- When implementing Svelte 5 components (always use Svelte MCP)
- When unsure about SvelteKit conventions
- When looking for production-grade patterns
- When debugging Svelte-specific issues

## Notes for Claude (CRITICAL - READ EVERY SESSION)

### Core Requirements

1. **ALWAYS use Svelte 5** - Never use Svelte 4 syntax
   - Use runes: `$props()`, `$state()`, `$derived()`, `$effect()`
   - Use lowercase event handlers: `onclick` not `on:click`
   - Consult Svelte MCP server for guidance

2. **Follow SRP, DRY, YAGNI religiously**
   - Components < 200 lines
   - Extract repeated logic
   - Don't build speculative features

3. **Industry-standard folder structure**
   - Follow the documented structure exactly
   - Group by feature/domain, not by type
   - Use barrel exports (`index.ts`)

4. **Type safety everywhere**
   - Strict TypeScript mode (no `any`)
   - Zod schemas for data validation
   - Runtime type guards where needed

5. **Production-grade code quality**
   - JSDoc comments for complex logic
   - Unit tests for business logic
   - Accessible HTML (ARIA, semantic tags)
   - Performance-first (lazy load, code split)

### Development Workflow

- Always reference this document for project context
- Update this document when tech stack or requirements change
- Maintain consistency with established patterns
- Prioritize user experience and performance
- Ask for clarification before making architectural decisions
- Keep the user informed of progress and blockers
- Consult Svelte MCP server for Svelte 5 best practices

### Deployment Flexibility

- Build outputs **pure static files** (HTML/CSS/JS)
- Works on **any web server** (Hostinger, Vercel, Netlify, VPS, GitHub Pages)
- No server-side dependencies
- Test deployment locally before pushing to hosting

## Questions to Resolve

- [ ] Preferred color scheme/brand colors?
- [ ] Professional headshot available?
- [ ] Social media profiles to include?
- [ ] Any specific projects to highlight?
- [ ] Custom domain name?
- [ ] Preferred contact form service?
- [ ] Analytics preference?

---

**End of Context Document**
