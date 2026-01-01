<script lang="ts">
	/**
	 * Education Page Component
	 * Academic qualifications and degrees
	 * Consistent design with dark background and orangish accents
	 */

	import type { Education } from '$lib/schemas/cv.schema';

	interface Props {
		data: { items: Education[] };
	}

	let { data }: Props = $props();
</script>

<div class="education-page">
	<div class="content-wrapper">
		<!-- Education List -->
		<div class="education-list">
			{#each data.items as edu, index}
				<div class="education-item animate-[fadeInUp_0.6s_ease-out_{(index * 0.15)}s_backwards]">
					<div class="education-content">
						<!-- Icon -->
						<div class="education-icon">
							<svg
								class="icon"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
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
							</svg>
						</div>

						<!-- Content -->
						<div class="education-info">
							<h3 class="degree-title">{edu.degree}</h3>
							{#if edu.field}
								<p class="field-name">{edu.field}</p>
							{/if}
							<p class="institution-name">{edu.institution}</p>
							<p class="education-year">{edu.year}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.education-page {
		height: 100%;
		background: linear-gradient(135deg, #16213e 0%, #1a1a2e 50%, #0f0f23 100%);
		padding: 3rem;
		overflow-y: auto;
	}

	.content-wrapper {
		max-width: 700px;
		margin: 0 auto;
		min-height: 100%;
		display: flex;
		align-items: flex-start;
		padding: 2rem 0;
	}

	.education-list {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.education-item {
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(226, 125, 96, 0.2);
		border-radius: 0.75rem;
		padding: 2rem;
		transition: all 0.3s ease;
	}

	.education-item:hover {
		background: rgba(255, 255, 255, 0.05);
		border-color: rgba(226, 125, 96, 0.4);
		transform: translateX(8px);
		box-shadow: 0 8px 24px rgba(226, 125, 96, 0.15);
	}

	.education-content {
		display: flex;
		align-items: start;
		gap: 1.5rem;
	}

	.education-icon {
		flex-shrink: 0;
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 50%;
		background: linear-gradient(135deg, #e27d60, #a64b35);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 16px rgba(226, 125, 96, 0.3);
	}

	.icon {
		width: 1.75rem;
		height: 1.75rem;
		color: white;
	}

	.education-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.degree-title {
		font-size: 1.25rem;
		font-weight: 700;
		color: #e6e9ef;
		line-height: 1.4;
	}

	.field-name {
		font-size: 1rem;
		font-weight: 600;
		color: #e27d60;
		line-height: 1.5;
	}

	.institution-name {
		font-size: 0.9375rem;
		color: rgba(230, 233, 239, 0.8);
		line-height: 1.6;
	}

	.education-year {
		font-size: 0.875rem;
		font-weight: 600;
		font-family: monospace;
		color: rgba(226, 125, 96, 0.8);
	}

	@media (max-width: 768px) {
		.education-page {
			padding: 2rem 1.5rem;
		}

		.education-content {
			flex-direction: column;
			align-items: center;
			text-align: center;
		}

		.education-list {
			gap: 1.5rem;
		}
	}
</style>
