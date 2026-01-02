<script lang="ts">
	/**
	 * BookOpeningAnimation Component (True 3D Hinge Version)
	 * Implements a physically correct book opening using a single hinge axis.
	 * Eliminates "pops" and "ghost pages" by keeping geometry rigid.
	 */

	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import type { CoverContent, BookPage } from '$lib/types/book';
	import PageContent from './PageContent.svelte';

	interface Props {
		coverData: CoverContent;
		pages: BookPage[];
		onComplete?: () => void;
	}

	let { coverData, pages, onComplete }: Props = $props();

	let animationContainer: HTMLDivElement | undefined;

	onMount(() => {
		startOpeningAnimation();
	});

	async function startOpeningAnimation() {
		if (!animationContainer) return;

		const timeline = gsap.timeline({
			defaults: {
				ease: 'power2.out' // Default smooth easing
			},
			onComplete: () => {
				onComplete?.();
			}
		});

		const bookContainer = animationContainer.querySelector('.animation-book');
		const flipper = animationContainer.querySelector('.book-flipper');
		const rightPage = animationContainer.querySelector('.book-right-page');
		const frontFace = animationContainer.querySelector('.flipper-front');
		const backFace = animationContainer.querySelector('.flipper-back');
		const spine = animationContainer.querySelector('.animation-spine');

		if (!bookContainer || !flipper || !rightPage || !frontFace || !backFace || !spine) return;

		// Ensure container is fully visible at start
		gsap.set(animationContainer, { opacity: 1 });

		// --- CALCULATE DIMENSIONS FOR PIXEL-PERFECT POSITIONING ---
		const closedWidthStr = 'clamp(300px, 50vw, 500px)';
		const closedHeightStr = 'clamp(400px, 65vh, 700px)';

		// Set initial dimensions to measure
		gsap.set([flipper, rightPage], {
			width: closedWidthStr,
			height: closedHeightStr
		});

		// Calculate actual pixel width after clamp
		const actualWidth = flipper.getBoundingClientRect().width;
		const centerOffset = -actualWidth / 2;

		// Open dimensions - match BookSpreadView exactly
		// BookSpreadView container has padding: 2rem (4rem total = 64px typical)
		// BookSpreadView: 95% of (100vw - 64px) split into 2 pages
		// Use calc() to match exactly: (95vw - 3.8rem) / 2 ≈ 47.5vw - 1.9rem
		const openPageWidth = 'calc(47.5vw - 1.9rem)';
		const openPageHeight = '85vh';

		// --- INITIAL STATE (MATCH CLOSEDBOOK VIEW) ---

		// Position: Match the tilted, off-center closed book
		gsap.set(bookContainer, {
			rotationX: 5,    // Slight tilt down
			rotationY: -25,  // Tilted left
			y: 0,
			z: 0,
			x: centerOffset, // Center the cover visually
			scale: 1,
			transformPerspective: 2500
		});

		// Flipper starts flat (cover visible)
		gsap.set(flipper, {
			rotationY: 0,
			transformStyle: 'preserve-3d'
		});

		// Anti-flicker: Z-separation for faces
		gsap.set(frontFace, { z: 2, backfaceVisibility: 'hidden' });
		gsap.set(backFace, { z: -2, backfaceVisibility: 'hidden' });

		// Hide content initially
		gsap.set([
			backFace.querySelector('.page-content-wrapper'),
			rightPage.querySelector('.page-content-wrapper')
		], {
			opacity: 0
		});

		// Spine hidden initially - will expand with pages
		gsap.set(spine, {
			opacity: 0,
			height: closedHeightStr // Start at closed book height
		});

		// --- PHASE 1: CENTER & STRAIGHTEN (1.2s) ---
		// Smoothly bring book to center with no tilt
		timeline.to(bookContainer, {
			rotationY: 0,     // Remove horizontal tilt
			rotationX: 0,     // Remove vertical tilt
			y: -40,           // Lift slightly for presentation
			scale: 1.02,      // Subtle scale for depth
			duration: 1.2,
			ease: 'power3.out' // Smooth deceleration
		}, 'center');

		// --- PHASE 2: ANTICIPATION BREATHE (0.4s) ---
		// Small scale pulse - builds anticipation
		timeline.to(bookContainer, {
			scale: 1.05,
			duration: 0.2,
			ease: 'power1.inOut',
		}, '+=0.3') // Short pause after centering
		.to(bookContainer, {
			scale: 1.0,
			duration: 0.2,
			ease: 'power1.inOut'
		});

		// --- PHASE 3: THE OPENING (1.6s) ---
		// Simultaneous: Slide spine to center + Expand pages + Flip cover

		// 3a. Slide spine to center (cover moves right as spine centers)
		timeline.to(
			bookContainer,
			{
				x: 0, // Spine moves to center
				y: 0, // Return to neutral height
				duration: 1.6,
				ease: 'power3.inOut' // Smooth acceleration and deceleration
			},
			'open'
		);

		// 3b. Expand pages to open book size - match BookSpreadView exactly
		timeline.to(
			[flipper, rightPage],
			{
				width: openPageWidth,
				maxWidth: '900px', // Match BookSpreadView: 1800px / 2 = 900px
				minWidth: '350px', // Match BookSpreadView: 700px / 2 = 350px
				height: openPageHeight,
				maxHeight: '1000px', // Match BookSpreadView
				minHeight: '700px', // Match BookSpreadView
				duration: 1.6,
				ease: 'power3.inOut'
			},
			'open'
		);

		// 3c. Flip the cover (0° → -180°)
		// Using a custom ease for more realistic page turn
		timeline.to(
			flipper,
			{
				rotationY: -180,
				duration: 1.6,
				ease: 'power2.inOut',
				transformOrigin: 'left center'
			},
			'open'
		);

		// 3d. Reveal spine as book opens (match BookSpreadView visibility)
		// Animate both opacity and height to match page expansion
		timeline.to(
			spine,
			{
				opacity: 1, // Fully visible to match BookSpreadView
				height: openPageHeight, // Match page height
				maxHeight: '1000px', // Match page constraints
				minHeight: '700px',
				duration: 1.6, // Match page expansion duration
				ease: 'power3.inOut' // Match page expansion easing
			},
			'open' // Start at same time as page expansion
		);

		// 3e. Fade in page content progressively
		// Left page appears first (as cover flips away)
		timeline.to(
			backFace.querySelector('.page-content-wrapper'),
			{
				opacity: 1,
				duration: 0.6,
				ease: 'power2.out'
			},
			'open+=0.5' // Start revealing midway through flip
		);

		// Right page appears shortly after
		timeline.to(
			rightPage.querySelector('.page-content-wrapper'),
			{
				opacity: 1,
				duration: 0.6,
				ease: 'power2.out'
			},
			'open+=0.7' // Stagger for natural feel
		);

		// --- PHASE 4: SETTLE TO FLAT (0.6s) ---
		// Settle to flat position first
		timeline.to(
			bookContainer,
			{
				rotationX: 0, // Flat
				rotationY: 0,
				y: 0,
				scale: 1,
				duration: 0.6,
				ease: 'power2.out'
			},
			'-=0.4' // Overlap with previous animation
		);

		// --- PHASE 5: TILT TO READING ANGLE (1.4s) ---
		// Smoothly tilt to the reading position (matches BookSpreadView)
		// This creates a seamless transition to the open book view
		timeline.to(
			bookContainer,
			{
				rotationX: 15, // Match BookSpreadView's reading angle
				y: 0,
				duration: 1.4, // Slower for smooth, realistic feel
				ease: 'power1.out' // Gentle ease - no bounce, natural deceleration
			},
			'+=0.3' // Slightly longer pause for natural feel
		);

		// Animation complete - BookSpreadView will appear on top with higher z-index
		// No fade-out to prevent black screen flash
	}

	// Get first two pages for the animation
	const firstLeftPage = $derived(pages[0]);
	const firstRightPage = $derived(pages[1]);
