<script lang="ts">
	/**
	 * Skills Page Component
	 * Categorized technical skills display
	 */

	import type { SkillsContent } from '$lib/types/book';
	import { Card, Badge } from '$lib/components/ui';

	interface Props {
		data: SkillsContent;
	}

	let { data }: Props = $props();
</script>

<div class="h-full bg-gallery dark:bg-void p-6 md:p-8 overflow-hidden flex items-center">
	<div class="max-w-5xl mx-auto space-y-6 w-full">
		<!-- Header -->
		<div class="text-center space-y-3">
			<div class="text-terracotta dark:text-copper text-xs font-mono uppercase tracking-[0.3em]">
				Chapter Four
			</div>
			<h2 class="text-3xl md:text-4xl font-bold text-obsidian-ink dark:text-text-main-dark">
				Technical Skills
			</h2>
			<div class="w-20 h-1 bg-terracotta dark:bg-copper mx-auto rounded-full"></div>
		</div>

		<!-- Skills Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each Object.entries(data.categories) as [category, skills]}
				<Card variant="elevated" padding="md">
					<h3 class="text-lg font-bold text-terracotta dark:text-copper mb-3 flex items-center gap-2">
						<span class="w-1.5 h-1.5 rounded-full bg-terracotta dark:bg-copper"></span>
						{category}
					</h3>
					<div class="flex flex-wrap gap-2">
						{#each skills as skill}
							<Badge variant="default" size="md">{skill}</Badge>
						{/each}
					</div>
				</Card>
			{/each}
		</div>
	</div>
</div>
