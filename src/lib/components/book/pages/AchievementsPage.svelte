<script lang="ts">
	/**
	 * Achievements Page Component
	 * Awards, certifications, and recognition
	 */

	import type { Achievement } from '$lib/schemas/cv.schema';
	import { Card, Badge } from '$lib/components/ui';

	interface Props {
		data: { items: Achievement[] };
	}

	let { data }: Props = $props();

	// Group achievements by category
	const groupedAchievements = $derived(() => {
		const grouped: Record<string, Achievement[]> = {};
		data.items.forEach((achievement) => {
			const category = achievement.category || 'Other';
			if (!grouped[category]) {
				grouped[category] = [];
			}
			grouped[category].push(achievement);
		});
		return grouped;
	});
</script>

<div class="achievements-page">
	<div class="content-wrapper">
		<!-- Header -->
		<div class="page-header">
			<div class="chapter-label">Chapter Six</div>
			<h2 class="page-title">Achievements</h2>
			<div class="divider"></div>
		</div>

		<!-- Achievements by Category -->
		{#each Object.entries(groupedAchievements()) as [category, achievements], catIndex}
			<div class="category-section animate-[fadeInUp_0.6s_ease-out_{(catIndex * 0.1)}s_backwards]">
				<h3 class="category-title">
					<span class="category-dot"></span>
					{category}
				</h3>

				<div class="achievements-grid">
					{#each achievements as achievement}
						<Card variant="bordered" padding="sm">
							<div class="achievement-content">
								<!-- Title and Organization -->
								<div class="achievement-header">
									<div class="achievement-info">
										<h4 class="achievement-title">
											{achievement.title}
										</h4>
										{#if achievement.organization}
											<p class="organization-name">
												{achievement.organization}
											</p>
										{/if}
									</div>
									{#if achievement.year}
										<Badge variant="info">{achievement.year}</Badge>
									{/if}
								</div>

								<!-- Description -->
								<p class="achievement-description">
									{achievement.description}
								</p>
							</div>
						</Card>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.achievements-page {
		height: 100%;
		background: transparent; /* Inherit from BookSpreadView theme */
		padding: 3rem;
		overflow-y: auto;
		display: flex;
		align-items: center;
	}

	.content-wrapper {
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.page-header {
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.chapter-label {
		color: var(--color-accent);
		font-size: 0.75rem;
		font-family: monospace;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.3em;
	}

	.page-title {
		font-size: clamp(2rem, 5vw, 2.5rem);
		font-weight: 800;
		color: var(--color-text-primary);
	}

	.divider {
		width: 5rem;
		height: 0.25rem;
		background: var(--color-accent);
		margin: 0 auto;
		border-radius: 9999px;
	}

	.category-section {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.category-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--color-accent);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.category-dot {
		width: 0.375rem;
		height: 0.375rem;
		border-radius: 50%;
		background: var(--color-accent);
	}

	.achievements-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.75rem;
	}

	.achievement-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.achievement-header {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.achievement-info {
		flex: 1;
	}

	.achievement-title {
		font-size: 1rem;
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: 0.125rem;
	}

	.organization-name {
		font-size: 0.75rem;
		color: var(--color-text-secondary);
	}

	.achievement-description {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	@media (max-width: 768px) {
		.achievements-page {
			padding: 2rem 1.5rem;
		}
	}
</style>
