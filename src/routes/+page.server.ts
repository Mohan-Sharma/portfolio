/**
 * Home Page Server Load Function
 *
 * Enterprise Architecture Pattern:
 * - NO API routes (unnecessary for fullstack app)
 * - Direct service layer access
 * - Clean separation of concerns
 * - Type-safe with Zod validation
 * - Ready for database migration
 *
 * Architecture Flow:
 * +page.svelte → +page.server.ts → Service → Repository → Data
 */

import type { PageServerLoad } from './$types';
import { cvService } from '$lib/server/services/cv.service';
import { error } from '@sveltejs/kit';

/**
 * Server-side data loading
 * Runs once per request on the server
 * Data is automatically passed to +page.svelte
 */
export const load: PageServerLoad = async () => {
	try {
		// Direct service call - no HTTP overhead!
		const cvData = cvService.getCompleteCV();
		const yearsOfExperience = cvService.calculateYearsOfExperience();
		const statistics = cvService.getCVStatistics();

		// Validate portfolio completeness
		const { complete, missingSections } = cvService.isPortfolioComplete();

		if (!complete) {
			console.warn('Portfolio incomplete. Missing sections:', missingSections);
		}

		return {
			cvData,
			yearsOfExperience,
			statistics,
			meta: {
				portfolioComplete: complete,
				missingSections
			}
		};
	} catch (err) {
		// Proper error handling
		console.error('Failed to load CV data:', err);

		// Return 500 Internal Server Error
		throw error(500, {
			message: 'Failed to load portfolio data. Please try again later.'
		});
	}
};

/**
 * Enable prerendering for static export
 * Portfolio data doesn't change per-request
 * Generates static HTML at build time
 */
export const prerender = true;
