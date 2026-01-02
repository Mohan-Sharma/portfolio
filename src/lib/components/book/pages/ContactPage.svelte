<script lang="ts">
	/**
	 * Contact Page Component
	 * Contact information and social links
	 * Consistent design with dark background and orangish accents
	 */

	import type { ContactContent } from '$lib/types/book';
	import SocialLinks from '$lib/components/ui/SocialLinks.svelte';

	interface Props {
		data: ContactContent;
	}

	let { data }: Props = $props();

	function handleDownloadResume() {
		// Create a link element and trigger download
		const link = document.createElement('a');
		link.href = '/resume.docx';
		link.download = 'resume.docx';
		link.click();
	}
</script>

<div class="contact-page">
	<div class="content-wrapper">
		<!-- Contact Cards -->
		<div class="contact-grid">
			<!-- Email Card -->
			<div class="contact-card animate-fadeInUp">
				<div class="card-icon email-icon">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
						></path>
					</svg>
				</div>
				<div class="card-content">
					<h3 class="card-label">Email</h3>
					<a href="mailto:{data.email}" class="contact-link">
						{data.email}
					</a>
				</div>
			</div>

			<!-- Phone Card -->
			<div class="contact-card animate-[fadeInUp_0.6s_ease-out_0.2s_backwards]">
				<div class="card-icon phone-icon">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
						></path>
					</svg>
				</div>
				<div class="card-content">
					<h3 class="card-label">Phone</h3>
					<a href="tel:{data.phone}" class="contact-link">
						{data.phone}
					</a>
				</div>
			</div>
		</div>

		<!-- Social Links -->
		<div class="social-section animate-[fadeInUp_0.6s_ease-out_0.4s_backwards]">
			<h3 class="social-title">Connect on Social Media</h3>
			<div class="social-links-wrapper">
				<SocialLinks socials={data.socials} size="lg" />
			</div>
		</div>

		<!-- Download CV Button -->
		<div class="download-section animate-[fadeInUp_0.6s_ease-out_0.6s_backwards]">
			<button class="download-button" onclick={handleDownloadResume}>
				<svg class="download-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					></path>
				</svg>
				Download Resume
			</button>
		</div>
	</div>
</div>

<style>
	.contact-page {
		height: 100%;
		background: transparent; /* Inherit from BookSpreadView theme */
		padding: 3rem;
		overflow-y: auto;
	}

	.content-wrapper {
		max-width: 700px;
		margin: 0 auto;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 2.5rem;
	}

	.contact-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
	}

	.contact-card {
		background: color-mix(in srgb, var(--color-text-primary) 3%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-accent) 20%, transparent);
		border-radius: 0.75rem;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 1rem;
		transition: all 0.3s ease;
	}

	.contact-card:hover {
		background: color-mix(in srgb, var(--color-text-primary) 5%, transparent);
		border-color: color-mix(in srgb, var(--color-accent) 40%, transparent);
		transform: translateY(-4px);
		box-shadow: 0 8px 24px color-mix(in srgb, var(--color-accent) 15%, transparent);
	}

	.card-icon {
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 16px color-mix(in srgb, var(--color-accent) 30%, transparent);
	}

	.card-icon svg {
		width: 1.75rem;
		height: 1.75rem;
		color: white;
	}

	.email-icon {
		background: var(--color-accent);
	}

	.phone-icon {
		background: var(--color-accent);
	}

	.card-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.card-label {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-secondary);
	}

	.contact-link {
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-accent);
		text-decoration: none;
		transition: all 0.2s ease;
		word-break: break-all;
	}

	.contact-link:hover {
		opacity: 0.8;
		text-decoration: underline;
	}

	.social-section {
		background: color-mix(in srgb, var(--color-text-primary) 3%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-accent) 20%, transparent);
		border-radius: 0.75rem;
		padding: 2rem;
		text-align: center;
	}

	.social-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: 1.5rem;
	}

	.social-links-wrapper {
		display: flex;
		justify-content: center;
	}

	.download-section {
		text-align: center;
	}

	.download-button {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 2rem;
		background: var(--color-accent);
		color: white;
		font-size: 1rem;
		font-weight: 700;
		border: none;
		border-radius: 0.75rem;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 16px color-mix(in srgb, var(--color-accent) 40%, transparent);
	}

	.download-button:hover {
		background: color-mix(in srgb, var(--color-accent) 85%, black);
		transform: translateY(-2px);
		box-shadow: 0 6px 24px color-mix(in srgb, var(--color-accent) 50%, transparent);
	}

	.download-icon {
		width: 1.25rem;
		height: 1.25rem;
	}

	@media (max-width: 768px) {
		.contact-page {
			padding: 2rem 1.5rem;
		}

		.contact-grid {
			grid-template-columns: 1fr;
		}

		.content-wrapper {
			gap: 2rem;
		}
	}
</style>
