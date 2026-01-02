<script lang="ts">
	/**
	 * About Page Component
	 * Single page design for book spread
	 * Consistent design with dark background and orangish accents
	 */

	import type { AboutContent } from '$lib/types/book';

	interface Props {
		data: AboutContent;
	}

	let { data }: Props = $props();
</script>

<div class="about-page">
	<div class="content-wrapper">
		<!-- Bio with first-letter styling -->
		<div class="bio-section animate-fadeInUp">
			<p class="bio-text">{data.bio}</p>
		</div>

		<!-- Stats Grid -->
		<div class="stats-grid animate-[fadeInUp_0.6s_ease-out_0.2s_backwards]">
			<div class="stat-card">
				<div class="stat-value">{data.yearsOfExperience}+</div>
				<div class="stat-label">Years Experience</div>
			</div>

			<div class="stat-card">
				<svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
				</svg>
				<div class="stat-label">Location</div>
				<div class="stat-location">{data.location.split(',')[0]}</div>
			</div>

			<div class="stat-card">
				<svg class="stat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
				</svg>
				<div class="stat-label">Status</div>
				<div class="stat-status">Available</div>
			</div>
		</div>

		<!-- Quote -->
		<div class="quote-section animate-[fadeInUp_0.6s_ease-out_0.4s_backwards]">
			<p class="quote-text">
				"Crafting enterprise solutions with precision and passion"
			</p>
		</div>
	</div>
</div>

<style>
	.about-page {
		height: 100%;
		background: transparent; /* Inherit from BookSpreadView theme */
		padding: 3rem;
		overflow-y: auto;
	}

	.content-wrapper {
		max-width: 700px;
		margin: 0 auto;
		min-height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		gap: 2.5rem;
		padding: 2rem 0;
	}

	.bio-section {
		background: color-mix(in srgb, var(--color-text-primary) 3%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-accent) 20%, transparent);
		border-radius: 0.75rem;
		padding: 2rem;
		transition: all 0.3s ease;
	}

	.bio-text {
		font-size: 1.0625rem;
		line-height: 1.8;
		color: var(--color-text-primary);
		text-align: justify;
	}

	.bio-text::first-letter {
		font-size: 3.5rem;
		font-weight: 800;
		color: var(--color-accent);
		float: left;
		line-height: 1;
		margin-right: 0.5rem;
		margin-top: 0.25rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
	}

	.stat-card {
		background: color-mix(in srgb, var(--color-text-primary) 3%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-accent) 20%, transparent);
		border-radius: 0.75rem;
		padding: 1.5rem;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		transition: all 0.3s ease;
	}

	.stat-card:hover {
		background: color-mix(in srgb, var(--color-text-primary) 5%, transparent);
		border-color: color-mix(in srgb, var(--color-accent) 40%, transparent);
		transform: translateY(-4px);
		box-shadow: 0 8px 24px color-mix(in srgb, var(--color-accent) 15%, transparent);
	}

	.stat-value {
		font-size: 2.5rem;
		font-weight: 800;
		color: var(--color-accent);
	}

	.stat-icon {
		width: 2.5rem;
		height: 2.5rem;
		color: var(--color-accent);
	}

	.stat-label {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-secondary);
	}

	.stat-location,
	.stat-status {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.quote-section {
		position: relative;
		padding-left: 1.5rem;
		border-left: 4px solid var(--color-accent);
	}

	.quote-text {
		font-size: 1.125rem;
		font-style: italic;
		line-height: 1.8;
		color: var(--color-text-primary);
	}

	@media (max-width: 768px) {
		.about-page {
			padding: 2rem 1.5rem;
		}

		.stats-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.content-wrapper {
			gap: 2rem;
		}
	}
</style>
