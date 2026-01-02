<script lang="ts">
	/**
	 * ClosingPage Component
	 * Displays thank you message and closing thoughts
	 * Simple, elegant end to the book journey
	 * Consistent design with dark background and orangish accents
	 */

	import type { ClosingContent } from '$lib/types/book';

	interface Props {
		data: ClosingContent;
	}

	let { data }: Props = $props();
</script>

<div class="closing-page">
	<div class="content-wrapper animate-fadeInUp">
		<!-- Decorative top -->
		<div class="decoration-group">
			<div class="decoration-line"></div>
			<div class="decoration-dot"></div>
			<div class="decoration-line"></div>
		</div>

		<!-- Title -->
		<h1 class="closing-title">{data.title}</h1>

		<!-- Divider -->
		<div class="divider"></div>

		<!-- Message with proper line breaks -->
		<div class="message-content">
			{#each data.message.split('\n\n') as paragraph}
				<p class="message-paragraph">{paragraph}</p>
			{/each}
		</div>

		<!-- Decorative bottom -->
		<div class="decoration-group">
			<div class="decoration-line"></div>
			<div class="decoration-dot"></div>
			<div class="decoration-line"></div>
		</div>

		<!-- Book end ornament -->
		<div class="book-end">
			<svg class="book-icon" fill="currentColor" viewBox="0 0 20 20">
				<path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
			</svg>
			<span class="book-end-text">End of Book</span>
			<svg class="book-icon" fill="currentColor" viewBox="0 0 20 20">
				<path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
			</svg>
		</div>
	</div>
</div>

<style>
	.closing-page {
		height: 100%;
		background: transparent; /* Inherit from BookSpreadView theme */
		padding: 3rem;
		overflow-y: auto;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.content-wrapper {
		max-width: 650px;
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.decoration-group {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.decoration-line {
		height: 2px;
		width: 4rem;
		background: linear-gradient(to right, transparent, var(--color-accent), transparent);
	}

	.decoration-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--color-accent);
		box-shadow: 0 0 10px color-mix(in srgb, var(--color-accent) 50%, transparent);
	}

	.closing-title {
		font-size: clamp(2.5rem, 5vw, 3.5rem);
		font-weight: 800;
		color: var(--color-text-primary);
		line-height: 1.2;
	}

	.divider {
		width: 6rem;
		height: 3px;
		background: linear-gradient(to right, transparent, var(--color-accent), transparent);
		margin: 0 auto;
	}

	.message-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.message-paragraph {
		font-size: 1.125rem;
		line-height: 1.8;
		color: var(--color-text-secondary);
	}

	.book-end {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding-top: 2rem;
	}

	.book-icon {
		width: 1.5rem;
		height: 1.5rem;
		color: #e27d60;
	}

	.book-end-text {
		font-size: 0.875rem;
		font-style: italic;
		color: var(--color-text-secondary);
	}

	@media (max-width: 768px) {
		.closing-page {
			padding: 2rem 1.5rem;
		}

		.content-wrapper {
			gap: 1.5rem;
		}

		.message-paragraph {
			font-size: 1rem;
		}
	}
</style>
