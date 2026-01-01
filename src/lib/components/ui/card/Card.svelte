<script lang="ts">
	/**
	 * Card Component
	 * Reusable card container with dark mode support
	 */

	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'default' | 'bordered' | 'elevated';
		padding?: 'none' | 'sm' | 'md' | 'lg';
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'default',
		padding = 'md',
		class: className = '',
		children
	}: Props = $props();

	const baseClasses = 'rounded-lg transition-all duration-200';

	const variantClasses = {
		default: 'bg-mercury/60 dark:bg-surface/70 backdrop-blur-chrome',
		bordered:
			'bg-mercury/60 dark:bg-surface/70 backdrop-blur-chrome border border-obsidian-ink/5 dark:border-steel/20',
		elevated:
			'bg-mercury/60 dark:bg-surface/70 backdrop-blur-chrome shadow-lg hover:shadow-xl dark:shadow-void/50'
	};

	const paddingClasses = {
		none: '',
		sm: 'p-4',
		md: 'p-6',
		lg: 'p-8'
	};

	let cardClasses = $derived(
		`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`
	);
</script>

<div class={cardClasses}>
	{#if children}
		{@render children()}
	{/if}
</div>
