<script lang="ts">
	/**
	 * Cover Page Component
	 * Single page design for book spread
	 */

	import type { CoverContent } from '$lib/types/book';

	interface Props {
		data: CoverContent;
	}

	let { data }: Props = $props();
</script>

<div class="cover-page">
	<!-- Embossed Pattern Background -->
	<div class="pattern-bg">
		<svg class="pattern-svg" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
					<circle cx="20" cy="20" r="1" fill="white"/>
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#grid)"/>
		</svg>
	</div>

	<!-- Content Area -->
	<div class="content-container">
		<!-- Top: Publisher Mark -->
		<div class="publisher-mark animate-fadeInUp">
			<span class="portfolio-year">
				Portfolio 2025
			</span>
			<div class="initial-badge">
				<span class="initial-letter">{data.name.charAt(0)}</span>
			</div>
		</div>

		<!-- Center: Title Block -->
		<div class="title-block">
			<!-- Main Title with Shadow -->
			<h1 class="main-title animate-[fadeInUp_0.6s_ease-out_0.2s_backwards]">
				{data.name}
			</h1>

			<!-- Decorative Line -->
			<div class="decorative-line animate-[fadeInUp_0.6s_ease-out_0.4s_backwards]">
				<div class="line"></div>
				<div class="dot"></div>
				<div class="line"></div>
			</div>

			<!-- Subtitle -->
			<h2 class="subtitle animate-[fadeInUp_0.6s_ease-out_0.5s_backwards]">
				{data.title}
			</h2>
		</div>

		<!-- Bottom: Tagline & Edition -->
		<div class="bottom-info">
			<p class="tagline animate-[fadeInUp_0.6s_ease-out_0.6s_backwards]">
				"{data.tagline}"
			</p>
			<div class="edition-info animate-[fadeInUp_0.6s_ease-out_0.7s_backwards]">
				Digital Edition · Interactive Experience
			</div>
		</div>
	</div>
</div>

<style>
	.cover-page {
		height: 100%;
		/* Rich dark blue-gray gradient matching other covers with subtle radial overlay */
		background:
			radial-gradient(circle at 30% 20%, rgba(51, 65, 85, 0.4) 0%, transparent 50%),
			radial-gradient(circle at 70% 80%, rgba(30, 41, 59, 0.4) 0%, transparent 50%),
			linear-gradient(135deg,
				rgba(30, 41, 59, 0.98) 0%,
				rgba(51, 65, 85, 0.98) 50%,
				rgba(30, 41, 59, 0.98) 100%
			);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 3rem 2rem;
		position: relative;
		overflow: hidden;
	}

	.pattern-bg {
		position: absolute;
		inset: 0;
		opacity: 0.05;
	}

	.pattern-svg {
		width: 100%;
		height: 100%;
	}

	.content-container {
		position: relative;
		z-index: 10;
		width: 100%;
		max-width: 48rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 3rem;
	}

	.publisher-mark {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.portfolio-year {
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.3em;
		font-family: monospace;
		font-weight: 600;
	}

	.initial-badge {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		border: 2px solid rgba(255, 255, 255, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.initial-letter {
		color: rgba(255, 255, 255, 0.9);
		font-weight: 700;
		font-size: 1.5rem;
	}

	.title-block {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		text-align: center;
		width: 100%;
	}

	.main-title {
		font-size: clamp(3rem, 8vw, 4.5rem);
		font-weight: 800;
		color: rgba(255, 255, 255, 0.95);
		line-height: 1;
		letter-spacing: -0.02em;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	.decorative-line {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.line {
		height: 1px;
		width: 4rem;
		background: rgba(255, 255, 255, 0.6);
	}

	.dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.8);
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.subtitle {
		font-size: clamp(1.25rem, 3vw, 1.5rem);
		color: rgba(255, 255, 255, 0.85);
		font-weight: 300;
		letter-spacing: 0.1em;
	}

	.bottom-info {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
	}

	.tagline {
		color: rgba(255, 255, 255, 0.7);
		font-size: clamp(0.875rem, 2vw, 1rem);
		font-style: italic;
		text-align: center;
		line-height: 1.6;
	}

	.edition-info {
		text-align: center;
		color: rgba(255, 255, 255, 0.6);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		font-family: monospace;
		font-weight: 500;
	}

	@media (max-width: 768px) {
		.cover-page {
			padding: 2rem 1.5rem;
		}

		.content-container {
			gap: 2rem;
		}
	}
</style>
