<script lang="ts">
	/**
	 * Badge Component
	 * Small label for technologies, categories, etc.
	 */

	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'default' | 'primary' | 'secondary' | 'success' | 'info';
		size?: 'sm' | 'md';
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'default',
		size = 'sm',
		class: className = '',
		children
	}: Props = $props();

	const baseClasses =
		'inline-flex items-center font-medium rounded-full transition-colors';

	const variantClasses = {
		default:
			'bg-mercury/60 text-obsidian-ink dark:bg-surface/70 dark:text-text-main-dark',
		primary:
			'bg-terracotta/10 text-terracotta dark:bg-copper/10 dark:text-copper',
		secondary:
			'bg-steel/10 text-steel dark:bg-steel/20 dark:text-steel',
		success:
			'bg-sage/10 text-sage dark:bg-sage/20 dark:text-sage',
		info:
			'bg-terracotta/10 text-terracotta dark:bg-copper/10 dark:text-copper'
	};

	const sizeClasses = {
		sm: 'px-2.5 py-0.5 text-xs',
		md: 'px-3 py-1 text-sm'
	};

	let badgeClasses = $derived(
		`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
	);
</script>

<span class={badgeClasses}>
	{#if children}
		{@render children()}
	{/if}
</span>
