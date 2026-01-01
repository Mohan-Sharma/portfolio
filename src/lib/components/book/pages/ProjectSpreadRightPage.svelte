<script lang="ts">
	/**
	 * ProjectSpreadRightPage - Project Details
	 * Consistent design with dark background and orangish accents
	 */

	import type { ProjectSpreadRightContent } from '$lib/types/book';

	interface Props {
		data: ProjectSpreadRightContent;
	}

	let { data }: Props = $props();
</script>

<div class="project-right-page">
	<div class="content-wrapper">
		<!-- Description -->
		<div class="section animate-fadeInUp">
			<h3 class="section-title">
				<svg class="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
				</svg>
				Overview
			</h3>
			<p class="description">{data.description}</p>
		</div>

		<!-- Tech Stack -->
		<div class="section animate-[fadeInUp_0.6s_ease-out_0.2s_backwards]">
			<h3 class="section-title">
				<svg class="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
				</svg>
				Technology Stack
			</h3>
			<div class="tech-stack">
				{#each data.techStack as tech}
					<span class="tech-badge">{tech}</span>
				{/each}
			</div>
		</div>

		<!-- Highlights -->
		{#if data.highlights && data.highlights.length > 0}
			<div class="section animate-[fadeInUp_0.6s_ease-out_0.4s_backwards]">
				<h3 class="section-title">
					<svg class="section-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					Key Achievements
				</h3>
				<ul class="highlights-list">
					{#each data.highlights as highlight}
						<li class="highlight-item">
							<div class="highlight-dot"></div>
							<span>{highlight}</span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
</div>

<style>
	.project-right-page {
		height: 100%;
		background: linear-gradient(135deg, #16213e 0%, #1a1a2e 50%, #0f0f23 100%);
		padding: 3rem;
		overflow-y: auto;
	}

	.content-wrapper {
		max-width: 650px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.section-title {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.875rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #e27d60;
	}

	.section-icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	.description {
		font-size: 1rem;
		line-height: 1.8;
		color: rgba(230, 233, 239, 0.9);
	}

	.tech-stack {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.tech-badge {
		font-size: 0.875rem;
		font-weight: 600;
		color: #e6e9ef;
		background: rgba(226, 125, 96, 0.15);
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		border: 1px solid rgba(226, 125, 96, 0.3);
		transition: all 0.2s ease;
	}

	.tech-badge:hover {
		background: rgba(226, 125, 96, 0.25);
		border-color: rgba(226, 125, 96, 0.5);
	}

	.highlights-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.highlight-item {
		display: flex;
		align-items: start;
		gap: 1rem;
		font-size: 0.9375rem;
		line-height: 1.7;
		color: rgba(230, 233, 239, 0.85);
	}

	.highlight-dot {
		flex-shrink: 0;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #e27d60;
		margin-top: 0.5rem;
		box-shadow: 0 0 8px rgba(226, 125, 96, 0.4);
	}

	@media (max-width: 768px) {
		.project-right-page {
			padding: 2rem 1.5rem;
		}

		.content-wrapper {
			gap: 2rem;
		}
	}
</style>
