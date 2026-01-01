<script lang="ts">
	/**
	 * Experience Page Component
	 * Work history timeline
	 * Consistent design with dark background and orangish accents
	 */

	import type { ExperienceContent } from '$lib/types/book';

	interface Props {
		data: ExperienceContent;
	}

	let { data }: Props = $props();
</script>

<div class="experience-page">
	<div class="content-wrapper">
		<!-- Timeline -->
		<div class="timeline">
			{#each data.items as exp, index}
				<div class="experience-item animate-[fadeInUp_0.6s_ease-out_{(index * 0.15)}s_backwards]">
					<div class="experience-content">
						<!-- Timeline indicator -->
						<div class="timeline-indicator">
							<div class="indicator-number">{index + 1}</div>
						</div>

						<!-- Content -->
						<div class="experience-info">
							<h3 class="job-title">{exp.title}</h3>
							<p class="company-name">{exp.company}</p>
							<p class="duration">{exp.duration}</p>

							<!-- Technologies -->
							<div class="tech-tags">
								{#each exp.technologies as tech}
									<span class="tech-tag">{tech}</span>
								{/each}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.experience-page {
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
		align-items: flex-start;
		padding: 2rem 0;
	}

	.timeline {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.experience-item {
		background: color-mix(in srgb, var(--color-text-primary) 3%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-accent) 20%, transparent);
		border-radius: 0.75rem;
		padding: 2rem;
		transition: all 0.3s ease;
	}

	.experience-item:hover {
		background: color-mix(in srgb, var(--color-text-primary) 5%, transparent);
		border-color: color-mix(in srgb, var(--color-accent) 40%, transparent);
		transform: translateX(8px);
		box-shadow: 0 8px 24px color-mix(in srgb, var(--color-accent) 15%, transparent);
	}

	.experience-content {
		display: flex;
		align-items: start;
		gap: 1.5rem;
	}

	.timeline-indicator {
		flex-shrink: 0;
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 50%;
		background: var(--color-accent);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 16px color-mix(in srgb, var(--color-accent) 40%, transparent);
	}

	.indicator-number {
		font-size: 1.25rem;
		font-weight: 800;
		color: white;
	}

	.experience-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.job-title {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text-primary);
		line-height: 1.4;
	}

	.company-name {
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-accent);
		line-height: 1.5;
	}

	.duration {
		font-size: 0.875rem;
		font-weight: 600;
		font-family: monospace;
		color: var(--color-text-secondary);
	}

	.tech-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.tech-tag {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--color-text-primary);
		background: color-mix(in srgb, var(--color-accent) 15%, transparent);
		padding: 0.375rem 0.875rem;
		border-radius: 0.5rem;
		border: 1px solid color-mix(in srgb, var(--color-accent) 30%, transparent);
		transition: all 0.2s ease;
	}

	.tech-tag:hover {
		background: color-mix(in srgb, var(--color-accent) 25%, transparent);
		border-color: color-mix(in srgb, var(--color-accent) 50%, transparent);
	}

	@media (max-width: 768px) {
		.experience-page {
			padding: 2rem 1.5rem;
		}

		.experience-content {
			flex-direction: column;
			align-items: center;
			text-align: center;
		}

		.timeline {
			gap: 1.5rem;
		}
	}
</style>
