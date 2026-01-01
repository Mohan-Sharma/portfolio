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

<div class="h-full bg-gallery dark:bg-void p-6 md:p-8 overflow-hidden flex items-center">
	<div class="max-w-5xl mx-auto space-y-6 w-full">
		<!-- Header -->
		<div class="text-center space-y-3">
			<div class="text-terracotta dark:text-copper text-xs font-mono uppercase tracking-[0.3em]">
				Chapter Six
			</div>
			<h2 class="text-3xl md:text-4xl font-bold text-obsidian-ink dark:text-text-main-dark">
				Achievements
			</h2>
			<div class="w-20 h-1 bg-terracotta dark:bg-copper mx-auto rounded-full"></div>
		</div>

		<!-- Achievements by Category -->
		{#each Object.entries(groupedAchievements()) as [category, achievements]}
			<div class="space-y-3">
				<h3 class="text-lg font-bold text-terracotta dark:text-copper flex items-center gap-2">
					<span class="w-1.5 h-1.5 rounded-full bg-terracotta dark:bg-copper"></span>
					{category}
				</h3>

				<div class="grid grid-cols-1 gap-3">
					{#each achievements as achievement}
						<Card variant="bordered" padding="sm">
							<div class="space-y-2">
								<!-- Title and Organization -->
								<div class="flex flex-wrap items-start justify-between gap-2">
									<div class="flex-1">
										<h4 class="text-base font-bold text-obsidian-ink dark:text-text-main-dark mb-0.5">
											{achievement.title}
										</h4>
										{#if achievement.organization}
											<p class="text-xs text-text-sub-light dark:text-steel">
												{achievement.organization}
											</p>
										{/if}
									</div>
									{#if achievement.year}
										<Badge variant="info">{achievement.year}</Badge>
									{/if}
								</div>

								<!-- Description -->
								<p class="text-sm text-text-sub-light dark:text-text-sub-dark leading-relaxed">
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
