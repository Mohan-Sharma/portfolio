<script lang="ts">
	import '../app.css';
	import ThemeSwitcher from '$lib/components/ui/ThemeSwitcher.svelte';
	import { themeStore } from '$lib/stores/theme.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	// Initialize theme on app mount
	onMount(() => {
		console.log('[Layout] onMount called');
		console.log('[Layout] themeStore:', themeStore);
		themeStore.init();
		console.log('[Layout] themeStore.init() executed');
	});
</script>

<!-- Theme Switcher - Fixed position -->
<div class="fixed top-6 right-6 z-50">
	<ThemeSwitcher />
</div>

<div class="min-h-screen bg-gallery dark:bg-void transition-colors duration-300">
	<a
		href="#main"
		class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-copper dark:focus:bg-amber focus:text-white focus:rounded-md"
	>
		Skip to main content
	</a>

	<main id="main" class="w-full">
		{@render children()}
	</main>
</div>
