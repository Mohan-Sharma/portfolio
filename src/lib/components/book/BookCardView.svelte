<script lang="ts">
	/**
	 * BookCardView Component
	 * Modern card-based book presentation with creative design
	 * Production-grade with smooth animations and beautiful color palettes
	 *
	 * @component
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

	let cardElement: HTMLDivElement;
	let isAnimating = $state(false);

	// Watch for external page changes (from parent) and animate
	let previousIndex = currentPageIndex;
	$effect(() => {
		const current = currentPageIndex;
		if (current !== previousIndex && cardElement && !isAnimating) {
			animatePageFlip(previousIndex, current);
			previousIndex = current;
		}
	});

	function animatePageFlip(from: number, to: number) {
		if (isAnimating) return;
		isAnimating = true;

		const direction = to > from ? 1 : -1;
		const timeline = gsap.timeline({
			onComplete: () => {
				isAnimating = false;
			}
		});

		// More realistic page-flip animation with curl effect
		// Phase 1: Lift and start curl (slight scale up + rotation start)
		timeline.to(cardElement, {
			scale: 1.02,
			rotationY: direction * 15,
			z: 30,
			duration: 0.2,
			ease: 'power1.out',
			transformOrigin: direction > 0 ? 'right center' : 'left center'
		});

		// Phase 2: Full flip with momentum
		timeline.to(cardElement, {
			rotationY: direction * 180,
			scale: 0.95,
			z: 0,
			duration: 0.5,
			ease: 'power2.inOut',
			transformOrigin: direction > 0 ? 'right center' : 'left center'
		});

		// Phase 3: Settle back to normal
		timeline.to(cardElement, {
			rotationY: 0,
			scale: 1,
			z: 0,
			duration: 0.2,
			ease: 'power1.in',
			transformOrigin: direction > 0 ? 'left center' : 'right center'
		});
	}

	// Navigation handlers - only call onPageChange, don't update local state
	function handleNext() {
		if (isAnimating) return;
		if (currentPageIndex < pages.length - 1) {
			onPageChange?.(currentPageIndex + 1);
		}
	}

	function handlePrevious() {
		if (isAnimating) return;
		if (currentPageIndex > 0) {
			onPageChange?.(currentPageIndex - 1);
		}
	}

	// Keyboard navigation
	function handleKeydown(event: KeyboardEvent) {
		if (isAnimating) return;

		if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === ' ') {
			event.preventDefault();
			handleNext();
		} else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
			event.preventDefault();
			handlePrevious();
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});

	// Get page theme colors based on page type
	function getPageTheme(page: BookPage) {
		switch (page.content.type) {
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

<div class="book-view-container">
	<!-- Page indicator top left -->
	{#if pages[currentPageIndex] && pages[currentPageIndex].content.type !== 'cover'}
		<div class="page-indicator-top">
			<span class="page-label">
				Page {currentPageIndex + 1} of {pages.length}
			</span>
		</div>
	{/if}

	<!-- Book card with theme-based styling -->
	<div class="book-card-wrapper">
		<div
			bind:this={cardElement}
			class="book-card {getPageTheme(pages[currentPageIndex] || pages[0])}"
		>
			{#if pages[currentPageIndex]}
				<PageContent page={pages[currentPageIndex]} />
			{/if}
		</div>

		<!-- 3D depth shadows -->
		<div class="card-shadow-left"></div>
		<div class="card-shadow-right"></div>
	</div>

	<!-- Navigation controls -->
	<div class="navigation-controls">
		<button
			class="nav-button prev-button"
			disabled={currentPageIndex === 0 || isAnimating}
			onclick={handlePrevious}
			aria-label="Previous page"
		>
			<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path>
			</svg>
			<span class="button-text">Previous</span>
		</button>

		<div class="page-counter">
			<span class="current">{currentPageIndex + 1}</span>
			<span class="separator">/</span>
			<span class="total">{pages.length}</span>
		</div>

		<button
			class="nav-button next-button"
			disabled={currentPageIndex === pages.length - 1 || isAnimating}
			onclick={handleNext}
			aria-label="Next page"
		>
			<span class="button-text">Next</span>
			<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path>
			</svg>
		</button>
	</div>

	<!-- Scroll hint -->
	{#if currentPageIndex === 0 && !isAnimating}
		<div class="scroll-hint">
			<span>Use arrow keys or click Next</span>
			<svg class="hint-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
			</svg>
		</div>
	{/if}
</div>

<style>
	.book-view-container {
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

		/* Modern gradient background - Light mode */
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	:global(.dark) .book-view-container {
		/* Dark mode gradient - inspired by "Interactive Visualist" */
		background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
	}

	/* Animated background particles (optional enhancement) */
	.book-view-container::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
					radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
		pointer-events: none;
		z-index: 0;
	}

	.page-indicator-top {
		position: fixed;
		top: 2rem;
		left: 2rem;
		z-index: 100;
	}

	.page-label {
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
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
	}

	.book-card-wrapper {
		position: relative;
		width: 100%;
		max-width: 1100px;
		height: 80vh;
		min-height: 600px;
		max-height: 850px;
		transform-style: preserve-3d;
		z-index: 10;
	}

	.book-card {
		width: 100%;
		height: 100%;
		border-radius: 1.5rem;
		padding: 4rem;
		box-shadow:
			0 60px 120px rgba(0, 0, 0, 0.5),
			0 25px 50px rgba(0, 0, 0, 0.4),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
		transform-style: preserve-3d;
		backface-visibility: hidden;
		overflow: hidden;
		position: relative;
		border: 1px solid rgba(255, 255, 255, 0.1);
		transition: background 0.3s ease;
	}

	/* Unified theme backgrounds - consistent across all pages */
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

	/* Card depth shadows */
	.card-shadow-left,
	.card-shadow-right {
		position: absolute;
		top: 8%;
		height: 84%;
		width: 80px;
		background: linear-gradient(90deg, rgba(0, 0, 0, 0.4), transparent);
		z-index: -1;
		pointer-events: none;
		border-radius: 1rem;
		filter: blur(20px);
	}

	.card-shadow-left {
		left: -70px;
		transform: rotateY(-20deg) translateZ(-30px);
	}

	.card-shadow-right {
		right: -70px;
		background: linear-gradient(-90deg, rgba(0, 0, 0, 0.4), transparent);
		transform: rotateY(20deg) translateZ(-30px);
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
		letter-spacing: 0.025em;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.nav-button:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.3);
		transform: translateY(-3px);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
	}

	.nav-button:active:not(:disabled) {
		transform: translateY(-1px);
	}

	.nav-button:disabled {
		opacity: 0.3;
		cursor: not-allowed;
		transform: none;
	}

	.nav-button .icon {
		width: 1.25rem;
		height: 1.25rem;
		stroke-width: 2.5px;
	}

	.next-button:not(:disabled) {
		animation: pulse 2.5s ease-in-out infinite;
		background: rgba(255, 255, 255, 0.25);
	}

	@keyframes pulse {
		0%, 100% {
			transform: scale(1);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		}
		50% {
			transform: scale(1.05);
			box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
		}
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
		box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.current {
		font-size: 1.5rem;
		line-height: 1;
	}

	.separator {
		opacity: 0.5;
		font-size: 1rem;
	}

	.total {
		opacity: 0.8;
		font-size: 1.125rem;
	}

	.scroll-hint {
		position: fixed;
		bottom: 8rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		color: rgba(255, 255, 255, 0.85);
		font-size: 0.875rem;
		font-weight: 600;
		letter-spacing: 0.025em;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
		animation: bounce 2.5s infinite;
		z-index: 90;
	}

	.hint-arrow {
		width: 1.75rem;
		height: 1.75rem;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
	}

	@keyframes bounce {
		0%, 100% {
			transform: translateX(-50%) translateY(0);
		}
		50% {
			transform: translateX(-50%) translateY(-12px);
		}
	}

	/* Mobile responsive */
	@media (max-width: 768px) {
		.book-card-wrapper {
			height: 75vh;
			max-width: 100%;
			min-height: 500px;
		}

		.book-card {
			padding: 2rem 1.5rem;
			border-radius: 1rem;
		}

		.navigation-controls {
			gap: 1rem;
			padding: 0.75rem 1.5rem;
		}

		.nav-button {
			padding: 0.75rem;
		}

		.button-text {
			display: none;
		}

		.page-counter {
			padding: 0.5rem 1.25rem;
		}

		.current {
			font-size: 1.25rem;
		}

		.total {
			font-size: 1rem;
		}

		.card-shadow-left,
		.card-shadow-right {
			display: none;
		}

		.page-indicator-top {
			top: 1rem;
			left: 1rem;
		}

		.page-label {
			font-size: 0.625rem;
			padding: 0.4rem 1rem;
		}
	}
</style>
