<script lang="ts">
	/**
	 * ClosedBookView Component
	 * Initial closed book state with 3D tilt
	 * Shows only the cover, user can scroll or click to open
	 *
	 * Following Svelte 5 runes best practices
	 */

	import type { CoverContent } from '$lib/types/book';

	interface Props {
		coverData: CoverContent;
		onOpen?: () => void;
	}

	let { coverData, onOpen }: Props = $props();

	let isHovered = $state(false);

	function handleClick() {
		onOpen?.();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onOpen?.();
		}
	}
</script>

<div class="closed-book-container">
	<!-- Instructions -->
	<div class="instructions">
		<p class="instruction-text animate-fadeInUp">
			Scroll down or click to open the book
		</p>
		<svg class="instruction-icon animate-[fadeInUp_0.6s_ease-out_0.3s_backwards]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
		</svg>
	</div>

	<!-- Closed 3D Book -->
	<button
		class="closed-book"
		class:hovered={isHovered}
		onclick={handleClick}
		onkeydown={handleKeydown}
		onmouseenter={() => isHovered = true}
		onmouseleave={() => isHovered = false}
		aria-label="Open portfolio book"
	>
		<!-- Book spine (left edge) -->
		<div class="book-spine-edge"></div>

		<!-- Book cover with front and back -->
		<div class="book-cover">
			<!-- Front of cover -->
			<div class="cover-front">
				<!-- Cover gradient background -->
				<div class="cover-gradient"></div>

				<!-- Cover content -->
				<div class="cover-content">
				<!-- Decorative top -->
				<div class="cover-decoration">
					<div class="decoration-line"></div>
					<div class="decoration-dot"></div>
					<div class="decoration-line"></div>
				</div>

				<!-- Main content -->
				<div class="cover-main">
					<h1 class="cover-name">{coverData.name}</h1>
					<div class="cover-divider"></div>
					<p class="cover-title">{coverData.title}</p>
					<p class="cover-tagline">{coverData.tagline}</p>
				</div>

				<!-- Decorative bottom -->
				<div class="cover-decoration">
					<div class="decoration-line"></div>
					<div class="decoration-dot"></div>
					<div class="decoration-line"></div>
				</div>
			</div>

			<!-- Shine effect on hover -->
			<div class="cover-shine"></div>
			</div>

			<!-- Back/inside of cover (visible when flipped) -->
			<div class="cover-back">
				<div class="cover-back-gradient"></div>
			</div>
		</div>

		<!-- Book pages stack (right edge) -->
		<div class="book-pages-edge"></div>
	</button>
</div>

