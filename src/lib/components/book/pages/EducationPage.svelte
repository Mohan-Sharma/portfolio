<script lang="ts">
	/**
	 * Education Page Component
	 * Academic qualifications and degrees
	 */

	import type { Education } from '$lib/schemas/cv.schema';
	import { Card } from '$lib/components/ui';

	interface Props {
		data: { items: Education[] };
	}

	let { data }: Props = $props();
</script>

<div class="h-full bg-gallery dark:bg-void p-6 md:p-8 overflow-hidden flex items-center">
	<div class="max-w-5xl mx-auto space-y-6 w-full">
		<!-- Header -->
		<div class="text-center space-y-3">
			<div class="text-terracotta dark:text-copper text-xs font-mono uppercase tracking-[0.3em]">
				Chapter Five
			</div>
			<h2 class="text-3xl md:text-4xl font-bold text-obsidian-ink dark:text-text-main-dark">
				Education
			</h2>
			<div class="w-20 h-1 bg-terracotta dark:bg-copper mx-auto rounded-full"></div>
		</div>

		<!-- Education List -->
		<div class="space-y-4">
			{#each data.items as edu}
				<Card variant="elevated" padding="md">
					<div class="flex items-start gap-4">
						<!-- Icon -->
						<div class="flex-shrink-0">
							<div
								class="w-12 h-12 rounded-full bg-gradient-to-br from-sage to-copper dark:from-sage dark:to-amber flex items-center justify-center shadow-lg"
							>
								<svg
									class="w-6 h-6 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M12 14l9-5-9-5-9 5 9 5z"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
									></path>
									<path
										d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
									></path>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
									></path>
								</svg>
							</div>
						</div>

						<!-- Content -->
						<div class="flex-1">
							<h3 class="text-xl font-bold text-obsidian-ink dark:text-text-main-dark mb-1">
								{edu.degree}
							</h3>
							{#if edu.field}
								<p class="text-base text-terracotta dark:text-copper font-semibold mb-0.5">
									{edu.field}
								</p>
							{/if}
							<p class="text-sm text-text-sub-light dark:text-steel mb-0.5">
								{edu.institution}
							</p>
							<p class="text-sm text-text-sub-light dark:text-steel">
								{edu.year}
							</p>
						</div>
					</div>
				</Card>
			{/each}
		</div>
	</div>
</div>
