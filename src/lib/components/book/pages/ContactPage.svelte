<script lang="ts">
	/**
	 * Contact Page Component
	 * Contact information and social links
	 */

	import type { ContactContent } from '$lib/types/book';
	import { Card, Button } from '$lib/components/ui';
	import SocialLinks from '$lib/components/ui/SocialLinks.svelte';

	interface Props {
		data: ContactContent;
	}

	let { data }: Props = $props();
</script>

<div class="h-full bg-gradient-to-br from-copper/5 via-sage/5 to-amber/5 dark:from-void dark:via-surface dark:to-surface p-6 md:p-8 overflow-hidden flex items-center">
	<div class="max-w-4xl mx-auto space-y-6 w-full">
		<!-- Header -->
		<div class="text-center space-y-3">
			<div class="text-terracotta dark:text-copper text-xs font-mono uppercase tracking-[0.3em]">
				Chapter Seven
			</div>
			<h2 class="text-3xl md:text-4xl font-bold text-obsidian-ink dark:text-text-main-dark">
				Get In Touch
			</h2>
			<div class="w-20 h-1 bg-terracotta dark:bg-copper mx-auto rounded-full"></div>
			<p class="text-base text-text-sub-light dark:text-steel max-w-2xl mx-auto">
				Let's connect and discuss opportunities, projects, or just have a chat about technology!
			</p>
		</div>

		<!-- Contact Cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<!-- Email Card -->
			<Card variant="elevated" padding="md">
				<div class="text-center space-y-3">
					<div class="w-12 h-12 mx-auto rounded-full bg-terracotta/10 dark:bg-copper/10 flex items-center justify-center">
						<svg
							class="w-6 h-6 text-terracotta dark:text-copper"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							></path>
						</svg>
					</div>
					<div>
						<h3 class="text-xs font-semibold text-text-sub-light dark:text-steel uppercase tracking-wide mb-1">
							Email
						</h3>
						<a
							href="mailto:{data.email}"
							class="text-base font-medium text-terracotta dark:text-copper hover:underline break-all"
						>
							{data.email}
						</a>
					</div>
				</div>
			</Card>

			<!-- Phone Card -->
			<Card variant="elevated" padding="md">
				<div class="text-center space-y-3">
					<div class="w-12 h-12 mx-auto rounded-full bg-sage/10 dark:bg-sage/20 flex items-center justify-center">
						<svg
							class="w-6 h-6 text-sage"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
							></path>
						</svg>
					</div>
					<div>
						<h3 class="text-xs font-semibold text-text-sub-light dark:text-steel uppercase tracking-wide mb-1">
							Phone
						</h3>
						<a
							href="tel:{data.phone}"
							class="text-base font-medium text-sage dark:text-sage hover:underline"
						>
							{data.phone}
						</a>
					</div>
				</div>
			</Card>
		</div>

		<!-- Social Links -->
		<Card variant="bordered" padding="md">
			<div class="text-center space-y-4">
				<h3 class="text-lg font-bold text-obsidian-ink dark:text-text-main-dark">
					Connect on Social Media
				</h3>
				<div class="flex justify-center">
					<SocialLinks socials={data.socials} size="lg" />
				</div>
			</div>
		</Card>

		<!-- Download CV Button -->
		<div class="text-center">
			<Button variant="primary" size="md">
				{#snippet children()}
					<svg
						class="w-5 h-5 mr-2"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						></path>
					</svg>
					Download Resume
				{/snippet}
			</Button>
		</div>
	</div>
</div>