<style>
	.closed-book-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		perspective: 2000px;
		perspective-origin: center 40%; /* Slightly towards top for better viewing angle */
		/* Light Mode: Clean light background */
		background: linear-gradient(135deg, #FBFBFA 0%, #f0f0f5 100%);
		position: relative;
		overflow: hidden;
	}

	:global(.dark) .closed-book-container {
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

	.instructions {
		position: absolute;
		top: 3rem;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		z-index: 100;
	}

	.instruction-text {
		color: rgba(40, 50, 60, 0.9);
		font-size: 1.125rem;
		font-weight: 500;
		margin-bottom: 0.75rem;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	:global(.dark) .instruction-text {
		color: rgba(255, 215, 150, 0.95);
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	.instruction-icon {
		width: 2rem;
		height: 2rem;
		color: rgba(40, 50, 60, 0.8);
		margin: 0 auto;
		animation: bounce 2s infinite;
	}

	:global(.dark) .instruction-icon {
		color: rgba(255, 215, 150, 0.95);
	}

	@keyframes bounce {
		0%, 100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(10px);
		}
	}

	.closed-book {
		position: relative;
		width: clamp(300px, 50vw, 500px);
		height: clamp(400px, 65vh, 700px);
		transform-style: preserve-3d;
		transform: rotateY(-25deg) rotateX(5deg);
		will-change: transform, filter;
		transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease;
		cursor: pointer;
		border: none;
		background: transparent;
		padding: 0;
		filter: drop-shadow(0 30px 60px rgba(0, 0, 0, 0.5));
	}

	.closed-book:hover,
	.closed-book.hovered {
		transform: rotateY(-20deg) rotateX(3deg) translateY(-10px);
		filter: drop-shadow(0 35px 70px rgba(0, 0, 0, 0.6));
	}

	.closed-book:focus-visible {
		outline: 3px solid rgba(255, 255, 255, 0.5);
		outline-offset: 8px;
		border-radius: 1rem;
	}

	/* Book spine (left edge) */
	.book-spine-edge {
		position: absolute;
		left: 0;
		top: 0;
		width: 60px;
		height: 100%;
		background: linear-gradient(
			to right,
			rgba(15, 35, 25, 0.9),
			rgba(20, 40, 30, 0.7),
			rgba(18, 38, 28, 0.8)
		);
		border-radius: 1rem 0 0 1rem;
		transform: translateZ(-30px) rotateY(-90deg);
		transform-origin: right center;
	}

	/* Book cover */
	.book-cover {
		position: relative;
		width: 100%;
		height: 100%;
		transform: translateZ(0);
		transform-style: preserve-3d;
		transform-origin: left center; /* Rotate from spine/left edge */
		will-change: transform;
	}

	/* Front of cover */
	.cover-front {
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 0 1rem 1rem 0;
		overflow: hidden;
		backface-visibility: hidden;
		border: 1px solid rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(30px) saturate(150%);
		-webkit-backdrop-filter: blur(30px) saturate(150%);
	}

	:global(.dark) .cover-front {
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	/* Back/inside of cover */
	.cover-back {
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 1rem 0 0 1rem; /* Flipped radius */
		overflow: hidden;
		backface-visibility: hidden;
		transform: rotateY(180deg); /* Flipped to back */
		border: 1px solid rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(30px) saturate(150%);
		-webkit-backdrop-filter: blur(30px) saturate(150%);
	}

	:global(.dark) .cover-back {
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.cover-back-gradient {
		position: absolute;
		inset: 0;
		/* Rich dark blue-gray gradient that works on both light and dark backgrounds */
		background: linear-gradient(135deg, rgba(25, 30, 40, 0.95) 0%, rgba(30, 35, 45, 0.95) 30%, rgba(35, 40, 55, 0.95) 60%, rgba(25, 30, 40, 0.95) 100%);
	}

	.cover-gradient {
		position: absolute;
		inset: 0;
		/* Rich dark forest green gradient for light mode */
		background: linear-gradient(135deg,
			rgba(20, 45, 35, 0.98) 0%,
			rgba(25, 55, 40, 0.98) 30%,
			rgba(30, 60, 45, 0.98) 60%,
			rgba(20, 45, 35, 0.98) 100%
		);
		/* Add noise texture for realism */
	}

	.cover-gradient::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image: url('https://grainy-gradients.vercel.app/noise.svg');
		opacity: 0.03;
		pointer-events: none;
	}

	.cover-content {
		position: relative;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 3rem 2rem;
		z-index: 1;
	}

	.cover-decoration {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.decoration-line {
		height: 2px;
		width: 4rem;
		background: linear-gradient(to right, transparent, rgba(255, 215, 150, 0.85), transparent);
	}

	.decoration-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: rgba(255, 215, 150, 0.9);
		box-shadow: 0 0 8px rgba(255, 215, 150, 0.4);
	}

	.cover-main {
		text-align: center;
	}

	.cover-name {
		font-size: clamp(2.5rem, 5vw, 4rem);
		font-weight: 800;
		line-height: 1.1;
		color: rgba(255, 255, 255, 0.98);
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
		margin-bottom: 1rem;
	}

	.cover-divider {
		width: 6rem;
		height: 3px;
		background: linear-gradient(to right, transparent, rgba(255, 215, 150, 0.9), transparent);
		margin: 1.5rem auto;
	}

	.cover-title {
		font-size: clamp(1.25rem, 2.5vw, 1.75rem);
		font-weight: 600;
		color: rgba(255, 215, 150, 0.95);
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
		margin-bottom: 1rem;
	}

	.cover-tagline {
		font-size: clamp(1rem, 2vw, 1.25rem);
		font-weight: 400;
		color: rgba(230, 235, 240, 0.9);
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
		font-style: italic;
		line-height: 1.5;
	}

	/* Shine effect */
	.cover-shine {
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: linear-gradient(
			45deg,
			transparent 30%,
			rgba(255, 255, 255, 0.1) 50%,
			transparent 70%
		);
		transform: translateX(-100%);
		transition: transform 0.6s ease;
	}

	.closed-book:hover .cover-shine,
	.closed-book.hovered .cover-shine {
		transform: translateX(100%);
	}

	/* Book pages edge (right side) */
	.book-pages-edge {
		position: absolute;
		right: 0;
		top: 2px;
		width: 30px;
		height: 99.5%;
		background: linear-gradient(
			to right,
			rgba(1, 18, 5, 0.7),
			rgba(190, 193, 191, 0.8),
			rgba(1, 18, 1, 0.7)
		);
		border-radius: 0 1rem 1rem 0;
		transform: translateZ(-15px) translateX(0px);
		box-shadow: inset -2px 0 4px rgba(0, 0, 0, 0.2);
	}

	/* Mobile responsive */
	@media (max-width: 768px) {
		.closed-book {
			transform: rotateY(-15deg) rotateX(3deg);
		}

		.closed-book:hover,
		.closed-book.hovered {
			transform: rotateY(-10deg) rotateX(2deg) translateY(-5px);
		}

		.instructions {
			top: 2rem;
		}

		.instruction-text {
			font-size: 1rem;
		}
	}
</style>
