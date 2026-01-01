<script lang="ts">
	/**
	 * BookSpreadView Component - Enhanced with Smooth 3D Animations
	 * Realistic two-page spread with center binding and smooth page-turn animation
	 * Pages flip from the center spine like a real book with depth and shadows
	 *
	 * Following Svelte 5 runes best practices
	 */

	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import PageContent from './PageContent.svelte';
	import type { BookPage } from '$lib/types/book';
	import { createScrollHandler } from '$lib/utils/scroll-handler';

	interface Props {
		pages: BookPage[];
		currentPageIndex: number;
		onPageChange?: (index: number) => void;
		onClose?: () => void; // Keep for ESC key and scroll up functionality
	}

	let { pages, currentPageIndex, onPageChange }: Props = $props();

	// Navigate to Table of Contents (page 0)
	function handleGoToIndex() {
		onPageChange?.(0);
	}

	// Handle TOC chapter navigation
	function handleChapterClick(pageNumber: number) {
		// Find the page index for the given page number
		const targetIndex = pages.findIndex(p => p.pageNumber === pageNumber);
		if (targetIndex !== -1) {
			// Ensure we navigate to an even page (left page of spread)
			const evenIndex = Math.floor(targetIndex / 2) * 2;
			onPageChange?.(evenIndex);
		}
	}

	let leftPageElement: HTMLDivElement | undefined;
	let rightPageElement: HTMLDivElement | undefined;
	let bookSpreadElement: HTMLDivElement | undefined;
	let turningPageElement: HTMLDivElement | null = null;
	let isAnimating = $state(false);
	let previousIndex = $state(0);
	let isInitialized = $state(false);

	// Track left and right pages independently for smooth animations
	let displayedLeftIndex = $state(0); // Left page index
	let displayedRightIndex = $state(1); // Right page index
	let rightPageBlur = $state(0); // Blur for right page during animation (0 = clear, 10 = max blur)
	let leftPageBlur = $state(0); // Blur for left page during animation

	// Watch for external page changes and animate
	$effect(() => {
		const current = currentPageIndex;

		// Initialize on first run
		if (!isInitialized) {
			previousIndex = current;
			displayedLeftIndex = Math.floor(current / 2) * 2;
			displayedRightIndex = displayedLeftIndex + 1;
			isInitialized = true;
			return;
		}

		if (current !== previousIndex && !isAnimating) {
			const direction = current > previousIndex ? 'next' : 'prev';
			animatePageTurn(direction);
			previousIndex = current;
		}
	});

	async function animatePageTurn(direction: 'next' | 'prev') {
		if (isAnimating || !bookSpreadElement) return;
		isAnimating = true;

		// Step 1: Capture the turning page content BEFORE any state changes
		const turningPage = document.createElement('div');
		turningPage.className = 'turning-page';

		if (direction === 'next' && rightPageElement) {
			// Turning right page (page 2) to reveal left page of new spread (page 3)
			turningPage.innerHTML = rightPageElement.innerHTML;
			turningPage.classList.add('turn-right-to-left');
		} else if (direction === 'prev' && leftPageElement) {
			// Turning left page back to reveal right page of previous spread
			turningPage.innerHTML = leftPageElement.innerHTML;
			turningPage.classList.add('turn-left-to-right');
		}

		bookSpreadElement.appendChild(turningPage);
		turningPageElement = turningPage;

		// Step 2: Blur ONLY the page that's about to be turned (stationary page stays clear!)
		if (direction === 'next') {
			// Turning right page - blur it immediately, left page stays clear
			rightPageBlur = 20;
		} else {
			// Turning left page - blur it immediately, right page stays clear
			leftPageBlur = 20;
		}

		// Enhanced page turn animation with curl effect
		const timeline = gsap.timeline();

		if (direction === 'next') {
			// Turn right page to left with realistic curl
			timeline.fromTo(
				turningPage,
				{
					rotationY: 0,
					transformOrigin: 'left center',
					z: 30,
					filter: 'brightness(1)',
					boxShadow: '0 0 0 rgba(0, 0, 0, 0)'
				},
				{
					rotationY: -180,
					z: 30,
					duration: 1.2,
					ease: 'power2.inOut',
					transformOrigin: 'left center',
					onUpdate: function() {
						const progress = this.progress();

						// Curved shadow that intensifies at midpoint
						const shadowIntensity = Math.sin(progress * Math.PI) * 0.6;
						const shadowBlur = 60 + (Math.sin(progress * Math.PI) * 40);
						const shadowSpread = -10 + (Math.sin(progress * Math.PI) * 10);

						// Slight brightness variation for depth
						const brightness = 1 - (Math.sin(progress * Math.PI) * 0.15);

						gsap.set(turningPage, {
							boxShadow: `${-30 * progress}px 0 ${shadowBlur}px ${shadowSpread}px rgba(0, 0, 0, ${shadowIntensity})`,
							filter: `brightness(${brightness})`
						});
					}
				}
			);
		} else {
			// Turn left page to right with realistic curl
			timeline.fromTo(
				turningPage,
				{
					rotationY: 0,
					transformOrigin: 'right center',
					z: 30,
					filter: 'brightness(1)',
					boxShadow: '0 0 0 rgba(0, 0, 0, 0)'
				},
				{
					rotationY: 180,
					z: 30,
					duration: 1.2,
					ease: 'power2.inOut',
					transformOrigin: 'right center',
					onUpdate: function() {
						const progress = this.progress();

						// Curved shadow that intensifies at midpoint
						const shadowIntensity = Math.sin(progress * Math.PI) * 0.6;
						const shadowBlur = 60 + (Math.sin(progress * Math.PI) * 40);
						const shadowSpread = -10 + (Math.sin(progress * Math.PI) * 10);

						// Slight brightness variation for depth
						const brightness = 1 - (Math.sin(progress * Math.PI) * 0.15);

						gsap.set(turningPage, {
							boxShadow: `${30 * progress}px 0 ${shadowBlur}px ${shadowSpread}px rgba(0, 0, 0, ${shadowIntensity})`,
							filter: `brightness(${brightness})`
						});
					}
				}
			);
		}

		// Step 3: Wait for the page turn to complete
		await timeline;

		// Step 4: Remove the turning page element
		if (turningPageElement) {
			turningPageElement.remove();
			turningPageElement = null;
		}

		// Step 5: Now blur the stationary page too, before updating content
		if (direction === 'next') {
			// Left page was clear, now blur it before updating
			leftPageBlur = 20;
		} else {
			// Right page was clear, now blur it before updating
			rightPageBlur = 20;
		}

		// Give a moment for blur to apply
		await new Promise(resolve => setTimeout(resolve, 50));

		// Step 6: Update BOTH pages to final positions (both are blurred now, so swap is invisible)
		const finalLeftIndex = Math.floor(currentPageIndex / 2) * 2;
		const finalRightIndex = finalLeftIndex + 1;
		displayedLeftIndex = finalLeftIndex;
		displayedRightIndex = finalRightIndex;

		// Step 7: Smoothly unblur BOTH pages together to reveal pages 3-4
		await gsap.to({}, {
			duration: 0.5, // Quick but smooth transition - easy on eyes
			ease: 'power2.out', // Quick start, smooth end
			onUpdate: function() {
				const progress = this.progress();
				// Reduce blur from 20 to 0 on BOTH pages
				const currentBlur = 20 * (1 - progress);
				leftPageBlur = currentBlur;
				rightPageBlur = currentBlur;
			}
		});

		// Ensure blur is completely removed
		rightPageBlur = 0;
		leftPageBlur = 0;

		isAnimating = false;
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
		// Keyboard navigation
		window.addEventListener('keydown', handleKeydown);

		// Scroll navigation - 400ms debounce for book-like pacing
		const scrollHandler = createScrollHandler(
			(direction) => {
				if (direction === 'next') handleNext();
				else handlePrevious();
			},
			400 // Slower debounce for deliberate book-like feel
		);

		window.addEventListener('wheel', scrollHandler, { passive: true });

		return () => {
			window.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('wheel', scrollHandler);
		};
	});

	// Get current spread pages using independent left/right indices
	const leftPage = $derived(pages[displayedLeftIndex]);
	const rightPage = $derived(pages[displayedRightIndex]);

	// Get page theme colors
	function getPageTheme(page: BookPage | undefined) {
		if (!page) return 'theme-default';

		switch (page.content.type) {
			case 'cover':
				return 'theme-cover';
			case 'about':
				return 'theme-about';
			case 'experience':
				return 'theme-experience';
			case 'projects-intro':
			case 'project-spread-left':
			case 'project-spread-right':
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
	<!-- Table of Contents Navigation Button - Only show when not on TOC pages -->
	{#if currentPageIndex > 1}
		<button
			class="toc-nav-button"
			onclick={handleGoToIndex}
			aria-label="Go to Table of Contents"
		>
			<svg class="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
			</svg>
			<span class="button-label">Index</span>
		</button>
	{/if}

	<!-- Page indicator -->
	{#if leftPage && leftPage.content.type !== 'cover'}
		<div class="page-indicator">
			<span>Pages {displayedLeftIndex + 1}-{Math.min(displayedRightIndex + 1, pages.length)} of {pages.length}</span>
		</div>
	{/if}

	<!-- Book spread with enhanced 3D effects -->
	<div class="book-spread" bind:this={bookSpreadElement}>
		<!-- Navigation Zones (Invisible Click Targets with Hover Hint) -->
		{#if currentPageIndex > 0}
			<button 
				class="nav-zone left-zone" 
				onclick={(e) => { e.stopPropagation(); handlePrevious(); }} 
				aria-label="Previous page"
			>
				<div class="nav-hint">
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
					</svg>
				</div>
			</button>
		{/if}

		{#if currentPageIndex < pages.length - 2}
			<button 
				class="nav-zone right-zone" 
				onclick={(e) => { e.stopPropagation(); handleNext(); }} 
				aria-label="Next page"
			>
				<div class="nav-hint">
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 23 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
					</svg>
				</div>
			</button>
		{/if}
		<!-- Left page with hover effect -->
		<div
			bind:this={leftPageElement}
			class="book-page left-page {getPageTheme(leftPage)}"
			style="filter: blur({leftPageBlur}px); will-change: filter;"
			role="article"
			aria-label="Left page: {leftPage?.title || 'Empty'}"
		>
			{#if leftPage}
				<div class="page-content-wrapper">
					<PageContent page={leftPage} onChapterClick={handleChapterClick} />
				</div>
			{/if}

			<!-- Page number bottom-left -->
			{#if leftPage && leftPage.content.type !== 'cover'}
				<div class="page-number left">{displayedLeftIndex + 1}</div>
			{/if}

			<!-- Subtle page gradient overlay -->
			<div class="page-gradient left-gradient"></div>
		</div>

		<!-- Center spine/binding with enhanced depth -->
		<div class="book-spine">
			<div class="spine-highlight"></div>
		</div>

		<!-- Right page with hover effect -->
		<div
			bind:this={rightPageElement}
			class="book-page right-page {getPageTheme(rightPage)}"
			style="filter: blur({rightPageBlur}px); will-change: filter;"
			role="article"
			aria-label="Right page: {rightPage?.title || 'End'}"
		>
			{#if rightPage}
				<div class="page-content-wrapper">
					<PageContent page={rightPage} onChapterClick={handleChapterClick} />
				</div>
			{:else}
				<!-- Back cover or end -->
				<div class="flex items-center justify-center h-full">
					<div class="text-center p-8 space-y-4">
						<svg class="w-16 h-16 mx-auto text-green-500 animate-fadeInScale" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
						<p class="text-3xl font-bold text-obsidian-ink dark:text-white [animation:fadeInUp_0.6s_ease-out_0.2s_backwards]">
							Portfolio Complete
						</p>
						<p class="text-lg italic text-text-sub-light dark:text-steel opacity-70 [animation:fadeInUp_0.6s_ease-out_0.4s_backwards]">
							Thank you for reading
						</p>
					</div>
				</div>
			{/if}

			<!-- Page number bottom-right -->
			{#if rightPage}
				<div class="page-number right">{displayedRightIndex + 1}</div>
			{/if}

			<!-- Subtle page gradient overlay -->
			<div class="page-gradient right-gradient"></div>
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
			<span class="current">{displayedLeftIndex + 1}</span>
			<span class="separator">-</span>
			<span class="current">{Math.min(displayedRightIndex + 1, pages.length)}</span>
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
		padding: 1rem 2rem 9rem 2rem; /* Extra bottom padding to clear navigation buttons */

		/* 3D perspective on container for laptop-like tilt effect */
		perspective: 2000px;
		perspective-origin: center 60%; /* Slightly below center - viewing from below like a laptop */

		position: relative;
		overflow: hidden;
		/* Light Mode: Clean light background */
		background: linear-gradient(135deg, #FBFBFA 0%, #f0f0f5 100%);
		z-index: 1001; /* Above BookOpeningAnimation (z-index: 1000) */
	}

	:global(.dark) .book-container {
		/* Dark Mode: Deep dark background - NO cyan/greenish */
		background: linear-gradient(135deg, #040508 0%, #0a0a0f 50%, #040508 100%);
	}

	/* Table of Contents Navigation Button - Book-like design */
	.toc-nav-button {
		position: fixed;
		bottom: 8rem;
		right: 2.5rem;
		z-index: 100;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		background: color-mix(in srgb, hsl(var(--accent)) 15%, transparent);
		backdrop-filter: blur(12px) saturate(150%);
		border: 2px solid color-mix(in srgb, hsl(var(--accent)) 30%, transparent);
		border-radius: 0.75rem;
		color: hsl(var(--accent));
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		box-shadow: 0 4px 16px color-mix(in srgb, hsl(var(--accent)) 20%, transparent);
	}

	.toc-nav-button:hover {
		background: color-mix(in srgb, hsl(var(--accent)) 25%, transparent);
		border-color: color-mix(in srgb, hsl(var(--accent)) 50%, transparent);
		transform: translateY(-4px) scale(1.05);
		box-shadow: 0 8px 24px color-mix(in srgb, hsl(var(--accent)) 35%, transparent);
	}

	.toc-nav-button .icon {
		width: 1.5rem;
		height: 1.5rem;
		stroke-width: 2.5;
	}

	.toc-nav-button .button-label {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	:global(.dark) .toc-nav-button {
		background: color-mix(in srgb, hsl(var(--accent)) 12%, transparent);
		border-color: color-mix(in srgb, hsl(var(--accent)) 25%, transparent);
	}

	:global(.dark) .toc-nav-button:hover {
		background: color-mix(in srgb, hsl(var(--accent)) 20%, transparent);
		border-color: color-mix(in srgb, hsl(var(--accent)) 40%, transparent);
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

		/* Increased dimensions by ~30% for better content display */
		width: 95%;                  /* Was: 90% → +5% */
		max-width: 1800px;           /* Was: 1400px → +400px (28.5% increase) */
		height: 85vh;                /* Was: 80vh → +5vh */
		min-height: 700px;           /* Was: 600px → +100px (16.7% increase) */
		max-height: 1000px;          /* Was: 850px → +150px (17.6% increase) */

		/* 3D tilt - laptop-screen style: rotates around center X-axis, tilts back toward top */
		transform: rotateX(15deg) translateZ(0);
		transform-style: preserve-3d;
		transform-origin: center bottom; /* Pivot from bottom center like a laptop hinge */
		will-change: transform;

		/* Smooth GPU-accelerated transitions */
		transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);

		/* Rounded corners to match page edges */
		border-radius: 1rem;
		overflow: hidden; /* Ensure children respect rounded corners */

		box-shadow:
			0 60px 120px rgba(0, 0, 0, 0.5),
			0 25px 50px rgba(0, 0, 0, 0.4);
	}

	/* Subtle lift on hover (maintains same angle) */
	.book-spread:hover {
		transform: rotateX(15deg) translateZ(20px);
		box-shadow:
			0 70px 140px rgba(0, 0, 0, 0.55),
			0 30px 60px rgba(0, 0, 0, 0.45);
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
		will-change: auto; /* Only enable during transitions, not constantly */
	}

	.left-page {
		border-radius: 1rem 0 0 1rem;
		border-right: none;
	}

	.right-page {
		border-radius: 0 1rem 1rem 0;
		border-left: none;
	}

	/* Page content wrapper for smooth overflow */
	.page-content-wrapper {
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		scrollbar-width: thin;
		scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
	}

	.page-content-wrapper::-webkit-scrollbar {
		width: 6px;
	}

	.page-content-wrapper::-webkit-scrollbar-track {
		background: transparent;
	}

	.page-content-wrapper::-webkit-scrollbar-thumb {
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 3px;
	}

	:global(.dark) .page-content-wrapper::-webkit-scrollbar-thumb {
		background-color: rgba(255, 255, 255, 0.2);
	}

	/* Page gradient overlays for depth */
	.page-gradient {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 40px;
		pointer-events: none;
		z-index: 1;
	}

	.left-gradient {
		right: 0;
		background: linear-gradient(to left, rgba(0, 0, 0, 0.08), transparent);
	}

	.right-gradient {
		left: 0;
		background: linear-gradient(to right, rgba(0, 0, 0, 0.08), transparent);
	}

	.book-spine {
		width: 30px;
		height: 100%;
		background: linear-gradient(
			90deg,
			rgba(0, 0, 0, 0.2) 0%,
			rgba(0, 0, 0, 0.5) 50%,
			rgba(0, 0, 0, 0.2) 100%
		);
		box-shadow:
			inset 2px 0 4px rgba(0, 0, 0, 0.3),
			inset -2px 0 4px rgba(0, 0, 0, 0.3);
		position: relative;
		z-index: 10;
	}

	/* Navigation Zones */
	.nav-zone {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 15%; /* 15% of page width is active area */
		min-width: 60px;
		max-width: 120px;
		z-index: 40; /* Above page content */
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent; /* Invisible by default */
		border: none;
		cursor: pointer;
		outline: none;
		transition: background 0.3s ease;
	}

	.left-zone {
		left: 0;
		border-radius: 1rem 0 0 1rem;
	}
	
	.left-zone:hover {
		background: linear-gradient(to right, rgba(0,0,0,0.03), transparent);
	}

	.right-zone {
		right: 0;
		border-radius: 0 1rem 1rem 0;
	}

	.right-zone:hover {
		background: linear-gradient(to left, rgba(0,0,0,0.03), transparent);
	}

	.nav-hint {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(4px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		color: #1c1c1e;
		
		opacity: 0;
		transform: scale(0.8) translateY(10px);
		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	:global(.dark) .nav-hint {
		background: rgba(30, 40, 60, 0.9);
		color: #fff;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.nav-zone:hover .nav-hint {
		opacity: 1;
		transform: scale(1) translateY(0);
	}


	/* Spine highlight for realism */
	.spine-highlight {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 2px;
		height: 100%;
		background: linear-gradient(
			to bottom,
			transparent 0%,
			rgba(255, 255, 255, 0.15) 30%,
			rgba(255, 255, 255, 0.15) 70%,
			transparent 100%
		);
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
		background: linear-gradient(135deg, rgba(25, 30, 40, 0.95) 0%, rgba(30, 35, 45, 0.95) 30%, rgba(35, 40, 55, 0.95) 60%, rgba(25, 30, 40, 0.95) 100%);
		backdrop-filter: blur(25px) saturate(180%);
		-webkit-backdrop-filter: blur(25px) saturate(180%);
		border: 1px solid rgba(142, 142, 147, 0.15);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.05),
			0 8px 32px rgba(0, 0, 0, 0.3);
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
		will-change: transform, box-shadow, filter;
		pointer-events: none; /* Prevent interaction during animation */
	}

	:global(.dark) :global(.turning-page) {
		background: linear-gradient(135deg, rgba(25, 30, 40, 0.95) 0%, rgba(30, 35, 45, 0.95) 30%, rgba(35, 40, 55, 0.95) 60%, rgba(25, 30, 40, 0.95) 100%);
		backdrop-filter: blur(25px) saturate(180%);
		-webkit-backdrop-filter: blur(25px) saturate(180%);
		border: 1px solid rgba(142, 142, 147, 0.15);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.05),
			0 0 40px rgba(0, 0, 0, 0.3);
	}

	:global(.turning-page.turn-right-to-left) {
		/* Right page position - starts at right side, flips from left edge (center spine) */
		right: 0;
		border-radius: 0 1rem 1rem 0;
		border-left: none;
		transform-origin: left center;
		/* Add gradient overlay for realistic page curl shadow */
		background-image:
			linear-gradient(to right, rgba(0,0,0,0.1) 0%, transparent 5%),
			linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
	}

	:global(.turning-page.turn-left-to-right) {
		/* Left page position - starts at left side, flips from right edge (center spine) */
		left: 0;
		border-radius: 1rem 0 0 1rem;
		border-right: none;
		transform-origin: right center;
		/* Add gradient overlay for realistic page curl shadow */
		background-image:
			linear-gradient(to left, rgba(0,0,0,0.1) 0%, transparent 5%),
			linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%);
	}

	:global(.dark) :global(.turning-page.turn-right-to-left),
	:global(.dark) :global(.turning-page.turn-left-to-right) {
		background-image:
			linear-gradient(to right, rgba(0,0,0,0.2) 0%, transparent 5%),
			linear-gradient(135deg, rgba(25, 30, 40, 0.95) 0%, rgba(30, 35, 45, 0.95) 30%, rgba(35, 40, 55, 0.95) 60%, rgba(25, 30, 40, 0.95) 100%);
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
		gap: 2rem;
		padding: 1rem 2rem;
		background: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(16px) saturate(180%);
		border-radius: 1.5rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.25),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
	}

	:global(.dark) .navigation-controls {
		background: rgba(0, 0, 0, 0.5);
		border-color: rgba(255, 255, 255, 0.08);
	}

	.nav-button {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1.75rem;
		background: color-mix(in srgb, hsl(var(--accent)) 15%, transparent);
		backdrop-filter: blur(12px) saturate(150%);
		border: 2px solid color-mix(in srgb, hsl(var(--accent)) 30%, transparent);
		border-radius: 0.75rem;
		color: hsl(var(--accent));
		font-weight: 700;
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		box-shadow: 0 4px 16px color-mix(in srgb, hsl(var(--accent)) 20%, transparent);
	}

	.nav-button:hover:not(:disabled) {
		background: color-mix(in srgb, hsl(var(--accent)) 25%, transparent);
		border-color: color-mix(in srgb, hsl(var(--accent)) 50%, transparent);
		transform: translateY(-4px) scale(1.05);
		box-shadow: 0 8px 24px color-mix(in srgb, hsl(var(--accent)) 35%, transparent);
	}

	.nav-button:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	:global(.dark) .nav-button {
		background: color-mix(in srgb, hsl(var(--accent)) 12%, transparent);
		border-color: color-mix(in srgb, hsl(var(--accent)) 25%, transparent);
	}

	:global(.dark) .nav-button:hover:not(:disabled) {
		background: color-mix(in srgb, hsl(var(--accent)) 20%, transparent);
		border-color: color-mix(in srgb, hsl(var(--accent)) 40%, transparent);
	}

	.nav-button .icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	.page-counter {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: color-mix(in srgb, hsl(var(--accent)) 10%, transparent);
		border: 1px solid color-mix(in srgb, hsl(var(--accent)) 20%, transparent);
		border-radius: 0.75rem;
		font-weight: 800;
		color: hsl(var(--accent));
	}

	:global(.dark) .page-counter {
		background: color-mix(in srgb, hsl(var(--accent)) 8%, transparent);
		border-color: color-mix(in srgb, hsl(var(--accent)) 15%, transparent);
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
