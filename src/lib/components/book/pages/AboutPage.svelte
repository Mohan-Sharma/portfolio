<script lang="ts">
	/**
	 * About Page Component
	 * Single page design for book spread
	 */

	import type { AboutContent } from '$lib/types/book';

	interface Props {
		data: AboutContent;
	}

	let { data }: Props = $props();
</script>

<div class="h-full bg-gallery dark:bg-void p-6 md:p-8 overflow-hidden flex items-center">
	<div class="max-w-5xl mx-auto space-y-6 w-full">
		<!-- Header -->
		<div class="text-center space-y-3">
			<div class="text-terracotta dark:text-copper text-xs font-mono uppercase tracking-[0.3em]">
				Chapter One
			</div>
			<h2 class="text-3xl md:text-4xl font-bold text-obsidian-ink dark:text-text-main-dark">
				About Me
			</h2>
			<div class="w-20 h-1 bg-terracotta dark:bg-copper mx-auto rounded-full"></div>
		</div>

		<!-- Bio with first-letter styling -->
		<div class="prose prose-lg max-w-none">
			<p class="text-sm md:text-base text-obsidian-ink/90 dark:text-text-main-dark/90 leading-relaxed text-justify first-letter:text-5xl first-letter:font-bold first-letter:text-terracotta dark:first-letter:text-copper first-letter:mr-2 first-letter:float-left first-letter:leading-none first-letter:mt-1">
				{data.bio}
			</p>
		</div>

		<!-- Stats Grid -->
		<div class="grid grid-cols-3 gap-4">
			<div class="bg-mercury/40 dark:bg-surface/40 backdrop-blur-sm p-4 rounded-lg border border-obsidian-ink/5 dark:border-steel/10 text-center">
				<div class="text-3xl font-bold text-terracotta dark:text-copper mb-1">
					{data.yearsOfExperience}+
				</div>
				<div class="text-xs text-text-sub-light dark:text-steel uppercase tracking-wide">
					Years Experience
				</div>
			</div>

			<div class="bg-mercury/40 dark:bg-surface/40 backdrop-blur-sm p-4 rounded-lg border border-obsidian-ink/5 dark:border-steel/10 text-center">
				<svg class="w-8 h-8 text-sage dark:text-sage mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
				</svg>
				<div class="text-xs text-text-sub-light dark:text-steel uppercase tracking-wide mb-1">Location</div>
				<div class="text-sm font-semibold text-obsidian-ink dark:text-text-main-dark">{data.location.split(',')[0]}</div>
			</div>

			<div class="bg-mercury/40 dark:bg-surface/40 backdrop-blur-sm p-4 rounded-lg border border-obsidian-ink/5 dark:border-steel/10 text-center">
				<svg class="w-8 h-8 text-copper dark:text-amber mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
				</svg>
				<div class="text-xs text-text-sub-light dark:text-steel uppercase tracking-wide mb-1">Status</div>
				<div class="text-sm font-semibold text-obsidian-ink dark:text-text-main-dark">Available</div>
			</div>
		</div>

		<!-- Quote -->
		<div class="relative pl-6 border-l-4 border-terracotta dark:border-copper py-4">
			<p class="text-base md:text-lg text-text-sub-light dark:text-text-sub-dark italic leading-relaxed">
				"Crafting enterprise solutions with precision and passion"
			</p>
		</div>
	</div>
</div>
