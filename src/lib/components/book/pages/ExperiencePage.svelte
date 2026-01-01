<script lang="ts">
	/**
	 * Experience Page Component
	 * Work history timeline
	 */

	import type { ExperienceContent } from '$lib/types/book';
	import { Card, Badge } from '$lib/components/ui';

	interface Props {
		data: ExperienceContent;
	}

	let { data }: Props = $props();
</script>

<div class="h-full bg-gallery dark:bg-void p-6 md:p-8 overflow-hidden flex items-center">
	<div class="max-w-5xl mx-auto space-y-6 w-full">
		<!-- Header -->
		<div class="text-center space-y-3">
			<div class="text-terracotta dark:text-copper text-xs font-mono uppercase tracking-[0.3em]">
				Chapter Two
			</div>
			<h2 class="text-3xl md:text-4xl font-bold text-obsidian-ink dark:text-text-main-dark">
				Experience
			</h2>
			<div class="w-20 h-1 bg-terracotta dark:bg-copper mx-auto rounded-full"></div>
		</div>

		<!-- Timeline -->
		<div class="space-y-4">
			{#each data.items as exp, index}
				<Card variant="elevated" padding="md">
					<div class="flex flex-col md:flex-row md:items-start gap-4">
						<!-- Timeline indicator -->
						<div class="flex-shrink-0">
							<div
								class="w-12 h-12 rounded-full bg-gradient-to-br from-terracotta to-copper dark:from-copper dark:to-amber flex items-center justify-center text-white font-bold text-base shadow-lg"
							>
								{index + 1}
							</div>
						</div>

						<!-- Content -->
						<div class="flex-1 space-y-2">
							<!-- Title and Company -->
							<div>
								<h3 class="text-xl font-bold text-obsidian-ink dark:text-text-main-dark mb-1">
									{exp.title}
								</h3>
								<p class="text-base text-terracotta dark:text-copper font-semibold">
									{exp.company}
								</p>
								<p class="text-sm text-text-sub-light dark:text-steel mt-0.5">
									{exp.duration}
								</p>
							</div>

							<!-- Technologies -->
							<div class="flex flex-wrap gap-2">
								{#each exp.technologies as tech}
									<Badge variant="primary">{tech}</Badge>
								{/each}
							</div>
						</div>
					</div>
				</Card>
			{/each}
		</div>
	</div>
</div>
