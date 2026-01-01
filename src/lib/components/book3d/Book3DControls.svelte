<script lang="ts">
	/**
	 * Book3DControls Component
	 * Navigation controls with pulsing/popping animations
	 * Responsive button indicators for page navigation
	 *
	 * @component
	 */

	import gsap from 'gsap';

	interface Props {
		currentPage: number;
		totalPages: number;
		canGoBack: boolean;
		canGoForward: boolean;
		onPrevious: () => void;
		onNext: () => void;
	}

	let {
		currentPage,
		totalPages,
		canGoBack,
		canGoForward,
		onPrevious,
		onNext
	}: Props = $props();

	let prevButton: HTMLButtonElement;
	let nextButton: HTMLButtonElement;

	// Pulsing animation for buttons
	$effect(() => {
		if (nextButton && canGoForward) {
			// Create pulsing animation for next button
			gsap.to(nextButton, {
				scale: 1.1,
				duration: 0.6,
				repeat: -1,
				yoyo: true,
				ease: 'power1.inOut'
			});
		}

		return () => {
			// Cleanup animations
			gsap.killTweensOf(nextButton);
			gsap.killTweensOf(prevButton);
		};
	});

	/**
	 * Handle button click with pop animation
	 */
	function handlePreviousClick() {
		if (!canGoBack) return;

		// Pop animation
		gsap.timeline()
			.to(prevButton, {
				scale: 0.9,
				duration: 0.1,
				ease: 'power2.out'
			})
			.to(prevButton, {
				scale: 1,
				duration: 0.2,
				ease: 'elastic.out(1, 0.3)'
			});

		onPrevious();
	}

	function handleNextClick() {
		if (!canGoForward) return;

		// Pop animation
		gsap.timeline()
			.to(nextButton, {
				scale: 0.9,
				duration: 0.1,
				ease: 'power2.out'
			})
			.to(nextButton, {
				scale: 1,
				duration: 0.2,
				ease: 'elastic.out(1, 0.3)'
			});

		onNext();
	}
</script>

<!-- Navigation Controls with Glassmorphism -->
<div class="book-controls">
	<div class="controls-container">
		<button
			bind:this={prevButton}
			class="nav-button prev-button"
			class:disabled={!canGoBack}
			disabled={!canGoBack}
			onclick={handlePreviousClick}
			aria-label="Previous page"
		>
			<svg
				class="icon"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M15 19l-7-7 7-7"
				></path>
			</svg>
			<span class="label">Previous</span>
		</button>

		<div class="page-indicator">
			<span class="page-number">{currentPage + 1}</span>
			<span class="separator">/</span>
			<span class="total-pages">{totalPages}</span>
		</div>

		<button
			bind:this={nextButton}
			class="nav-button next-button"
			class:disabled={!canGoForward}
			class:pulse={canGoForward}
			disabled={!canGoForward}
			onclick={handleNextClick}
			aria-label="Next page"
		>
			<span class="label">Next</span>
			<svg
				class="icon"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 5l7 7-7 7"
				></path>
			</svg>
		</button>
	</div>

	<!-- Scroll Hint (appears on first page) -->
	{#if currentPage === 0}
		<div class="scroll-hint">
			<div class="hint-text">Scroll or click Next</div>
			<svg
				class="hint-arrow"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M19 14l-7 7m0 0l-7-7m7 7V3"
				></path>
			</svg>
		</div>
	{/if}
</div>

<style>
	.book-controls {
		position: fixed;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 50;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.controls-container {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 0.75rem 1.5rem;
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border-radius: 9999px;
		border: 1px solid rgba(255, 255, 255, 0.2);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
	}

	:global(.dark) .controls-container {
		background: rgba(0, 0, 0, 0.5);
		border-color: rgba(255, 255, 255, 0.1);
	}

	.nav-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: rgba(255, 255, 255, 0.2);
		border: none;
		border-radius: 9999px;
		color: #1a1a1a;
		font-weight: 500;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.3s ease;
		user-select: none;
	}

	:global(.dark) .nav-button {
		background: rgba(255, 255, 255, 0.1);
		color: #f8f8f8;
	}

	.nav-button:hover:not(.disabled) {
		background: rgba(255, 255, 255, 0.3);
		transform: translateY(-2px);
	}

	:global(.dark) .nav-button:hover:not(.disabled) {
		background: rgba(255, 255, 255, 0.2);
	}

	.nav-button.disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.nav-button .icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	.nav-button .label {
		font-size: 0.875rem;
	}

	.page-indicator {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		font-weight: 600;
		font-size: 0.875rem;
		color: #1a1a1a;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 9999px;
		min-width: 100px;
		justify-content: center;
	}

	:global(.dark) .page-indicator {
		color: #f8f8f8;
		background: rgba(255, 255, 255, 0.15);
	}

	.page-number {
		font-size: 1rem;
	}

	.separator {
		opacity: 0.5;
	}

	.total-pages {
		opacity: 0.7;
	}

	.scroll-hint {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		animation: bounce 2s infinite;
		opacity: 0.7;
	}

	.hint-text {
		font-size: 0.75rem;
		font-weight: 500;
		color: #1a1a1a;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	:global(.dark) .hint-text {
		color: #f8f8f8;
	}

	.hint-arrow {
		width: 1.5rem;
		height: 1.5rem;
		color: #1a1a1a;
	}

	:global(.dark) .hint-arrow {
		color: #f8f8f8;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	/* Mobile Responsive */
	@media (max-width: 768px) {
		.controls-container {
			gap: 1rem;
			padding: 0.5rem 1rem;
		}

		.nav-button .label {
			display: none;
		}

		.nav-button {
			padding: 0.5rem;
		}

		.page-indicator {
			min-width: 80px;
			padding: 0.5rem 0.75rem;
		}
	}
</style>
