<script lang="ts">
	/**
	 * BookSpreadView Component
	 * Realistic two-page spread with center binding and page-turn animation
	 * Pages flip from the center spine like a real book
	 */

	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import PageContent from './PageContent.svelte';
	import type { BookPage } from '$lib/types/book';

	interface Props {
		pages: BookPage[];
		currentPageIndex: number;
		onPageChange?: (index: number) => void;
	}

	let { pages, currentPageIndex, onPageChange }: Props = $props();

	let leftPageElement: HTMLDivElement;
	let rightPageElement: HTMLDivElement;
	let turningPageElement: HTMLDivElement | null = null;
	let isAnimating = $state(false);
	let previousIndex = $state(0);
	let isInitialized = $state(false);

	// Watch for external page changes and animate
	$effect(() => {
		const current = currentPageIndex;

		// Initialize previousIndex on first run
		if (!isInitialized) {
			previousIndex = current;
			isInitialized = true;
			return;
		}

		if (current !== previousIndex && !isAnimating) {
			const direction = current > previousIndex ? 'next' : 'prev';
			animatePageTurn(direction);
			previousIndex = current;
		}
	});

	function animatePageTurn(direction: 'next' | 'prev') {
		if (isAnimating) return;
		isAnimating = true;

		// Create a turning page element
		const turningPage = document.createElement('div');
		turningPage.className = 'turning-page';

		// Copy content from the page that's turning
		if (direction === 'next' && rightPageElement) {
			turningPage.innerHTML = rightPageElement.innerHTML;
			turningPage.classList.add('turn-right-to-left');
		} else if (direction === 'prev' && leftPageElement) {
			turningPage.innerHTML = leftPageElement.innerHTML;
			turningPage.classList.add('turn-left-to-right');
		}

		document.querySelector('.book-spread')?.appendChild(turningPage);
		turningPageElement = turningPage;

		// Animate the page turn
		const timeline = gsap.timeline({
			onComplete: () => {
				if (turningPageElement) {
					turningPageElement.remove();
					turningPageElement = null;
				}
				isAnimating = false;
			}
		});

		if (direction === 'next') {
			// Turn right page to left
			timeline.fromTo(
				turningPage,
				{
					rotationY: 0,
					transformOrigin: 'left center',
					z: 10
				},
				{
					rotationY: -180,
					duration: 0.8,
					ease: 'power2.inOut',
					transformOrigin: 'left center'
				}
			);
		} else {
			// Turn left page to right
			timeline.fromTo(
				turningPage,
				{
					rotationY: 0,
					transformOrigin: 'right center',
					z: 10
				},
				{
					rotationY: 180,
					duration: 0.8,
					ease: 'power2.inOut',
					transformOrigin: 'right center'
				}
			);
		}
	}

	function handleNext() {
		if (isAnimating) return;
		if (currentPageIndex < pages.length - 2) {
			onPageChange?.(currentPageIndex + 2);
		}
	}

	function handlePrevious() {
		if (isAnimating) return;
		if (currentPageIndex > 0) {
			onPageChange?.(currentPageIndex - 2);
		}
	}

	// Keyboard navigation
	function handleKeydown(event: KeyboardEvent) {
		if (isAnimating) return;

		if (event.key === 'ArrowRight' || event.key === ' ') {
			event.preventDefault();
			handleNext();
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			handlePrevious();
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});

	// Get current spread pages
	const leftPageIndex = $derived(Math.floor(currentPageIndex / 2) * 2);
	const rightPageIndex = $derived(leftPageIndex + 1);
	const leftPage = $derived(pages[leftPageIndex]);
	const rightPage = $derived(pages[rightPageIndex]);

	// Get page theme colors
	function getPageTheme(page: BookPage) {
		switch (page?.content.type) {
			case 'cover':
				return 'theme-cover';
			case 'about':
				return 'theme-about';
			case 'experience':
				return 'theme-experience';
			case 'projects-intro':
			case 'project-detail':
				return 'theme-project';
			case 'skills':
				return 'theme-skills';
			case 'education':
				return 'theme-education';
			case 'achievements':
				return 'theme-achievements';
			case 'contact':
				return 'theme-contact';
			default:
				return 'theme-default';
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="book-container">
	<!-- Page indicator -->
	{#if leftPage && leftPage.content.type !== 'cover'}
		<div class="page-indicator">
			<span>Pages {leftPageIndex + 1}-{Math.min(rightPageIndex + 1, pages.length)} of {pages.length}</span>
		</div>
	{/if}

	<!-- Book spread -->
	<div class="book-spread">
		<!-- Left page -->
		<div
			bind:this={leftPageElement}
			class="book-page left-page {getPageTheme(leftPage)}"
		>
			{#if leftPage}
				<PageContent page={leftPage} />
			{/if}

			<!-- Page number bottom-left -->
			{#if leftPage && leftPage.content.type !== 'cover'}
				<div class="page-number left">{leftPageIndex + 1}</div>
			{/if}
		</div>

		<!-- Center spine/binding -->
		<div class="book-spine"></div>

		<!-- Right page -->
		<div
			bind:this={rightPageElement}
			class="book-page right-page {getPageTheme(rightPage)}"
		>
			{#if rightPage}
				<PageContent page={rightPage} />
			{:else}
				<!-- Back cover or end -->
				<div class="end-page">
					<p class="text-center text-text-sub-light dark:text-steel">End</p>
				</div>
			{/if}

			<!-- Page number bottom-right -->
			{#if rightPage}
				<div class="page-number right">{rightPageIndex + 1}</div>
			{/if}
		</div>
	</div>

	<!-- Navigation controls -->
	<div class="navigation-controls">
		<button
			class="nav-button prev-button"
			disabled={currentPageIndex === 0 || isAnimating}
			onclick={handlePrevious}
			aria-label="Previous pages"
		>
			<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
			</svg>
			<span class="button-text">Previous</span>
		</button>

		<div class="page-counter">
			<span class="current">{leftPageIndex + 1}</span>
			<span class="separator">-</span>
			<span class="current">{Math.min(rightPageIndex + 1, pages.length)}</span>
			<span class="separator">/</span>
			<span class="total">{pages.length}</span>
		</div>

		<button
			class="nav-button next-button"
			disabled={currentPageIndex >= pages.length - 2 || isAnimating}
			onclick={handleNext}
			aria-label="Next pages"
		>
			<span class="button-text">Next</span>
			<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	</div>
</div>

<style>
	.book-container {
		min-height: 100vh;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		perspective: 2500px;
		position: relative;
		overflow: hidden;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	:global(.dark) .book-container {
		background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
	}

	.page-indicator {
		position: fixed;
		top: 2rem;
		left: 2rem;
		z-index: 100;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.9);
		background: rgba(0, 0, 0, 0.25);
		backdrop-filter: blur(12px);
		padding: 0.5rem 1.25rem;
		border-radius: 9999px;
		border: 1px solid rgba(255, 255, 255, 0.15);
	}

	.book-spread {
		position: relative;
		display: flex;
		width: 90%;
		max-width: 1400px;
		height: 80vh;
		min-height: 600px;
		max-height: 850px;
		transform-style: preserve-3d;
		box-shadow:
			0 60px 120px rgba(0, 0, 0, 0.5),
			0 25px 50px rgba(0, 0, 0, 0.4);
	}

	.book-page {
		flex: 1;
		height: 100%;
		padding: 3rem;
		position: relative;
		overflow: hidden;
		backface-visibility: hidden;
		border: 1px solid rgba(0, 0, 0, 0.1);
		box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.05);
	}

	.left-page {
		border-radius: 1rem 0 0 1rem;
		border-right: none;
	}

	.right-page {
		border-radius: 0 1rem 1rem 0;
		border-left: none;
	}

	.book-spine {
		width: 30px;
		height: 100%;
		background: linear-gradient(
			90deg,
			rgba(0, 0, 0, 0.2) 0%,
			rgba(0, 0, 0, 0.4) 50%,
			rgba(0, 0, 0, 0.2) 100%
		);
		box-shadow:
			inset 2px 0 4px rgba(0, 0, 0, 0.3),
			inset -2px 0 4px rgba(0, 0, 0, 0.3);
		position: relative;
		z-index: 10;
	}

	/* Unified theme backgrounds */
	.theme-cover,
	.theme-about,
	.theme-experience,
	.theme-project,
	.theme-skills,
	.theme-education,
	.theme-achievements,
	.theme-contact,
	.theme-default {
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
	}

	:global(.dark) .theme-cover,
	:global(.dark) .theme-about,
	:global(.dark) .theme-experience,
	:global(.dark) .theme-project,
	:global(.dark) .theme-skills,
	:global(.dark) .theme-education,
	:global(.dark) .theme-achievements,
	:global(.dark) .theme-contact,
	:global(.dark) .theme-default {
		background: linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%);
	}

	.page-number {
		position: absolute;
		bottom: 1.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.4);
	}

	:global(.dark) .page-number {
		color: rgba(255, 255, 255, 0.4);
	}

	.page-number.left {
		left: 2rem;
	}

	.page-number.right {
		right: 2rem;
	}

	/* Turning page animation */
	:global(.turning-page) {
		position: absolute;
		width: calc(50% - 15px);
		height: 100%;
		top: 0;
		padding: 3rem;
		background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
		transform-style: preserve-3d;
		backface-visibility: hidden;
		box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
		z-index: 20;
		border: 1px solid rgba(0, 0, 0, 0.1);
	}

	:global(.turning-page.turn-right-to-left) {
		/* Right page position - starts at right side, flips from left edge (center spine) */
		right: 0;
		border-radius: 0 1rem 1rem 0;
		border-left: none;
		transform-origin: left center;
	}

	:global(.turning-page.turn-left-to-right) {
		/* Left page position - starts at left side, flips from right edge (center spine) */
		left: 0;
		border-radius: 1rem 0 0 1rem;
		border-right: none;
		transform-origin: right center;
	}

	.end-page {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		font-style: italic;
		font-size: 1.5rem;
	}

	/* Navigation controls */
	.navigation-controls {
		position: fixed;
		bottom: 2.5rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 100;
		display: flex;
		align-items: center;
		gap: 2.5rem;
		padding: 1rem 2.5rem;
		background: rgba(255, 255, 255, 0.12);
		backdrop-filter: blur(16px) saturate(180%);
		border-radius: 9999px;
		border: 1px solid rgba(255, 255, 255, 0.18);
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.25),
			inset 0 1px 0 rgba(255, 255, 255, 0.15);
	}

	:global(.dark) .navigation-controls {
		background: rgba(0, 0, 0, 0.5);
		border-color: rgba(255, 255, 255, 0.1);
	}

	.nav-button {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1.75rem;
		background: rgba(255, 255, 255, 0.2);
		border: none;
		border-radius: 9999px;
		color: #ffffff;
		font-weight: 700;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.nav-button:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.3);
		transform: translateY(-3px);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
	}

	.nav-button:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.nav-button .icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	.page-counter {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		padding: 0.75rem 2rem;
		background: rgba(255, 255, 255, 0.15);
		border-radius: 9999px;
		font-weight: 800;
		color: #ffffff;
	}

	.current {
		font-size: 1.25rem;
	}

	.separator {
		opacity: 0.5;
		font-size: 1rem;
	}

	.total {
		opacity: 0.8;
		font-size: 1rem;
	}

	/* Mobile responsive */
	@media (max-width: 768px) {
		.book-spread {
			flex-direction: column;
			width: 95%;
			height: auto;
		}

		.book-page {
			padding: 2rem 1.5rem;
		}

		.left-page,
		.right-page {
			border-radius: 1rem;
			border: 1px solid rgba(0, 0, 0, 0.1);
		}

		.book-spine {
			display: none;
		}

		.button-text {
			display: none;
		}
	}
</style>
