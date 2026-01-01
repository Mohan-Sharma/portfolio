<script lang="ts">
	/**
	 * Button Component
	 * Reusable button with multiple variants
	 */

	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
		size?: 'sm' | 'md' | 'lg';
		disabled?: boolean;
		onclick?: (event: MouseEvent) => void;
		type?: 'button' | 'submit' | 'reset';
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		disabled = false,
		onclick,
		type = 'button',
		class: className = '',
		children
	}: Props = $props();

	// Base classes
	const baseClasses =
		'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

	// Variant classes
	const variantClasses = {
		primary:
			'bg-copper hover:bg-terracotta text-white focus:ring-copper dark:bg-amber dark:hover:bg-amber/90',
		secondary:
			'bg-steel hover:bg-steel/80 text-white focus:ring-steel dark:bg-steel/70 dark:hover:bg-steel/60',
		ghost:
			'bg-transparent hover:bg-gray-100 text-gray-900 focus:ring-gray-400 dark:hover:bg-gray-800 dark:text-gray-100',
		outline:
			'bg-transparent border-2 border-copper hover:bg-copper hover:text-white text-copper focus:ring-copper dark:border-amber dark:text-amber dark:hover:bg-amber dark:hover:text-gray-900'
	};

	// Size classes
	const sizeClasses = {
		sm: 'px-3 py-1.5 text-sm rounded-md',
		md: 'px-4 py-2 text-base rounded-lg',
		lg: 'px-6 py-3 text-lg rounded-xl'
	};

	// Combined classes
	let buttonClasses = $derived(
		`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
	);
</script>

<button {type} class={buttonClasses} {disabled} {onclick}>
	{#if children}
		{@render children()}
	{/if}
</button>
