<script lang="ts">
	/**
	 * ProjectSpreadLeftPage - Project Hero/Intro
	 * Consistent design with dark background and orangish accents
	 */

	import type { ProjectSpreadLeftContent } from '$lib/types/book';

	interface Props {
		data: ProjectSpreadLeftContent;
	}

	let { data }: Props = $props();
</script>

<div class="project-left-page">
	<div class="content-wrapper">
		{#if data.featured}
			<div class="featured-badge animate-fadeInUp">
				<svg class="icon" fill="currentColor" viewBox="0 0 20 20">
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
				</svg>
				Featured Project
			</div>
		{/if}

		<div class="main-content">
			<h1 class="project-title animate-[fadeInUp_0.6s_ease-out_0.2s_backwards]">
				{data.title}
			</h1>

			{#if data.subtitle}
				<h2 class="project-subtitle animate-[fadeInUp_0.6s_ease-out_0.3s_backwards]">
					{data.subtitle}
				</h2>
			{/if}

			<p class="project-oneliner animate-[fadeInUp_0.6s_ease-out_0.4s_backwards]">
				{data.oneLiner}
			</p>

			<div class="project-meta animate-[fadeInUp_0.6s_ease-out_0.5s_backwards]">
				{#if data.company}
					<div class="meta-item">
						<svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
						</svg>
						<span>{data.company}</span>
					</div>
				{/if}
				{#if data.duration}
					<div class="meta-item">
						<svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
						</svg>
						<span>{data.duration}</span>
					</div>
				{/if}
			</div>

			{#if data.tags && data.tags.length > 0}
				<div class="project-tags animate-[fadeInUp_0.6s_ease-out_0.6s_backwards]">
					{#each data.tags as tag}
						<span class="tag">#{tag}</span>
					{/each}
				</div>
			{/if}
		</div>

		<div class="decoration-group animate-[fadeInUp_0.6s_ease-out_0.7s_backwards]">
			<div class="decoration-line"></div>
			<div class="decoration-dot"></div>
			<div class="decoration-line"></div>
		</div>
	</div>
</div>

<style>
	.project-left-page {
		height: 100%;
		background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
		padding: 3rem;
		overflow-y: auto;
	}

	.content-wrapper {
		max-width: 600px;
		margin: 0 auto;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: 2rem;
	}

	.featured-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1.25rem;
		background: linear-gradient(135deg, #e27d60, #a64b35);
		border-radius: 9999px;
		font-size: 0.875rem;
		font-weight: 700;
		color: white;
		box-shadow: 0 4px 16px rgba(226, 125, 96, 0.4);
	}

	.featured-badge .icon {
		width: 1rem;
		height: 1rem;
	}

	.main-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.project-title {
		font-size: clamp(2.5rem, 6vw, 4rem);
		font-weight: 800;
		line-height: 1.1;
		color: #e6e9ef;
		text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.project-subtitle {
		font-size: clamp(1.25rem, 3vw, 2rem);
		font-weight: 600;
		color: #e27d60;
		line-height: 1.3;
	}

	.project-oneliner {
		font-size: 1.125rem;
		line-height: 1.8;
		color: rgba(230, 233, 239, 0.9);
		max-width: 500px;
		margin: 0 auto;
	}

	.project-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 2rem;
	}

	.meta-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.875rem;
		color: rgba(230, 233, 239, 0.8);
	}

	.meta-icon {
		width: 1.25rem;
		height: 1.25rem;
		color: #e27d60;
	}

	.project-tags {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.75rem;
	}

	.tag {
		font-size: 0.75rem;
		font-weight: 600;
		color: #e27d60;
		background: rgba(226, 125, 96, 0.1);
		padding: 0.375rem 1rem;
		border-radius: 9999px;
		border: 1px solid rgba(226, 125, 96, 0.3);
	}

	.decoration-group {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.decoration-line {
		height: 2px;
		width: 4rem;
		background: linear-gradient(to right, transparent, #e27d60, transparent);
	}

	.decoration-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #e27d60;
		box-shadow: 0 0 10px rgba(226, 125, 96, 0.5);
	}

	.turn-hint {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: rgba(226, 125, 96, 0.7);
		margin-top: auto;
		padding-top: 2rem;
	}

	.hint-icon {
		width: 1.25rem;
		height: 1.25rem;
		animation: slideRight 1.5s ease-in-out infinite;
	}

	@keyframes slideRight {
		0%, 100% {
			transform: translateX(0);
			opacity: 0.7;
		}
		50% {
			transform: translateX(8px);
			opacity: 1;
		}
	}

	@media (max-width: 768px) {
		.project-left-page {
			padding: 2rem 1.5rem;
		}

		.project-meta {
			flex-direction: column;
			gap: 1rem;
		}
	}
</style>
