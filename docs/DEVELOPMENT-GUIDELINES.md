# Development Guidelines

## Quick Reference for Production-Grade Development

This document provides a quick reference for developers working on the Interactive 3D Book Portfolio project. For comprehensive context, see [claude.md](../claude.md).

---

## Critical Requirements ⚠️

### 1. Always Use Svelte 5

- **Never** use Svelte 4 syntax
- Use Svelte 5 runes: `$props()`, `$state()`, `$derived()`, `$effect()`
- Event handlers: `onclick` (lowercase), not `on:click`
- Consult Svelte MCP server when unsure

### 2. Follow Design Principles

- **SRP** - Single Responsibility Principle (one component = one job)
- **DRY** - Don't Repeat Yourself (extract reusable logic)
- **YAGNI** - You Aren't Gonna Need It (no speculative features)

### 3. Type Safety

- TypeScript strict mode (no `any` types)
- Zod schemas for data validation
- Export all types from `$lib/types`

### 4. Code Quality

- Components < 200 lines
- JSDoc for complex logic
- Semantic HTML with ARIA labels
- Unit tests for business logic

---

## Folder Structure

```
src/lib/
├── components/
│   ├── ui/          # Base components (Button, Card)
│   ├── book/        # Book-specific components
│   └── layout/      # Layout components
├── stores/          # State management
├── utils/           # Pure utility functions
├── types/           # TypeScript types
├── constants/       # App constants
└── hooks/           # Svelte 5 composables
```

---

## Naming Conventions

| Type       | Convention | Example             |
| ---------- | ---------- | ------------------- |
| Components | PascalCase | `BookPage.svelte`   |
| Utilities  | kebab-case | `date-formatter.ts` |
| Stores     | kebab-case | `theme.svelte.ts`   |
| Types      | kebab-case | `cv.types.ts`       |
| Tests      | \*.test.ts | `button.test.ts`    |

---

## Svelte 5 Component Template

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import type { MyType } from '$lib/types';

	// Props
	interface Props {
		title: string;
		count?: number;
	}
	let { title, count = 0 }: Props = $props();

	// State
	let isActive = $state(false);

	// Derived
	let displayText = $derived(`${title} (${count})`);

	// Effects
	$effect(() => {
		console.log('Count changed:', count);
	});

	// Functions
	function handleClick() {
		isActive = !isActive;
	}
</script>

<div class="container">
	<h1>{displayText}</h1>
	<button onclick={handleClick}>
		{isActive ? 'Active' : 'Inactive'}
	</button>
</div>

<style>
	.container {
		/* Component-scoped styles */
	}
</style>
```

---

## Import Order

1. External libraries (svelte, gsap, etc.)
2. Internal components (`$lib/components`)
3. Types (`$lib/types`)
4. Utils (`$lib/utils`)
5. Stores (`$lib/stores`)

---

## Common Patterns

### Barrel Exports

```typescript
// components/ui/button/index.ts
export { default as Button } from './Button.svelte';
export type { ButtonProps } from './Button.svelte';
```

### Type-Safe Stores (Svelte 5)

```typescript
// stores/theme.svelte.ts
import { writable } from 'svelte/store';

export const theme = writable<'light' | 'dark'>('light');
```

### Utility Functions

```typescript
// utils/formatters/date.ts
export function formatDate(date: Date): string {
	return new Intl.DateTimeFormat('en-US').format(date);
}
```

---

## Testing

### Unit Test Example

```typescript
// button.test.ts
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Button from './Button.svelte';

describe('Button', () => {
	it('renders with correct text', () => {
		const { getByText } = render(Button, { props: { text: 'Click me' } });
		expect(getByText('Click me')).toBeInTheDocument();
	});
});
```

---

## Accessibility Checklist

- [ ] Semantic HTML (`<nav>`, `<main>`, `<article>`)
- [ ] ARIA labels for interactive elements
- [ ] Keyboard navigation support
- [ ] Color contrast > 4.5:1
- [ ] Focus indicators visible
- [ ] Screen reader friendly
- [ ] Respects `prefers-reduced-motion`

---

## Performance Best Practices

1. **Lazy Loading**

   ```typescript
   const HeavyComponent = lazy(() => import('./HeavyComponent.svelte'));
   ```

2. **Code Splitting**
   - Split routes automatically by SvelteKit
   - Dynamic imports for large libraries

3. **Image Optimization**
   - Use WebP format
   - Lazy load images
   - Proper `width` and `height` attributes

4. **Bundle Size**
   - Keep initial JS < 200KB
   - Tree-shake unused code
   - Analyze with `vite-bundle-visualizer`

---

## Git Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add page turn animation
fix: resolve mobile layout issue
docs: update component documentation
style: format code with prettier
refactor: simplify navigation logic
test: add unit tests for date formatter
perf: optimize 3D scene rendering
chore: update dependencies
```

---

## Common Mistakes to Avoid

❌ Using Svelte 4 syntax (`export let`)
✅ Use Svelte 5 runes (`$props()`)

❌ Components > 300 lines
✅ Break into smaller components

❌ Using `any` type
✅ Use proper TypeScript types

❌ Mixing concerns in one component
✅ Single Responsibility Principle

❌ No TypeScript types for props
✅ Define `interface Props`

---

## Resources

- [Svelte 5 Documentation](https://svelte.dev/)
- [SvelteKit Documentation](https://kit.svelte.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Accessibility Guide (WCAG 2.1)](https://www.w3.org/WAI/WCAG21/quickref/)
- [Project Architecture Docs](../docs/architecture/README.md)

---

## Questions?

Refer to:

1. [claude.md](../claude.md) - Complete context document
2. [plan.md](../plan.md) - Development roadmap
3. [Architecture ADRs](../docs/architecture/adrs/) - Decision records
4. Svelte MCP Server - For Svelte-specific questions

---

**Remember**: Production-grade code is clean, typed, tested, and accessible!
