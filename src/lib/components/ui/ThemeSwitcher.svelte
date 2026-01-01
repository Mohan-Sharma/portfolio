<script lang="ts">
	/**
	 * Theme Switcher Component
	 * Toggle between light and dark mode
	 */

	import { themeStore } from '$lib/stores/theme.svelte';

	function handleToggle() {
		themeStore.toggle();
	}

	let isDark = $derived(themeStore.resolved === 'dark');
</script>

<button
	onclick={handleToggle}
	class="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-mercury/10 dark:bg-surface/50 backdrop-blur-chrome border border-steel/20 hover:bg-mercury/20 dark:hover:bg-surface/70 hover:border-copper dark:hover:border-amber transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-copper dark:focus:ring-amber shadow-lg"
	aria-label="Toggle theme"
	title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
>
	{#if isDark}
		<!-- Moon icon for dark mode -->
		<svg
			class="w-6 h-6 text-amber"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
			></path>
		</svg>
	{:else}
		<!-- Sun icon for light mode -->
		<svg
			class="w-6 h-6 text-copper"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
			></path>
		</svg>
	{/if}
</button>
