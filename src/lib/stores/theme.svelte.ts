/**
 * Theme Store - Production-Grade Implementation (Svelte 5)
 * Manages light/dark/system theme state
 *
 * Features:
 * - System preference detection
 * - localStorage persistence
 * - Meta theme-color updates
 * - Reactive class-based store
 */

import { browser } from '$app/environment';
import type { Theme, ResolvedTheme } from '$lib/constants/theme';

class ThemeStore {
	current = $state<Theme>('system');
	private systemPreference = $state<ResolvedTheme>('light');

	resolved = $derived<ResolvedTheme>(
		this.current === 'system' ? this.systemPreference : this.current
	);

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
			const color = this.resolved === 'dark' ? '#08080A' : '#F2F2F7';
			meta.setAttribute('content', color);
		}
	}

	// Initialize theme application (called on mount)
	init() {
		if (browser) {
			this.applyTheme();
		}
	}
}

// Singleton instance
export const themeStore = new ThemeStore();
