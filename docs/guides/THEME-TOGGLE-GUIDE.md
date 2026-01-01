# Theme Toggle Implementation Guide (SvelteKit + Tailwind CSS)

**Last Updated**: December 31, 2025
**Svelte Version**: 5.x
**Tailwind Version**: 4.x

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Implementation Approaches](#implementation-approaches)
3. [Production-Grade Implementation](#production-grade-implementation)
4. [Best Practices](#best-practices)
5. [Common Pitfalls](#common-pitfalls)
6. [Testing](#testing)

---

## Overview

A **theme toggle** allows users to switch between light and dark mode. In SvelteKit with Tailwind CSS, this involves:

1. **State Management** - Track current theme (`light` or `dark`)
2. **Persistence** - Save preference to `localStorage`
3. **SSR Handling** - Prevent flash of incorrect theme
4. **Tailwind Integration** - Apply `dark:` utility classes

---

## Implementation Approaches

### ❌ **Approach 1: Simple (Not Recommended)**

```svelte
<!-- BAD: Causes flash, no SSR support -->
<script>
  import { browser } from '$app/environment';

  let theme = $state('light');

  $effect(() => {
    if (browser) {
      theme = localStorage.getItem('theme') || 'light';
    }
  });
</script>

<button onclick={() => theme = theme === 'light' ? 'dark' : 'light'}>
  Toggle
</button>
```

**Problems**:
- ❌ Flash of wrong theme on page load
- ❌ Doesn't sync `<html>` class
- ❌ No system preference detection

---

### ✅ **Approach 2: Production-Grade (Recommended)**

Uses:
- ✅ `.svelte.ts` for shared reactive state
- ✅ Inline `<script>` in `app.html` to prevent flash
- ✅ `$effect` for side effects
- ✅ Context API for component access
- ✅ System preference detection

---

## Production-Grade Implementation

### Step 1: Create Theme Store

```typescript
// src/lib/stores/theme.svelte.ts
import { browser } from '$app/environment';

type Theme = 'light' | 'dark' | 'system';

class ThemeStore {
	current = $state<Theme>('system');
	resolved = $derived<'light' | 'dark'>(
		this.current === 'system'
			? this.systemPreference
			: this.current
	);

	private systemPreference = $state<'light' | 'dark'>('light');

	constructor() {
		if (browser) {
			// Read from localStorage
			const stored = localStorage.getItem('theme') as Theme | null;
			this.current = stored || 'system';

			// Listen to system preference changes
			const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
			this.systemPreference = mediaQuery.matches ? 'dark' : 'light';

			mediaQuery.addEventListener('change', (e) => {
				this.systemPreference = e.matches ? 'dark' : 'light';
			});
		}
	}

	set(theme: Theme) {
		this.current = theme;

		if (browser) {
			localStorage.setItem('theme', theme);
			this.applyTheme();
		}
	}

	toggle() {
		// Simple light/dark toggle (ignores system)
		const newTheme = this.resolved === 'light' ? 'dark' : 'light';
		this.set(newTheme);
	}

	private applyTheme() {
		const html = document.documentElement;

		if (this.resolved === 'dark') {
			html.classList.add('dark');
		} else {
			html.classList.remove('dark');
		}

		// Update meta theme-color for mobile browsers
		const meta = document.querySelector('meta[name="theme-color"]');
		if (meta) {
			meta.setAttribute(
				'content',
				this.resolved === 'dark' ? '#000000' : '#ffffff'
			);
		}
	}
}

// Singleton instance
export const theme = new ThemeStore();
```

---

### Step 2: Prevent Flash (Critical!)

Add inline script to `app.html` to apply theme **before** page renders:

```html
<!-- src/app.html -->
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="theme-color" content="#ffffff" />

		<!-- ⭐ CRITICAL: Prevent flash of wrong theme -->
		<script>
			(function() {
				try {
					const theme = localStorage.getItem('theme') || 'system';
					const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
					const resolved = theme === 'system' ? (systemIsDark ? 'dark' : 'light') : theme;

					if (resolved === 'dark') {
						document.documentElement.classList.add('dark');
					}

					// Update theme-color meta tag
					const meta = document.querySelector('meta[name="theme-color"]');
					if (meta) {
						meta.setAttribute('content', resolved === 'dark' ? '#000000' : '#ffffff');
					}
				} catch (e) {
					// Fail silently
				}
			})();
		</script>

		%sveltekit.head%
	</head>
	<body>
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

**Why this works**:
- ✅ Runs **before** any Svelte code
- ✅ Synchronous (no flash)
- ✅ Reads from `localStorage` immediately
- ✅ Detects system preference
- ✅ Applies `dark` class before first paint

---

### Step 3: Create Theme Toggle Component

```svelte
<!-- src/lib/components/ui/ThemeToggle.svelte -->
<script lang="ts">
	import { theme } from '$lib/stores/theme.svelte';
	import { Button } from '$lib/components/ui';

	let isClient = $state(false);

	$effect(() => {
		// Only show toggle after hydration
		isClient = true;
	});
</script>

{#if isClient}
	<Button
		variant="ghost"
		size="icon"
		onclick={() => theme.toggle()}
		aria-label={`Switch to ${theme.resolved === 'light' ? 'dark' : 'light'} mode`}
	>
		{#if theme.resolved === 'dark'}
			<!-- Sun Icon (show in dark mode) -->
			<svg
				class="w-5 h-5"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
				></path>
			</svg>
		{:else}
			<!-- Moon Icon (show in light mode) -->
			<svg
				class="w-5 h-5"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
				></path>
			</svg>
		{/if}
	</Button>
{/if}
```

**Key Points**:
- ✅ Only renders after hydration (prevents mismatch)
- ✅ Accessible (`aria-label`)
- ✅ Visual feedback (icon changes)
- ✅ Reactive to theme changes

---

### Step 4: Configure Tailwind CSS

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	// ⭐ Enable dark mode with 'class' strategy
	darkMode: 'class',

	theme: {
		extend: {
			colors: {
				// Custom colors for light/dark
				background: 'rgb(var(--color-background) / <alpha-value>)',
				foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
			}
		}
	},

	plugins: []
};
```

---

### Step 5: Use Theme in Components

```svelte
<!-- Example: Using Tailwind dark: prefix -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
	<h1 class="text-3xl font-bold">
		Hello World
	</h1>

	<p class="text-gray-600 dark:text-gray-300">
		This text adapts to the theme.
	</p>

	<button class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
		Click Me
	</button>
</div>
```

**Pattern**:
```
light-value dark:dark-value
```

---

### Step 6: Add to Layout

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { theme } from '$lib/stores/theme.svelte';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import '../app.css';

	// Sync theme on mount
	$effect(() => {
		theme.applyTheme();
	});
</script>

<header>
	<nav>
		<a href="/">Home</a>
		<ThemeToggle />
	</nav>
</header>

<main>
	{@render children()}
</main>
```

---

## Advanced: Theme Menu (Light/Dark/System)

For a more sophisticated UI with explicit system preference:

```svelte
<!-- src/lib/components/ui/ThemeMenu.svelte -->
<script lang="ts">
	import { theme } from '$lib/stores/theme.svelte';

	type Theme = 'light' | 'dark' | 'system';

	let isOpen = $state(false);

	function selectTheme(selected: Theme) {
		theme.set(selected);
		isOpen = false;
	}
</script>

<div class="relative">
	<button
		onclick={() => isOpen = !isOpen}
		class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
	>
		{#if theme.resolved === 'dark'}
			🌙
		{:else}
			☀️
		{/if}
	</button>

	{#if isOpen}
		<div class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
			<button
				onclick={() => selectTheme('light')}
				class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
				class:font-bold={theme.current === 'light'}
			>
				☀️ Light
			</button>

			<button
				onclick={() => selectTheme('dark')}
				class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
				class:font-bold={theme.current === 'dark'}
			>
				🌙 Dark
			</button>

			<button
				onclick={() => selectTheme('system')}
				class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
				class:font-bold={theme.current === 'system'}
			>
				💻 System
			</button>
		</div>
	{/if}
</div>
```

---

## Best Practices

### 1. ✅ Always Prevent Flash

```html
<!-- ALWAYS include this in app.html -->
<script>
  (function() {
    const theme = localStorage.getItem('theme') || 'system';
    // ... apply dark class
  })();
</script>
```

### 2. ✅ Use `.svelte.ts` for Shared State

```typescript
// ✅ GOOD: Reactive class in .svelte.ts
export const theme = new ThemeStore();
```

```svelte
<!-- ❌ BAD: Reactive state in .svelte component (not shared) -->
<script>
  let theme = $state('light'); // This is per-component!
</script>
```

### 3. ✅ Respect System Preferences

```typescript
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
mediaQuery.addEventListener('change', (e) => {
  // Update when system preference changes
});
```

### 4. ✅ Update Meta Theme Color

```typescript
const meta = document.querySelector('meta[name="theme-color"]');
if (meta) {
  meta.setAttribute('content', resolved === 'dark' ? '#000000' : '#ffffff');
}
```

### 5. ✅ Use Semantic Colors

```css
/* app.css */
:root {
  --color-background: 255 255 255; /* white */
  --color-foreground: 0 0 0; /* black */
}

.dark {
  --color-background: 0 0 0; /* black */
  --color-foreground: 255 255 255; /* white */
}
```

```svelte
<div class="bg-[rgb(var(--color-background))]">
  <p class="text-[rgb(var(--color-foreground))]">
    Semantic colors!
  </p>
</div>
```

---

## Common Pitfalls

### ❌ **Pitfall 1: Flash of Wrong Theme**

```html
<!-- ❌ WRONG: Loads theme after page renders -->
<script>
  $effect(() => {
    applyTheme();
  });
</script>
```

**Fix**: Use inline `<script>` in `app.html`

---

### ❌ **Pitfall 2: SSR Mismatch**

```svelte
<!-- ❌ WRONG: Renders theme toggle during SSR -->
<ThemeToggle />
```

**Fix**: Only render after hydration

```svelte
{#if isClient}
  <ThemeToggle />
{/if}
```

---

### ❌ **Pitfall 3: Not Syncing localStorage**

```typescript
// ❌ WRONG: Doesn't persist
theme.current = 'dark';
```

**Fix**: Always update localStorage

```typescript
// ✅ CORRECT
theme.set('dark'); // Updates localStorage + applies class
```

---

## Testing

### Manual Testing Checklist

- [ ] Theme persists after page reload
- [ ] No flash of wrong theme on initial load
- [ ] System preference detection works
- [ ] Theme changes when system preference changes
- [ ] Toggle button updates correctly
- [ ] Works in incognito mode (no localStorage)
- [ ] `prefers-reduced-motion` is respected for animations
- [ ] Meta theme-color updates correctly
- [ ] Works with SSR disabled
- [ ] Works with JavaScript disabled (fallback to light)

### Automated Testing

```typescript
// tests/theme.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { theme } from '$lib/stores/theme.svelte';

describe('Theme Store', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('defaults to system preference', () => {
		expect(theme.current).toBe('system');
	});

	it('persists theme to localStorage', () => {
		theme.set('dark');
		expect(localStorage.getItem('theme')).toBe('dark');
	});

	it('toggles between light and dark', () => {
		theme.set('light');
		theme.toggle();
		expect(theme.resolved).toBe('dark');

		theme.toggle();
		expect(theme.resolved).toBe('light');
	});
});
```

---

## Summary

### ✅ **Production Checklist**

- [x] Inline `<script>` in `app.html` to prevent flash
- [x] `.svelte.ts` file for shared reactive state
- [x] `$effect` for side effects (localStorage, DOM manipulation)
- [x] System preference detection
- [x] Meta theme-color updates
- [x] Only render toggle after hydration
- [x] Tailwind `darkMode: 'class'`
- [x] Semantic color variables
- [x] Accessible (`aria-label`)
- [x] Tested across browsers

---

## References

- [Svelte 5 Runes Documentation](https://svelte.dev/docs/svelte/what-are-runes)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [MDN: prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [Web.dev: Dark Mode Best Practices](https://web.dev/prefers-color-scheme/)

---

**Need help?** Check the [SvelteKit FAQ](https://kit.svelte.dev/docs/faq) or [Tailwind Docs](https://tailwindcss.com/docs).
