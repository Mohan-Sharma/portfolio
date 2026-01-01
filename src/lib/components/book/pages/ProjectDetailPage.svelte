<script lang="ts">
	/**
	 * Project Detail Page
	 * Full page dedicated to single project
	 */

	import type { ProjectDetailContent } from '$lib/types/book';
	import { Badge } from '$lib/components/ui';

	interface Props {
		data: ProjectDetailContent;
	}

	let { data }: Props = $props();
</script>

<div class="h-full bg-gallery dark:bg-void p-4 md:p-6 overflow-hidden flex items-center">
	<div class="max-w-5xl mx-auto space-y-2 w-full">
		<!-- Header with Project Number -->
		<div class="flex items-center justify-between mb-1">
			<span class="text-xs font-medium text-steel">
				Project {data.projectNumber} of {data.totalProjects}
			</span>
			{#if data.featured}
				<Badge variant="primary">Featured</Badge>
			{/if}
		</div>

		<!-- Title Section -->
		<div class="space-y-1">
			<h1 class="text-xl md:text-2xl font-bold text-obsidian-ink dark:text-white leading-tight">
				{data.title}
			</h1>
			{#if data.subtitle}
				<h2 class="text-sm md:text-base text-copper dark:text-amber font-medium">
					{data.subtitle}
				</h2>
			{/if}
			<div class="flex items-center gap-2 text-xs text-obsidian-ink/70 dark:text-steel">
				<div class="flex items-center gap-2">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
					</svg>
					<span>{data.company}</span>
				</div>
				<div class="flex items-center gap-2">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
					</svg>
					<span>{data.duration}</span>
				</div>
			</div>
		</div>

		<!-- Description -->
		<div class="bg-mercury/20 dark:bg-surface/50 backdrop-blur-chrome border border-steel/20 rounded-lg p-3">
			<p class="text-xs md:text-sm text-obsidian-ink dark:text-white/90 leading-snug">
				{data.description}
			</p>
		</div>

		<!-- Tech Stack -->
		<div class="space-y-1">
			<h3 class="text-sm font-semibold text-obsidian-ink dark:text-white flex items-center gap-1.5">
				<svg class="w-3.5 h-3.5 text-copper dark:text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
				</svg>
				Technology Stack
			</h3>
			<div class="flex flex-wrap gap-1.5">
				{#each data.techStack as tech}
					<Badge variant="secondary">{tech}</Badge>
				{/each}
			</div>
		</div>

		<!-- Key Highlights -->
		{#if data.highlights && data.highlights.length > 0}
			<div class="space-y-1">
				<h3 class="text-sm font-semibold text-obsidian-ink dark:text-white flex items-center gap-1.5">
					<svg class="w-3.5 h-3.5 text-terracotta dark:text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					Key Achievements
				</h3>
				<ul class="space-y-1">
					{#each data.highlights as highlight}
						<li class="flex items-start gap-1.5">
							<div class="flex-shrink-0 w-1 h-1 rounded-full bg-copper dark:bg-amber mt-1.5"></div>
							<span class="text-xs text-obsidian-ink/80 dark:text-white/80 leading-snug">
								{highlight}
							</span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Tags -->
		{#if data.tags && data.tags.length > 0}
			<div class="flex flex-wrap gap-1.5 pt-1.5 border-t border-steel/20">
				{#each data.tags as tag}
					<Badge variant="primary">#{tag}</Badge>
				{/each}
			</div>
		{/if}
	</div>
</div>
