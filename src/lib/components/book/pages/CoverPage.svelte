<script lang="ts">
	/**
	 * Cover Page Component
	 * Single page design for book spread
	 */

	import type { CoverContent } from '$lib/types/book';

	interface Props {
		data: CoverContent;
	}

	let { data }: Props = $props();
</script>

<div class="h-full bg-gradient-to-br from-terracotta via-terracotta/90 to-obsidian-ink/80 dark:from-copper dark:via-amber/90 dark:to-void/80 flex items-center justify-center p-8 relative overflow-hidden">
	<!-- Embossed Pattern Background -->
	<div class="absolute inset-0 opacity-5">
		<svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
					<circle cx="20" cy="20" r="1" fill="white"/>
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#grid)"/>
		</svg>
	</div>

	<!-- Content Area -->
	<div class="relative z-10 w-full max-w-3xl flex flex-col justify-center items-center space-y-12">
		<!-- Top: Publisher Mark -->
		<div class="flex items-center justify-between w-full">
			<span class="text-white/80 text-xs uppercase tracking-[0.3em] font-mono">
				Portfolio 2025
			</span>
			<div class="w-12 h-12 rounded-full border-2 border-white/60 flex items-center justify-center">
				<span class="text-white/90 font-bold text-xl">{data.name.charAt(0)}</span>
			</div>
		</div>

		<!-- Center: Title Block -->
		<div class="space-y-8 text-center w-full">
			<!-- Main Title with Shadow -->
			<h1 class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-none tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]" style="text-shadow: 2px 2px 0 rgba(0,0,0,0.2);">
				{data.name}
			</h1>

			<!-- Decorative Line -->
			<div class="flex items-center justify-center gap-4">
				<div class="h-px w-16 bg-white/60"></div>
				<div class="w-2 h-2 rounded-full bg-white/80 animate-pulse"></div>
				<div class="h-px w-16 bg-white/60"></div>
			</div>

			<!-- Subtitle -->
			<h2 class="text-xl md:text-2xl text-white/95 font-light tracking-wider">
				{data.title}
			</h2>
		</div>

		<!-- Bottom: Tagline & Edition -->
		<div class="space-y-4 w-full">
			<p class="text-white/90 text-sm md:text-base italic text-center leading-relaxed">
				"{data.tagline}"
			</p>
			<div class="text-center text-white/60 text-xs uppercase tracking-widest font-mono">
				Digital Edition · Interactive Experience
			</div>
		</div>
	</div>
</div>
