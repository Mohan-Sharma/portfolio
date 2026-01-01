<script lang="ts">
	/**
	 * TableOfContentsPage - Consistent design
	 * Dark background, orangish accents, clickable chapters
	 */

	import type { TOCContent } from '$lib/types/book';

	interface Props {
		data: TOCContent;
		side: 'left' | 'right';
		onChapterClick?: (pageNumber: number) => void;
	}

	let { data, side, onChapterClick }: Props = $props();

	const displayChapters = $derived(
		side === 'left'
			? data.chapters.slice(0, Math.ceil(data.chapters.length / 2))
			: data.chapters.slice(Math.ceil(data.chapters.length / 2))
	);

	function handleChapterClick(pageNumber: number) {
		onChapterClick?.(pageNumber);
	}
</script>

<div class="toc-page">
	<div class="content-wrapper">
		{#if side === 'left'}
			<div class="toc-header animate-fadeInUp">
				<h1 class="toc-title">Table of Contents</h1>
				<div class="decoration-group">
					<div class="decoration-line"></div>
					<div class="decoration-dot"></div>
					<div class="decoration-line"></div>
				</div>
			</div>
		{:else}
			<div class="spacer"></div>
		{/if}

		<nav class="chapters-list">
			{#each displayChapters as chapter, index}
				<button
					onclick={() => handleChapterClick(chapter.pageNumber)}
					class="chapter-button animate-[fadeInUp_0.6s_ease-out_{(index * 0.1 + 0.2)}s_backwards]"
				>
					<div class="chapter-info">
						<div class="chapter-number">{chapter.number}</div>
						<h3 class="chapter-title">{chapter.title}</h3>
					</div>
					<div class="chapter-page">
						<div class="dotted-line"></div>
						<span class="page-number">{chapter.pageNumber}</span>
					</div>
				</button>
			{/each}
		</nav>

		{#if side === 'right'}
			<p class="footer-note animate-[fadeInUp_0.6s_ease-out_0.8s_backwards]">
				Click any chapter to jump directly to it
			</p>
		{/if}
	</div>
</div>

<style>
	.toc-page {
		height: 100%;
		background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
		padding: 3rem 2rem;
		overflow-y: auto;
	}

	.content-wrapper {
		max-width: 500px;
		margin: 0 auto;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.toc-header {
		text-align: center;
		margin-bottom: 3rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.toc-title {
		font-size: clamp(2.5rem, 5vw, 3.5rem);
		font-weight: 800;
		color: #e6e9ef;
		line-height: 1.2;
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
		background: linear-gradient(to right, transparent, #e27d60, transparent);
	}

	.decoration-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #e27d60;
		box-shadow: 0 0 10px rgba(226, 125, 96, 0.5);
	}

	.spacer {
		height: 3rem;
	}

	.chapters-list {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.chapter-button {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.5rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(226, 125, 96, 0.2);
		border-radius: 0.75rem;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.chapter-button:hover {
		background: rgba(255, 255, 255, 0.05);
		border-color: rgba(226, 125, 96, 0.4);
		transform: translateX(8px);
		box-shadow: 0 4px 16px rgba(226, 125, 96, 0.15);
	}

	.chapter-info {
		display: flex;
		align-items: center;
		gap: 1rem;
		text-align: left;
	}

	.chapter-number {
		flex-shrink: 0;
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #e27d60, #a64b35);
		border-radius: 50%;
		font-size: 0.875rem;
		font-weight: 700;
		color: white;
		box-shadow: 0 4px 12px rgba(226, 125, 96, 0.3);
	}

	.chapter-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: #e6e9ef;
		line-height: 1.4;
	}

	.chapter-page {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-shrink: 0;
	}

	.dotted-line {
		width: 3rem;
		height: 2px;
		background-image: linear-gradient(to right, rgba(226, 125, 96, 0.3) 50%, transparent 50%);
		background-size: 8px 2px;
	}

	.page-number {
		font-size: 0.875rem;
		font-weight: 600;
		font-family: monospace;
		color: #e27d60;
		min-width: 2rem;
		text-align: right;
	}

	.footer-note {
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid rgba(226, 125, 96, 0.2);
		text-align: center;
		font-size: 0.875rem;
		font-style: italic;
		color: rgba(230, 233, 239, 0.6);
	}

	@media (max-width: 768px) {
		.toc-page {
			padding: 2rem 1.5rem;
		}

		.chapter-button {
			padding: 0.875rem 1rem;
		}

		.dotted-line {
			display: none;
		}
	}
</style>
