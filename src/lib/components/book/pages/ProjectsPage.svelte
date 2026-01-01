<script lang="ts">
	/**
	 * Projects Page Component
	 * Featured projects showcase
	 */

	import type { ProjectsContent } from '$lib/types/book';
	import { Card, Badge } from '$lib/components/ui';

	interface Props {
		data: ProjectsContent;
	}

	let { data }: Props = $props();
</script>

<div class="min-h-screen bg-gallery dark:bg-void p-8 md:p-16">
	<div class="max-w-6xl mx-auto space-y-12">
		<!-- Header -->
		<div class="text-center space-y-4">
			<h2 class="text-4xl md:text-5xl font-bold text-obsidian-ink dark:text-text-main-dark">
				Featured Projects
			</h2>
			<div class="w-24 h-1 bg-terracotta dark:bg-copper mx-auto rounded-full"></div>
		</div>

		<!-- Projects Grid -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			{#each data.items as project}
				<Card variant="elevated" padding="lg" class="hover:scale-[1.02] transition-transform">
					<div class="space-y-4">
						<!-- Title -->
						<div>
							<h3 class="text-2xl font-bold text-obsidian-ink dark:text-text-main-dark mb-2">
								{project.title}
							</h3>
							<p class="text-sm text-terracotta dark:text-copper font-semibold uppercase tracking-wide">
								{project.subtitle}
							</p>
						</div>

						<!-- Description -->
						<p class="text-text-sub-light dark:text-text-sub-dark leading-relaxed">
							{project.description}
						</p>

						<!-- Tech Stack -->
						<div class="pt-4 border-t border-obsidian-ink/10 dark:border-steel/20">
							<h4 class="text-xs font-semibold text-text-sub-light dark:text-steel uppercase tracking-wide mb-3">
								Tech Stack
							</h4>
							<div class="flex flex-wrap gap-2">
								{#each project.techStack as tech}
									<Badge variant="secondary" size="sm">{tech}</Badge>
								{/each}
							</div>
						</div>
					</div>
				</Card>
			{/each}
		</div>
	</div>
</div>
