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
	let isAnimationComplete = $state(false);

	onMount(() => {
		startOpeningAnimation();
	});

	async function startOpeningAnimation() {
		if (!animationContainer) return;

		const timeline = gsap.timeline({
			onComplete: () => {
				isAnimationComplete = true;
				onComplete?.();
			}
		});

		const bookContainer = animationContainer.querySelector('.animation-book');
		const flipper = animationContainer.querySelector('.book-flipper');
		const rightPage = animationContainer.querySelector('.book-right-page');
		const frontFace = animationContainer.querySelector('.flipper-front');
		const backFace = animationContainer.querySelector('.flipper-back');

		if (!bookContainer || !flipper || !rightPage || !frontFace || !backFace) return;

		// --- PRE-CALC VALUES ---
		// We need to match ClosedBookView dimensions exactly.
		// ClosedBookView uses: clamp(300px, 50vw, 500px) width.
		// We use the same here.
		const closedWidthStr = 'clamp(300px, 50vw, 500px)';
		const closedHeightStr = 'clamp(400px, 65vh, 700px)';
		
		// Open dimensions
		const openPageWidth = '45vw'; 
		const openPageHeight = '85vh';

		// --- INITIAL STATE ---
		
		// 1. Dimensions
		gsap.set([flipper, rightPage], {
			width: closedWidthStr,
			height: closedHeightStr
		});

		// 2. Container Posture (Closed Book Match)
		// CRITICAL FIX: The ClosedBookView centers the COVER.
		// Our Hinge Model centers the SPINE.
		// Since the Cover is to the RIGHT of the Spine (left:0), we must shift the container LEFT to match.
		// We use xPercent: -50 on the ELEMENTS (flipper/rightPage) to center them? No.
		// We shift the container. Since container is 0-width, we need pixel/percent offset relative to the Cover width.
		// Since CSS clamp is hard to calculate in JS without layout, we rely on the visual assumption:
		// We will animate 'x' from "-50%" (of the book width) to "0%".
		// GSAP can handle simple units, but clamp is tricky.
		// Let's rely on a calculated pixel value from getBoundingClientRect after setting width?
		// No, let's just use a visual approximation or 'transform: translateX(-50%)' on the wrapper if valid.
		
		// Better Strategy: Set the specific 'x' offset.
		// Assuming ~400px width, offset is -200px.
		// Let's trust accurate pixel matching:
		gsap.set(bookContainer, {
			rotationX: 5,
			rotationY: -25,
			y: 0,
			z: 0,
			x: -200 // Approx half of 400px default. 
            // Note: Ideally we measure this, but for the animation start, -200 provides a good "Centered Cover" guess.
		});

		gsap.set(flipper, { rotationY: 0 });
		
		// 3. Flicker Fix: Ensure Backface Hidden & slight Z-offset
		// We ensure the faces are just slightly separated to avoid fighting
		gsap.set(frontFace, { z: 1 }); // Front bumps forward 1px
		gsap.set(backFace, { z: -1 }); // Back bumps back 1px
		
		// 4. Content Hidden
		gsap.set(backFace.querySelector('.page-content-wrapper'), { opacity: 0 });
		gsap.set(rightPage.querySelector('.page-content-wrapper'), { opacity: 0 });
		

		// --- PHASE 1: CENTER (Presentation) ---
		// Move UP, straighten rotations.
		// KEEP x: -200 (Keep Cover Centered).
		timeline.to(bookContainer, {
			rotationY: 0,
			rotationX: 0,
			y: -30,
			duration: 1.0,
			ease: 'power3.out'
		});

		// --- PHASE 2: BREATHE ---
		timeline.to(bookContainer, {
			scale: 1.03,
			duration: 0.25,
			ease: 'sine.inOut',
			yoyo: true,
			repeat: 1
		});

		// --- PHASE 3: OPEN (Slide + Flip) ---
		// The "Book Opening" Mechanic:
		// 1. Cover Centers itself? No, the *Spread* centers itself.
		//    So 'x' moves from -200 (Cover Centered) to 0 (Spine Centered).
		// 2. Flipper rotates -180.
		// 3. Pages Expand.
		
		timeline.to(
			bookContainer,
			{
				x: 0, // Slide spine to center
				duration: 1.4,
				ease: 'power2.inOut'
			},
			'open'
		);

		timeline.to(
			[flipper, rightPage],
			{
				width: openPageWidth,
				maxWidth: '850px',
				minWidth: '400px', // Don't shrink below closed size
				height: openPageHeight,
				maxHeight: '1000px',
				minHeight: '700px',
				duration: 1.4,
				ease: 'power2.inOut'
			},
			'open'
		);

		// 3b. Flip (0 -> -180)
		// This naturally hides Cover and reveals Left Page (Back Face)
		timeline.to(
			flipper,
			{
				rotationY: -180,
				duration: 1.4,
				ease: 'power2.inOut'
			},
			'open'
		);
		
		// 3c. Reveal Page Content
		// FIX: Don't wait! Reveal content immediately as it flips so the user sees the page, not white void.
		// We use 'open+=0.2' to give it a tiny moment, but mostly visible.
		timeline.to(
			[backFace.querySelector('.page-content-wrapper'), rightPage.querySelector('.page-content-wrapper')],
			{
				opacity: 1,
				duration: 0.5,
				ease: 'power1.out',
				stagger: 0.1
			},
			'open+=0.1' 
		);

		// --- PHASE 4: LANDING ---
		timeline.to(
			bookContainer,
			{
				rotationX: 0, // Flat for reading
				y: 0,
				scale: 1,
				duration: 1.0,
				ease: 'power2.out'
			},
			'-=0.5'
		);
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
		<div class="animation-spine"></div>

	</div>
</div>

<style>
	.animation-container {
		position: fixed;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		perspective: 2500px; /* Strong perspective for 3D feel */
		perspective-origin: center 50%;
		z-index: 1000;
	}

	:global(.dark) .animation-container {
		background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
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
	}

	/* Common Page Styles */
	.book-right-page,
	.book-flipper {
		position: absolute;
		top: 50%; /* Center Vertical */
		transform: translateY(-50%);
		background: #fff;
		box-shadow: 0 4px 6px rgba(0,0,0,0.1);
	}

	:global(.dark) .book-right-page, 
	:global(.dark) .book-flipper .flipper-back {
		background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
	}

	/* RIGHT PAGE: Anchored LEFT (Spine), Grows RIGHT */
	.book-right-page {
		left: 0; /* Attach left edge to center spine */
		transform-origin: left center;
		border-radius: 0 1rem 1rem 0;
		z-index: 1; /* Below flipper initially */
	}

	/* FLIPPER: Anchored RIGHT (Spine), Grows LEFT (Because of flip?) */
	/* Wait, in Closed state, Cover sits ON TOP of Right Page. */
	/* So Flipper should ALSO be Anchored Left and sit exactly on top of Right Page. */
	/* When it opens (rotates -180), it swings Left. */
	.book-flipper {
		left: 0; /* Attach left edge to center spine */
		transform-origin: left center; /* Hinge is on the Left (Spine) */
		transform-style: preserve-3d;
		z-index: 2; /* On top */
		border-radius: 0 1rem 1rem 0; /* Matches Right Page when closed */
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
		background: linear-gradient(135deg, #fff 0%, #f8fafc 100%);
		border-radius: 0 1rem 1rem 0;
	}
	
	:global(.dark) .flipper-front {
		background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
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
		background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
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
		border: 2px solid rgba(0,0,0,0.1);
		border-left: none; /* Spine side */
	}

	/* Copy Cover Styles for fidelity... */
	.cover-name { font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; color: #1c1c1e; text-align: center; }
	:global(.dark) .cover-name { color: #e6e9ef; }
	.cover-title { font-size: clamp(1rem, 2vw, 1.5rem); font-weight: 600; color: #a64b35; text-align: center; }
	:global(.dark) .cover-title { color: #e27d60; }
	.cover-tagline { font-size: 0.875rem; color: #636366; text-align: center; font-style: italic; }
	:global(.dark) .cover-tagline { color: #8e8e93; }
	
	.cover-divider {
		width: 5rem; height: 3px; background: linear-gradient(to right, transparent, #a64b35, transparent); margin: 1rem auto;
	}
	:global(.dark) .cover-divider { background: linear-gradient(to right, transparent, #e27d60, transparent); }
	
	.decoration-line { height: 2px; width: 3rem; background: linear-gradient(to right, transparent, #a64b35, transparent); }
	:global(.dark) .decoration-line { background: linear-gradient(to right, transparent, #e27d60, transparent); }
	.decoration-dot { width: 6px; height: 6px; border-radius: 50%; background: #a64b35; }
	:global(.dark) .decoration-dot { background: #e27d60; }
	.cover-decoration { display: flex; align-items: center; justify-content: center; gap: 1rem; }

	/* Spine Visual */
	.animation-spine {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 40px;
		height: clamp(400px, 65vh, 700px); /* Initial height */
		background: linear-gradient(90deg, rgba(0,0,0,0.4), rgba(0,0,0,0.6), rgba(0,0,0,0.4));
		z-index: 0;
		opacity: 0; /* Fade in when opening */
	}

	/* Gradients */
	.right-gradient { left: 0; width: 40px; background: linear-gradient(to right, rgba(0,0,0,0.1), transparent); top:0; bottom:0; position: absolute; pointer-events: none;}
	.left-gradient { right: 0; width: 40px; background: linear-gradient(to left, rgba(0,0,0,0.1), transparent); top:0; bottom:0; position: absolute; pointer-events: none; }

</style>
