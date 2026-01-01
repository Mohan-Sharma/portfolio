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
		background: linear-gradient(135deg, #16213e 0%, #1a1a2e 50%, #0f0f23 100%);
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
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(226, 125, 96, 0.2);
		border-radius: 0.75rem;
		padding: 2rem;
		transition: all 0.3s ease;
	}

	.experience-item:hover {
		background: rgba(255, 255, 255, 0.05);
		border-color: rgba(226, 125, 96, 0.4);
		transform: translateX(8px);
		box-shadow: 0 8px 24px rgba(226, 125, 96, 0.15);
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
		background: linear-gradient(135deg, #e27d60, #a64b35);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 16px rgba(226, 125, 96, 0.4);
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
		color: #e6e9ef;
		line-height: 1.4;
	}

	.company-name {
		font-size: 1rem;
		font-weight: 600;
		color: #e27d60;
		line-height: 1.5;
	}

	.duration {
		font-size: 0.875rem;
		font-weight: 600;
		font-family: monospace;
		color: rgba(230, 233, 239, 0.7);
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
		color: #e6e9ef;
		background: rgba(226, 125, 96, 0.15);
		padding: 0.375rem 0.875rem;
		border-radius: 0.5rem;
		border: 1px solid rgba(226, 125, 96, 0.3);
		transition: all 0.2s ease;
	}

	.tech-tag:hover {
		background: rgba(226, 125, 96, 0.25);
		border-color: rgba(226, 125, 96, 0.5);
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