</script>

<div bind:this={animationContainer} class="animation-container">
	<!-- Hinge-based Book Container -->
	<!-- The "Spine" is implicitly the center of this flex container where items anchor -->
	<div class="animation-book">
		
		<!-- RIGHT PAGE (Static Base) -->
		<!-- Anchored Left (Spine), Expands Right -->
		<div class="book-right-page">
			<div class="page-content-wrapper">
				{#if firstRightPage}
					<PageContent page={firstRightPage} />
				{/if}
			</div>
			<div class="page-gradient right-gradient"></div>
		</div>

		<!-- FLIPPER (Left Page + Cover) -->
		<!-- Anchored Right (Spine), Expands Left (visually) because it flips left -->
		<!-- Starts at 0deg (Cover Visible). Flips to -180deg (Left Page Visible) -->
		<div class="book-flipper">
			
			<!-- FRONT FACE: The Cover -->
			<div class="flipper-front">
				<div class="cover-design">
					<div class="cover-gradient"></div>
					<div class="cover-content">
						<div class="cover-decoration">
							<div class="decoration-line"></div>
							<div class="decoration-dot"></div>
							<div class="decoration-line"></div>
						</div>
						<div class="cover-main">
							<h1 class="cover-name">{coverData.name}</h1>
							<div class="cover-divider"></div>
							<p class="cover-title">{coverData.title}</p>
							<p class="cover-tagline">{coverData.tagline}</p>
						</div>
						<div class="cover-decoration">
							<div class="decoration-line"></div>
							<div class="decoration-dot"></div>
							<div class="decoration-line"></div>
						</div>
					</div>
					<!-- Spine Edge (Left) -->
					<div class="cover-spine-edge"></div>
				</div>
			</div>

			<!-- BACK FACE: The Left Page -->
			<div class="flipper-back">
				<div class="page-content-wrapper">
					{#if firstLeftPage}
						<PageContent page={firstLeftPage} />
					{/if}
				</div>
				<div class="page-gradient left-gradient"></div>
			</div>

		</div>

		<!-- CENTER SPINE (Visual Only) -->
		<div class="animation-spine">
			<div class="spine-highlight"></div>
		</div>

	</div>
</div>

<style>
	.animation-container {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		/* Light Mode: Clean light background */
		background: linear-gradient(135deg, #FBFBFA 0%, #f0f0f5 100%);
		perspective: 2500px; /* Strong perspective for 3D feel */
		perspective-origin: center 50%;
		z-index: 1000;
		overflow: hidden;
		/* Performance optimizations */
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	:global(.dark) .animation-container {
		/* Dark Mode: Sophisticated background with blue-gray radial highlights */
		background:
			radial-gradient(ellipse at 50% 0%, rgba(125, 163, 214, 0.15) 0%, transparent 50%),
			radial-gradient(ellipse at 50% 100%, rgba(194, 199, 211, 0.15) 0%, transparent 50%),
			linear-gradient(135deg,
			rgb(21, 21, 27) 100%,
			rgb(45, 49, 58) 50%,
			rgb(7, 7, 9) 100%
			);
	}

	/* The Book Container - Holds the Spine Axis */
	.animation-book {
		position: relative;
		/* 0 size container - everything grows out from Center Spine */
		width: 0;
		height: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		transform-style: preserve-3d;
		/* Performance optimizations */
		will-change: transform;
		backface-visibility: hidden;
	}

	/* Common Page Styles */
	.book-right-page,
	.book-flipper {
		position: absolute;
		top: 50%; /* Center Vertical */
		transform: translateY(-50%);
		background: #fff;
		box-shadow:
			0 10px 40px rgba(0, 0, 0, 0.2),
			0 5px 15px rgba(0, 0, 0, 0.15);
		/* Performance optimizations */
		will-change: transform, width, height;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
	}

	:global(.dark) .book-right-page,
	:global(.dark) .book-flipper .flipper-back {
		background: linear-gradient(135deg, rgba(25, 30, 40, 0.95) 0%, rgba(30, 35, 45, 0.95) 30%, rgba(35, 40, 55, 0.95) 60%, rgba(25, 30, 40, 0.95) 100%);
		backdrop-filter: blur(25px) saturate(180%);
		-webkit-backdrop-filter: blur(25px) saturate(180%);
	}

	/* RIGHT PAGE: Anchored LEFT (Spine), Grows RIGHT */
	.book-right-page {
		left: 0; /* Attach left edge to center spine */
		transform-origin: left center;
		border-radius: 0 1rem 1rem 0;
		z-index: 1; /* Below flipper initially */
	}

	/* FLIPPER: Anchored to spine, flips open like a real book cover */
	.book-flipper {
		left: 0; /* Attach left edge to center spine */
		transform-origin: left center; /* Hinge is on the Left (Spine) */
		transform-style: preserve-3d;
		z-index: 2; /* On top */
		border-radius: 0 1rem 1rem 0; /* Matches Right Page when closed */
		/* Smooth transitions */
		transition: box-shadow 0.3s ease;
	}

	.book-flipper:hover {
		box-shadow:
			0 15px 50px rgba(0, 0, 0, 0.25),
			0 8px 20px rgba(0, 0, 0, 0.2);
	}

	/* FACES */
	.flipper-front,
	.flipper-back {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		backface-visibility: hidden; /* Crucial */
		-webkit-backface-visibility: hidden;
		overflow: hidden;
	}

	/* FRONT (Cover) */
	.flipper-front {
		z-index: 2;
		background: linear-gradient(135deg, rgba(25, 30, 40, 0.95) 0%, rgba(30, 35, 45, 0.95) 30%, rgba(35, 40, 55, 0.95) 60%, rgba(25, 30, 40, 0.95) 100%);
		backdrop-filter: blur(25px) saturate(180%);
		-webkit-backdrop-filter: blur(25px) saturate(180%);
		border-radius: 0 1rem 1rem 0;
	}

	.cover-design {
		width: 100%;
		height: 100%;
		position: relative;
	}

	/* BACK (Left Page) */
	.flipper-back {
		transform: rotateY(180deg); /* Faces the other way */
		z-index: 1;
		background: #fff;
		border-radius: 1rem 0 0 1rem; /* Inverted radius for left page */
	}
	
	:global(.dark) .flipper-back {
		background: linear-gradient(135deg, rgba(25, 30, 40, 0.95) 0%, rgba(30, 35, 45, 0.95) 30%, rgba(35, 40, 55, 0.95) 60%, rgba(25, 30, 40, 0.95) 100%);
		backdrop-filter: blur(25px) saturate(180%);
		-webkit-backdrop-filter: blur(25px) saturate(180%);
	}

	/* Content Internal */
	.page-content-wrapper {
		width: 100%;
		height: 100%;
		padding: 3rem;
		overflow: hidden;
	}
	
	/* Same Cover Styles as ClosedBookView to ensure visual match */
	.cover-content {
		position: relative;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 3rem 2rem;
		border: 2px solid var(--color-border);
		border-left: none; /* Spine side */
	}

	/* Copy Cover Styles for fidelity... */
	.cover-name { font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; color: var(--color-text-primary); text-align: center; }
	.cover-title { font-size: clamp(1rem, 2vw, 1.5rem); font-weight: 600; color: var(--color-accent); text-align: center; }
	.cover-tagline { font-size: 0.875rem; color: var(--color-text-secondary); text-align: center; font-style: italic; }

	.cover-divider {
		width: 5rem; height: 3px; background: linear-gradient(to right, transparent, var(--color-accent), transparent); margin: 1rem auto;
	}

	.decoration-line { height: 2px; width: 3rem; background: linear-gradient(to right, transparent, var(--color-accent), transparent); }
	.decoration-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--color-accent); }
	.cover-decoration { display: flex; align-items: center; justify-content: center; gap: 1rem; }

	/* Spine Visual - Match BookSpreadView styling */
	.animation-spine {
		position: absolute; /* Centered in zero-width container */
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 30px; /* Match BookSpreadView width */
		height: clamp(400px, 65vh, 700px); /* Initial height - will animate to match pages */
		background: linear-gradient(90deg,
			rgba(0, 0, 0, 0.2) 0%,
			rgba(0, 0, 0, 0.5) 50%,
			rgba(0, 0, 0, 0.2) 100%
		);
		z-index: 10; /* Match BookSpreadView - appear on top of pages */
		opacity: 0; /* Fade in when opening */
		box-shadow:
			inset 2px 0 4px rgba(0, 0, 0, 0.3),
			inset -2px 0 4px rgba(0, 0, 0, 0.3);
		/* Performance */
		will-change: opacity, height, transform;
	}

	/* Spine highlight for realism - Match BookSpreadView */
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

	/* Gradients */
	.right-gradient {
		left: 0;
		width: 40px;
		background: linear-gradient(to right, rgba(0,0,0,0.1), transparent);
		top: 0;
		bottom: 0;
		position: absolute;
		pointer-events: none;
	}

	.left-gradient {
		right: 0;
		width: 40px;
		background: linear-gradient(to left, rgba(0,0,0,0.1), transparent);
		top: 0;
		bottom: 0;
		position: absolute;
		pointer-events: none;
	}

	/* Mobile Responsive */
	@media (max-width: 768px) {
		.animation-container {
			perspective: 1800px; /* Reduce perspective for smaller screens */
		}

		.page-content-wrapper {
			padding: 2rem 1.5rem;
		}

		.cover-content {
			padding: 2rem 1.5rem;
		}

		.animation-spine {
			width: 30px;
		}
	}

	/* Tablet */
	@media (min-width: 769px) and (max-width: 1024px) {
		.animation-container {
			perspective: 2200px;
		}
	}

	/* Reduce motion for accessibility */
	@media (prefers-reduced-motion: reduce) {
		.animation-book,
		.book-flipper,
		.book-right-page {
			transition: none;
			animation: none;
		}

		.animation-spine {
			transition: opacity 0.3s ease;
		}
	}
</style>
