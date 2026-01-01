<script lang="ts">
	/**
	 * Projects Introduction Page
	 * Chapter opener for projects section
	 */

	import type { ProjectsIntroContent } from '$lib/types/book';

	interface Props {
		data: ProjectsIntroContent;
	}

	let { data }: Props = $props();
</script>

<div class="min-h-screen bg-gallery dark:bg-void p-8 md:p-16 flex items-center justify-center">
	<div class="max-w-4xl w-full text-center space-y-12">
		<!-- Chapter Title -->
		<div class="space-y-6">
			<div class="text-terracotta dark:text-copper text-sm font-mono uppercase tracking-[0.3em]">
				Chapter Three
			</div>
			<h1 class="text-6xl md:text-8xl font-bold text-copper dark:text-amber">
				Projects
			</h1>
			<div class="w-32 h-1 bg-gradient-to-r from-copper to-terracotta dark:from-amber dark:to-copper mx-auto rounded-full"></div>
		</div>

		<!-- Stats -->
		<div class="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
			<div class="bg-mercury/20 dark:bg-surface/50 backdrop-blur-chrome border border-steel/20 rounded-2xl p-8">
				<div class="text-5xl md:text-6xl font-bold text-copper dark:text-amber mb-2">
					{data.totalProjects}
				</div>
				<div class="text-lg text-obsidian-ink/70 dark:text-steel">
					Total Projects
				</div>
			</div>

			<div class="bg-mercury/20 dark:bg-surface/50 backdrop-blur-chrome border border-steel/20 rounded-2xl p-8">
				<div class="text-5xl md:text-6xl font-bold text-terracotta dark:text-amber mb-2">
					{data.featuredCount}
				</div>
				<div class="text-lg text-obsidian-ink/70 dark:text-steel">
					Featured
				</div>
			</div>
		</div>

		<!-- Description -->
		<p class="text-xl md:text-2xl text-obsidian-ink/80 dark:text-steel leading-relaxed max-w-3xl mx-auto">
			A comprehensive showcase of enterprise-scale projects spanning AI governance, integration platforms, commerce systems, and full-stack applications.
		</p>

		<!-- Navigation Hint -->
		<div class="flex items-center justify-center gap-3 text-obsidian-ink/60 dark:text-steel/60">
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
			</svg>
			<span class="text-sm">Each project detailed on its own page</span>
		</div>
	</div>
</div>
