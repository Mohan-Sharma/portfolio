<script lang="ts">
	/**
	 * BookClosingAnimation Component
	 * Reverse animation: tilted book → closes → returns to closed cover view
	 * Mirrors the opening animation in reverse
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
		startClosingAnimation();
	});

	async function startClosingAnimation() {
		if (!animationContainer) return;

		const timeline = gsap.timeline({
			defaults: {
				ease: 'power2.out'
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

		// Start from the open, tilted position (matches end of opening animation)
		// Account for BookSpreadView container padding: 2rem (4rem total)
		const openPageWidth = 'calc(47.5vw - 1.9rem)';
		const openPageHeight = '85vh';

		// --- INITIAL STATE (OPEN BOOK AT READING ANGLE) ---
		gsap.set([flipper, rightPage], {
			width: openPageWidth,
			maxWidth: '900px', // Match opening animation
			minWidth: '350px',
			height: openPageHeight,
			maxHeight: '1000px',
			minHeight: '700px',
			// Explicit positioning to ensure pages overlap at spine
			top: '50%',
			y: '-50%', // GSAP's translateY for vertical centering
			left: 0 // Both pages anchored to center spine
		});

		gsap.set(bookContainer, {
			rotationX: 15, // Reading angle
			rotationY: 0,
			x: 0,
			y: 0,
			scale: 1,
			transformPerspective: 2500
		});

		gsap.set(flipper, {
			rotationY: -180, // Already flipped
			transformStyle: 'preserve-3d'
		});

		gsap.set(frontFace, { z: 2, backfaceVisibility: 'hidden' });
		gsap.set(backFace, { z: -2, backfaceVisibility: 'hidden' });

		// Content visible initially
		gsap.set([
			backFace.querySelector('.page-content-wrapper'),
			rightPage.querySelector('.page-content-wrapper')
		], {
			opacity: 1
		});

		gsap.set(spine, { opacity: 0.12 });

		// --- PHASE 1: FADE OUT CONTENT (0.4s) ---
		timeline.to(
			[
				backFace.querySelector('.page-content-wrapper'),
				rightPage.querySelector('.page-content-wrapper')
			],
			{
				opacity: 0,
				duration: 0.4,
				ease: 'power2.out',
				stagger: 0.1
			}
		);

		// --- PHASE 2: TILT BACK TO FLAT (0.6s) ---
		timeline.to(
			bookContainer,
			{
				rotationX: 0, // Flat
				duration: 0.6,
				ease: 'power3.inOut'
			},
			'+=0.2'
		);

		// Fade out spine
		timeline.to(
			spine,
			{
				opacity: 0,
				scaleY: 0.8,
				duration: 0.6,
				ease: 'power2.out'
			},
			'-=0.6'
		);

		// --- PHASE 3: CLOSE THE BOOK (1.4s) ---
		// Flip cover back (reverse)
		timeline.to(
			flipper,
			{
				rotationY: 0, // Back to closed
				duration: 1.4,
				ease: 'power2.inOut',
				transformOrigin: 'left center'
			},
			'close'
		);

		// Shrink pages back to closed size
		const closedWidthStr = 'clamp(300px, 50vw, 500px)';
		const closedHeightStr = 'clamp(400px, 65vh, 700px)';

		timeline.to(
			[flipper, rightPage],
			{
				width: closedWidthStr,
				maxWidth: 'none',
				minWidth: 'none',
				height: closedHeightStr,
				maxHeight: 'none',
				minHeight: 'none',
				duration: 1.4,
				ease: 'power3.inOut'
			},
			'close'
		);

		// Move back to centered position
		// Calculate center offset
		const actualWidth = parseFloat(getComputedStyle(flipper).width) || 400;
		const centerOffset = -actualWidth / 2;

		timeline.to(
			bookContainer,
			{
				x: centerOffset,
				y: 0,
				duration: 1.4,
				ease: 'power3.inOut'
			},
			'close'
		);

		// --- PHASE 4: RETURN TO TILTED CLOSED POSITION (1.4s) ---
		timeline.to(
			bookContainer,
			{
				rotationX: 5, // Slight tilt
				rotationY: -25, // Tilted left
				y: 0,
				scale: 1,
				duration: 1.4, // Slower for smooth, realistic feel
				ease: 'power1.out' // Gentle ease - no bounce, natural deceleration
			},
			'+=0.3' // Slightly longer pause for natural feel
		);

		// Animation complete - ClosedBookView will appear seamlessly
		// No fade-out to prevent black screen flash (same strategy as opening animation)
	}

	// Get first two pages
	const firstLeftPage = $derived(pages[0]);
	const firstRightPage = $derived(pages[1]);
</script>

<div bind:this={animationContainer} class="animation-container">
	<div class="animation-book">
		<!-- RIGHT PAGE -->
		<div class="book-right-page">
			<div class="page-content-wrapper">
				{#if firstRightPage}
					<PageContent page={firstRightPage} />
				{/if}
			</div>
			<div class="page-gradient right-gradient"></div>
		</div>

		<!-- FLIPPER (Left Page + Cover) -->
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

		<!-- CENTER SPINE -->
		<div class="animation-spine"></div>
	</div>
</div>

<style>
	/* Reuse all styles from BookOpeningAnimation */
	.animation-container {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		/* Light Mode: Clean light background */
		background: linear-gradient(135deg, #FBFBFA 0%, #f0f0f5 100%);
		perspective: 2500px;
		perspective-origin: center 50%;
		z-index: 1000;
		overflow: hidden;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	:global(.dark) .animation-container {
		/* Dark Mode: Deep dark background - NO cyan/greenish */
		background: linear-gradient(135deg, #040508 0%, #0a0a0f 50%, #040508 100%);
	}

	.animation-book {
		position: relative;
		width: 0;
		height: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		transform-style: preserve-3d;
		will-change: transform;
		backface-visibility: hidden;
	}

	.book-right-page,
	.book-flipper {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background: #fff;
		box-shadow:
			0 10px 40px rgba(0, 0, 0, 0.2),
			0 5px 15px rgba(0, 0, 0, 0.15);
		will-change: transform, width, height;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
	}

	:global(.dark) .book-right-page,
	:global(.dark) .book-flipper .flipper-back {
		background: linear-gradient(135deg, rgba(25, 30, 40, 0.95) 0%, rgba(30, 35, 45, 0.95) 50%, rgba(35, 40, 55, 0.95) 100%);
	}

	.book-right-page {
		left: 0;
		transform-origin: left center;
		border-radius: 0 1rem 1rem 0;
		z-index: 1;
	}

	.book-flipper {
		left: 0;
		transform-origin: left center;
		transform-style: preserve-3d;
		z-index: 2;
		border-radius: 0 1rem 1rem 0;
	}

	.flipper-front,
	.flipper-back {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		overflow: hidden;
	}

	.flipper-front {
		z-index: 2;
		background: linear-gradient(135deg, #fff 0%, #f8fafc 100%);
		border-radius: 0 1rem 1rem 0;
	}

	:global(.dark) .flipper-front {
		background: linear-gradient(135deg, rgba(25, 30, 40, 0.95) 0%, rgba(30, 35, 45, 0.95) 50%, rgba(35, 40, 55, 0.95) 100%);
	}

	.cover-design {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.flipper-back {
		transform: rotateY(180deg);
		z-index: 1;
		background: #fff;
		border-radius: 1rem 0 0 1rem;
	}

	:global(.dark) .flipper-back {
		background: linear-gradient(135deg, rgba(25, 30, 40, 0.95) 0%, rgba(30, 35, 45, 0.95) 50%, rgba(35, 40, 55, 0.95) 100%);
	}

	.page-content-wrapper {
		width: 100%;
		height: 100%;
		padding: 3rem;
		overflow: hidden;
	}

	.cover-content {
		position: relative;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 3rem 2rem;
		border: 2px solid rgba(0, 0, 0, 0.1);
		border-left: none;
	}

	.cover-name {
		font-size: clamp(2rem, 4vw, 3rem);
		font-weight: 800;
		color: #1c1c1e;
		text-align: center;
	}
	:global(.dark) .cover-name {
		color: #e6e9ef;
	}
	.cover-title {
		font-size: clamp(1rem, 2vw, 1.5rem);
		font-weight: 600;
		color: #a64b35;
		text-align: center;
	}
	:global(.dark) .cover-title {
		color: #e27d60;
	}
	.cover-tagline {
		font-size: 0.875rem;
		color: #636366;
		text-align: center;
		font-style: italic;
	}
	:global(.dark) .cover-tagline {
		color: #8e8e93;
	}

	.cover-divider {
		width: 5rem;
		height: 3px;
		background: linear-gradient(to right, transparent, var(--color-accent), transparent);
		margin: 1rem auto;
	}

	.decoration-line {
		height: 2px;
		width: 3rem;
		background: linear-gradient(to right, transparent, var(--color-accent), transparent);
	}

	.decoration-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--color-accent);
	}
	.cover-decoration {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.animation-spine {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 40px;
		height: clamp(400px, 65vh, 700px);
		background: linear-gradient(90deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3));
		z-index: 0;
		opacity: 0;
		border-radius: 4px;
		box-shadow:
			inset 0 0 10px rgba(0, 0, 0, 0.5),
			0 2px 8px rgba(0, 0, 0, 0.3);
		will-change: opacity, transform;
	}

	.right-gradient {
		left: 0;
		width: 40px;
		background: linear-gradient(to right, rgba(0, 0, 0, 0.1), transparent);
		top: 0;
		bottom: 0;
		position: absolute;
		pointer-events: none;
	}

	.left-gradient {
		right: 0;
		width: 40px;
		background: linear-gradient(to left, rgba(0, 0, 0, 0.1), transparent);
		top: 0;
		bottom: 0;
		position: absolute;
		pointer-events: none;
	}

	@media (max-width: 768px) {
		.animation-container {
			perspective: 1800px;
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

	@media (min-width: 769px) and (max-width: 1024px) {
		.animation-container {
			perspective: 2200px;
		}
	}

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
