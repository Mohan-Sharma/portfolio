<script lang="ts">
	/**
	 * ProjectsIntroPage - Projects Overview
	 * Shows intro and list of all projects with one-liners
	 * Consistent design with dark background and orangish accents
	 */

	import type { ProjectsIntroContent } from '$lib/types/book';

	interface Props {
		data: ProjectsIntroContent;
	}

	let { data }: Props = $props();
</script>

<div class="projects-intro-page">
	<div class="content-wrapper">
		<!-- Intro text -->
		<p class="intro-text animate-fadeInUp">
			{data.intro}
		</p>

		<!-- Projects grid -->
		<div class="projects-grid">
			{#each data.projects as project, index}
				<div class="project-card animate-[fadeInUp_0.6s_ease-out_{(index * 0.1)}s_backwards]">
					<h3 class="project-title">{project.title}</h3>
					<p class="project-oneliner">{project.oneLiner}</p>
					{#if project.tags && project.tags.length > 0}
						<div class="project-tags">
							{#each project.tags.slice(0, 3) as tag}
								<span class="tag">#{tag}</span>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.projects-intro-page {
		height: 100%;
		background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
		padding: 3rem;
		overflow-y: auto;
	}

	.content-wrapper {
		max-width: 900px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.intro-text {
		font-size: 1.125rem;
		line-height: 1.8;
		color: rgba(230, 233, 239, 0.9);
		text-align: center;
		font-style: italic;
		padding-bottom: 1rem;
		border-bottom: 2px solid rgba(226, 125, 96, 0.2);
	}

	.projects-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.project-card {
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(226, 125, 96, 0.2);
		border-radius: 0.75rem;
		padding: 1.5rem;
		transition: all 0.3s ease;
		cursor: pointer;
	}

	.project-card:hover {
		background: rgba(255, 255, 255, 0.05);
		border-color: rgba(226, 125, 96, 0.4);
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(226, 125, 96, 0.15);
	}

	.project-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: #e6e9ef;
		margin-bottom: 0.5rem;
	}

	.project-oneliner {
		font-size: 0.875rem;
		line-height: 1.6;
		color: rgba(230, 233, 239, 0.7);
		margin-bottom: 1rem;
	}

	.project-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.tag {
		font-size: 0.75rem;
		font-weight: 600;
		color: #e27d60;
		background: rgba(226, 125, 96, 0.1);
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		border: 1px solid rgba(226, 125, 96, 0.3);
	}

	@media (max-width: 768px) {
		.projects-intro-page {
			padding: 2rem 1.5rem;
		}

		.projects-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
