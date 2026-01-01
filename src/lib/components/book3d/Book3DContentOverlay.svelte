<script lang="ts">
	/**
	 * Book3DContentOverlay Component
	 * Renders actual CV content as a 2D overlay on top of the 3D book
	 * This hybrid approach ensures text remains readable while maintaining 3D effect
	 *
	 * @component
	 */

	import PageContent from '$lib/components/book/PageContent.svelte';
	import type { BookPage } from '$lib/types/book';

	interface Props {
		currentPage: BookPage;
	}

	let { currentPage }: Props = $props();
</script>

<!-- Content Overlay - Centered on screen -->
<div class="content-overlay">
	<div class="content-card">
		<PageContent page={currentPage} />
	</div>
</div>

<style>
	.content-overlay {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 10;
		pointer-events: none;
		width: 90%;
		max-width: 800px;
		height: 70vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.content-card {
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		overflow-y: auto;
		pointer-events: auto;
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	:global(.dark) .content-card {
		background: rgba(0, 0, 0, 0.85);
		border-color: rgba(255, 255, 255, 0.1);
	}

	/* Custom scrollbar */
	.content-card::-webkit-scrollbar {
		width: 8px;
	}

	.content-card::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.1);
		border-radius: 4px;
	}

	.content-card::-webkit-scrollbar-thumb {
		background: rgba(0, 0, 0, 0.3);
		border-radius: 4px;
	}

	:global(.dark) .content-card::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.1);
	}

	:global(.dark) .content-card::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.3);
	}

	/* Mobile responsive */
	@media (max-width: 768px) {
		.content-overlay {
			width: 95%;
			height: 80vh;
		}

		.content-card {
			padding: 1.5rem;
		}
	}
</style>
