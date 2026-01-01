<script lang="ts">
	/**
	 * Book3DPortfolio Component
	 * Main integration component for the 3D book portfolio
	 * Combines 3D scene, controls, and navigation handlers
	 *
	 * @component
	 */

	import { onMount } from 'svelte';
	import Book3DScene from './Book3DScene.svelte';
	import Book3DControls from './Book3DControls.svelte';
	import Book3DContentOverlay from './Book3DContentOverlay.svelte';
	import PageContent from '$lib/components/book/PageContent.svelte';
	import { bookStore } from '$lib/stores/book.svelte';
	import {
		createScrollHandler,
		createTouchHandler,
		createKeyboardHandler
	} from '$lib/utils/scroll-handler';
	import type { BookPage } from '$lib/types/book';

	interface Props {
		pages: BookPage[];
	}

	let { pages }: Props = $props();

	// Local state derived from store
	let currentPageIndex = $derived(bookStore.currentPage);
	let isAnimating = $derived(bookStore.isAnimating);
	let totalPages = $derived(bookStore.totalPages);

	// Navigation state
	let canGoBack = $derived(currentPageIndex > 0);
	let canGoForward = $derived(currentPageIndex < totalPages - 1);

	// Device detection
	let isMobile = $state(false);
	let showFallback = $state(false);

	// Initialize
	onMount(() => {
		// Set total pages
		bookStore.setTotalPages(pages.length);

		// Detect mobile
		isMobile = window.matchMedia('(max-width: 768px)').matches;

		// Check WebGL support
		const canvas = document.createElement('canvas');
		const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
		const hasWebGL = !!gl;

		// Show fallback if mobile or no WebGL
		showFallback = isMobile || !hasWebGL;

		if (!showFallback) {
			// Setup navigation handlers for desktop 3D view
			setupNavigationHandlers();
		}

		return () => {
			// Cleanup
			cleanupNavigationHandlers();
		};
	});

	// Navigation handler functions
	let scrollHandler: ((event: WheelEvent) => void) | null = null;
	let keyboardHandler: ((event: KeyboardEvent) => void) | null = null;
	let touchHandlers: ReturnType<typeof createTouchHandler> | null = null;

	function setupNavigationHandlers() {
		// Scroll handler
		scrollHandler = createScrollHandler((direction) => {
			if (direction === 'next') {
				handleNext();
			} else {
				handlePrevious();
			}
		});
		window.addEventListener('wheel', scrollHandler, { passive: true });

		// Keyboard handler
		keyboardHandler = createKeyboardHandler((direction) => {
			if (direction === 'next') {
				handleNext();
			} else {
				handlePrevious();
			}
		});
		window.addEventListener('keydown', keyboardHandler);

		// Touch handlers (for tablets)
		touchHandlers = createTouchHandler((direction) => {
			if (direction === 'next') {
				handleNext();
			} else {
				handlePrevious();
			}
		});
		window.addEventListener('touchstart', touchHandlers.handleTouchStart);
		window.addEventListener('touchmove', touchHandlers.handleTouchMove, { passive: false });
		window.addEventListener('touchend', touchHandlers.handleTouchEnd);
	}

	function cleanupNavigationHandlers() {
		if (scrollHandler) {
			window.removeEventListener('wheel', scrollHandler);
		}
		if (keyboardHandler) {
			window.removeEventListener('keydown', keyboardHandler);
		}
		if (touchHandlers) {
			window.removeEventListener('touchstart', touchHandlers.handleTouchStart);
			window.removeEventListener('touchmove', touchHandlers.handleTouchMove);
			window.removeEventListener('touchend', touchHandlers.handleTouchEnd);
		}
	}

	// Navigation functions
	function handleNext() {
		if (!isAnimating && canGoForward) {
			bookStore.nextPage();
			// Reset animation lock after animation completes
			setTimeout(() => {
				bookStore.setAnimating(false);
			}, 1000);
		}
	}

	function handlePrevious() {
		if (!isAnimating && canGoBack) {
			bookStore.previousPage();
			// Reset animation lock after animation completes
			setTimeout(() => {
				bookStore.setAnimating(false);
			}, 1000);
		}
	}
</script>

<div class="book-portfolio-container">
	{#if showFallback}
		<!-- Mobile/Fallback View: Card-based navigation -->
		<div class="fallback-view">
			{#if pages[currentPageIndex]}
				{@const currentPage = pages[currentPageIndex]}
				<div class="page-card">
					<PageContent page={currentPage} />
				</div>
			{/if}

			<!-- Mobile Controls -->
			<div class="mobile-controls">
				<button
					class="mobile-nav-button"
					disabled={!canGoBack}
					onclick={handlePrevious}
				>
					←
				</button>
				<span class="page-indicator">
					{currentPageIndex + 1} / {totalPages}
				</span>
				<button
					class="mobile-nav-button"
					disabled={!canGoForward}
					onclick={handleNext}
				>
					→
				</button>
			</div>
		</div>
	{:else}
		<!-- Desktop 3D View -->
		<Book3DScene
			{pages}
			currentPageIndex={currentPageIndex}
			{isAnimating}
		/>

		<!-- Content Overlay - Shows actual CV content -->
		{#if pages[currentPageIndex]}
			<Book3DContentOverlay currentPage={pages[currentPageIndex]} />
		{/if}

		<!-- 3D Controls -->
		<Book3DControls
			currentPage={currentPageIndex}
			{totalPages}
			{canGoBack}
			{canGoForward}
			onPrevious={handlePrevious}
			onNext={handleNext}
		/>
	{/if}

	<!-- Loading Indicator -->
	{#if isAnimating}
		<div class="loading-indicator">
			<div class="spinner"></div>
		</div>
	{/if}
</div>

<style>
	.book-portfolio-container {
		width: 100%;
		height: 100vh;
		position: relative;
		overflow: hidden;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	:global(.dark) .book-portfolio-container {
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	}

	/* Fallback View Styles */
	.fallback-view {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.page-card {
		width: 100%;
		max-width: 600px;
		background: rgba(255, 255, 255, 0.95);
		border-radius: 1rem;
		padding: 2rem;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		min-height: 400px;
		max-height: 80vh;
		overflow-y: auto;
	}

	:global(.dark) .page-card {
		background: rgba(0, 0, 0, 0.8);
	}

	.mobile-controls {
		display: flex;
		align-items: center;
		gap: 2rem;
		margin-top: 2rem;
	}

	.mobile-nav-button {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.9);
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	:global(.dark) .mobile-nav-button {
		background: rgba(255, 255, 255, 0.1);
		color: #f8f8f8;
	}

	.mobile-nav-button:hover:not(:disabled) {
		transform: scale(1.1);
		background: rgba(255, 255, 255, 1);
	}

	.mobile-nav-button:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.page-indicator {
		font-size: 1rem;
		font-weight: 600;
		color: #ffffff;
	}

	/* Loading Indicator */
	.loading-indicator {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 100;
		pointer-events: none;
	}

	.spinner {
		width: 3rem;
		height: 3rem;
		border: 3px solid rgba(255, 255, 255, 0.3);
		border-top-color: #ffffff;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
