<script lang="ts">
	/**
	 * ChapterTitlePage Component
	 * Beautiful chapter title page with consistent design matching closed book cover
	 * Dark gradient background, large artistic chapter number, orangish accents
	 *
	 * Following Svelte 5 runes best practices
	 */

	import type { ChapterTitleContent } from '$lib/types/book';

	interface Props {
		data: ChapterTitleContent;
	}

	let { data }: Props = $props();

	// Chapter number words for artistic display
	const numberWords = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'];
	const chapterWord = $derived(numberWords[data.number] || data.number.toString());
</script>

<div class="chapter-title-page">
	<!-- Background decorative elements -->
	<div class="decorative-corner top-left"></div>
	<div class="decorative-corner top-right"></div>
	<div class="decorative-corner bottom-left"></div>
	<div class="decorative-corner bottom-right"></div>

	<!-- Large artistic chapter number in background -->
	<div class="chapter-number-bg">{data.number}</div>

	<!-- Main content -->
	<div class="chapter-content">
		<!-- Top decoration -->
		<div class="decoration-group animate-fadeInUp">
			<div class="decoration-line"></div>
			<div class="decoration-dot"></div>
			<div class="decoration-line"></div>
		</div>

		<!-- Chapter label -->
		<p class="chapter-label animate-[fadeInUp_0.6s_ease-out_0.2s_backwards]">
			Chapter {chapterWord}
		</p>

		<!-- Chapter title -->
		<h1 class="chapter-title animate-[fadeInUp_0.6s_ease-out_0.3s_backwards]">
			{data.title}
		</h1>

		<!-- Divider -->
		<div class="divider animate-[fadeInUp_0.6s_ease-out_0.4s_backwards]"></div>

		<!-- Subtitle -->
		{#if data.subtitle}
			<p class="chapter-subtitle animate-[fadeInUp_0.6s_ease-out_0.5s_backwards]">
				{data.subtitle}
			</p>
		{/if}

		<!-- Bottom decoration -->
		<div class="decoration-group animate-[fadeInUp_0.6s_ease-out_0.6s_backwards]">
			<div class="decoration-line"></div>
			<div class="decoration-dot"></div>
			<div class="decoration-line"></div>
		</div>
	</div>
</div>

<style>
	.chapter-title-page {
		position: relative;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent; /* Inherit from BookSpreadView theme */
		overflow: hidden;
		padding: 3rem;
	}

	/* Decorative corners */
	.decorative-corner {
		position: absolute;
		width: 80px;
		height: 80px;
		border-color: color-mix(in srgb, var(--color-accent) 20%, transparent);
	}

	.decorative-corner.top-left {
		top: 2rem;
		left: 2rem;
		border-top: 2px solid;
		border-left: 2px solid;
	}

	.decorative-corner.top-right {
		top: 2rem;
		right: 2rem;
		border-top: 2px solid;
		border-right: 2px solid;
	}

	.decorative-corner.bottom-left {
		bottom: 2rem;
		left: 2rem;
		border-bottom: 2px solid;
		border-left: 2px solid;
	}

	.decorative-corner.bottom-right {
		bottom: 2rem;
		right: 2rem;
		border-bottom: 2px solid;
		border-right: 2px solid;
	}

	/* Large background chapter number */
	.chapter-number-bg {
		position: absolute;
		font-size: clamp(15rem, 30vw, 25rem);
		font-weight: 900;
		color: color-mix(in srgb, var(--color-accent) 5%, transparent);
		line-height: 1;
		user-select: none;
		pointer-events: none;
		z-index: 0;
	}

	/* Main content */
	.chapter-content {
		position: relative;
		z-index: 1;
		text-align: center;
		max-width: 600px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	/* Decoration groups */
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

	/* Chapter label */
	.chapter-label {
		font-size: 0.875rem;
		font-weight: 600;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--color-text-secondary);
	}

	/* Chapter title */
	.chapter-title {
		font-size: clamp(2.5rem, 6vw, 4.5rem);
		font-weight: 800;
		line-height: 1.1;
		color: var(--color-text-primary);
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	:global(.dark) .chapter-title {
		text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	/* Divider */
	.divider {
		width: 8rem;
		height: 3px;
		background: linear-gradient(to right, transparent, var(--color-accent), transparent);
		box-shadow: 0 0 15px color-mix(in srgb, var(--color-accent) 40%, transparent);
	}

	/* Chapter subtitle */
	.chapter-subtitle {
		font-size: clamp(1.125rem, 2.5vw, 1.5rem);
		font-weight: 500;
		color: var(--color-accent);
		font-style: italic;
		line-height: 1.6;
		max-width: 500px;
	}

	/* Mobile adjustments */
	@media (max-width: 768px) {
		.chapter-title-page {
			padding: 2rem 1.5rem;
		}

		.decorative-corner {
			width: 50px;
			height: 50px;
		}

		.decorative-corner.top-left,
		.decorative-corner.top-right {
			top: 1rem;
		}

		.decorative-corner.bottom-left,
		.decorative-corner.bottom-right {
			bottom: 1rem;
		}

		.decorative-corner.top-left,
		.decorative-corner.bottom-left {
			left: 1rem;
		}

		.decorative-corner.top-right,
		.decorative-corner.bottom-right {
			right: 1rem;
		}

		.chapter-number-bg {
			font-size: clamp(10rem, 40vw, 15rem);
		}

		.chapter-content {
			gap: 1rem;
		}
	}
</style>
