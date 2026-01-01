<script lang="ts">
	/**
	 * Skills Page Component
	 * Categorized technical skills display
	 * Consistent design with dark background and orangish accents
	 */

	import type { SkillsContent } from '$lib/types/book';

	interface Props {
		data: SkillsContent;
	}

	let { data }: Props = $props();
</script>

<div class="skills-page">
	<div class="content-wrapper">
		<!-- Skills Grid -->
		<div class="skills-grid">
			{#each Object.entries(data.categories) as [category, skills], index}
				<div class="skill-category animate-[fadeInUp_0.6s_ease-out_{(index * 0.1)}s_backwards]">
					<h3 class="category-title">
						<svg class="category-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
						{category}
					</h3>
					<div class="skills-list">
						{#each skills as skill}
							<span class="skill-badge">{skill}</span>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.skills-page {
		height: 100%;
		background: transparent; /* Inherit from BookSpreadView theme */
		padding: 3rem;
		overflow-y: auto;
	}

	.content-wrapper {
		max-width: 900px;
		margin: 0 auto;
		min-height: 100%;
		display: flex;
		align-items: flex-start;
		padding: 2rem 0;
	}

	.skills-grid {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
	}

	.skill-category {
		background: color-mix(in srgb, var(--color-text-primary) 3%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-accent) 20%, transparent);
		border-radius: 0.75rem;
		padding: 1.5rem;
		transition: all 0.3s ease;
	}

	.skill-category:hover {
		background: color-mix(in srgb, var(--color-text-primary) 5%, transparent);
		border-color: color-mix(in srgb, var(--color-accent) 40%, transparent);
		transform: translateY(-4px);
		box-shadow: 0 8px 24px color-mix(in srgb, var(--color-accent) 15%, transparent);
	}

	.category-title {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 1rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-accent);
		margin-bottom: 1rem;
	}

	.category-icon {
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}

	.skills-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.skill-badge {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-primary);
		background: color-mix(in srgb, var(--color-accent) 15%, transparent);
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		border: 1px solid color-mix(in srgb, var(--color-accent) 30%, transparent);
		transition: all 0.2s ease;
	}

	.skill-badge:hover {
		background: color-mix(in srgb, var(--color-accent) 25%, transparent);
		border-color: color-mix(in srgb, var(--color-accent) 50%, transparent);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px color-mix(in srgb, var(--color-accent) 20%, transparent);
	}

	@media (max-width: 768px) {
		.skills-page {
			padding: 2rem 1.5rem;
		}

		.skills-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
	}
</style>
