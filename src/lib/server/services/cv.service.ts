/**
 * CV Service Layer
 *
 * Service Pattern - Business logic and data orchestration
 * Single Responsibility: Implement business rules and coordinate data
 *
 * Responsibilities:
 * - Aggregate data from repositories
 * - Calculate derived values
 * - Implement business rules
 * - Return typed, ready-to-use data
 *
 * Benefits:
 * - Clean separation from data access
 * - Testable business logic
 * - Reusable across different routes
 * - Easy to maintain and extend
 */

import { cvRepository } from '$lib/server/repositories/cv.repository';
import type { CVData } from '$lib/schemas/cv.schema';

/**
 * CV Service Class
 * Implements all business logic for CV data
 */
export class CVService {
	/**
	 * Get complete CV data
	 * Aggregates all sections into a single object
	 */
	getCompleteCV(): CVData {
		const personal = cvRepository.getPersonalInfo();
		const about = cvRepository.getAbout();

		return {
			personal,
			socials: cvRepository.getSocialLinks(),
			summary: about.summary,
			experience: cvRepository.getAllExperience(),
			projects: cvRepository.getAllProjects(),
			skills: cvRepository.getSkills(),
			education: cvRepository.getAllEducation(),
			achievements: cvRepository.getAllAchievements()
		};
	}

	/**
	 * Get CV data with only featured projects
	 * Useful for homepage or summary views
	 */
	getCVWithFeaturedProjects(): CVData {
		const cv = this.getCompleteCV();
		return {
			...cv,
			projects: cvRepository.getFeaturedProjects()
		};
	}

	/**
	 * Calculate total years of professional experience
	 *
	 * Business Rule: Calculate from earliest start date to now
	 * Excludes gaps between jobs
	 */
	calculateYearsOfExperience(): number {
		const experiences = cvRepository.getAllExperience();

		if (experiences.length === 0) {
			return 0;
		}

		// Find earliest start date
		const startDates = experiences.map(exp => {
			// Parse "Month Year" format (e.g., "January 2020")
			const [month, year] = exp.startDate.split(' ');
			return new Date(`${month} 1, ${year}`);
		});

		const earliestDate = new Date(Math.min(...startDates.map(d => d.getTime())));
		const now = new Date();

		// Calculate difference in years (rounded down)
		const yearsDiff = now.getFullYear() - earliestDate.getFullYear();
		const monthsDiff = now.getMonth() - earliestDate.getMonth();

		// Adjust for partial years
		return monthsDiff < 0 ? yearsDiff - 1 : yearsDiff;
	}

	/**
	 * Calculate total years for a specific experience
	 *
	 * @param experienceId - ID of the experience entry
	 * @returns Years and months as a formatted string
	 */
	calculateExperienceDuration(experienceId: string): string | null {
		const experience = cvRepository.getExperienceById(experienceId);

		if (!experience) {
			return null;
		}

		const startDate = new Date(experience.startDate);
		const endDate = experience.endDate ? new Date(experience.endDate) : new Date();

		const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
			(endDate.getMonth() - startDate.getMonth());

		const years = Math.floor(months / 12);
		const remainingMonths = months % 12;

		if (years === 0) {
			return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
		} else if (remainingMonths === 0) {
			return `${years} year${years !== 1 ? 's' : ''}`;
		} else {
			return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
		}
	}

	/**
	 * Get technology proficiency count
	 * Counts how many projects/experiences use each technology
	 *
	 * Useful for highlighting most-used skills
	 */
	getTechnologyUsageStats(): Record<string, number> {
		const experiences = cvRepository.getAllExperience();
		const projects = cvRepository.getAllProjects();

		const usageCount: Record<string, number> = {};

		// Count from experiences
		experiences.forEach(exp => {
			exp.technologies.forEach(tech => {
				usageCount[tech] = (usageCount[tech] || 0) + 1;
			});
		});

		// Count from projects
		projects.forEach(project => {
			project.techStack.forEach(tech => {
				usageCount[tech] = (usageCount[tech] || 0) + 1;
			});
		});

		return usageCount;
	}

	/**
	 * Get top N most-used technologies
	 *
	 * @param limit - Number of technologies to return
	 * @returns Array of technologies sorted by usage
	 */
	getTopTechnologies(limit: number = 10): Array<{ name: string; count: number }> {
		const stats = this.getTechnologyUsageStats();

		return Object.entries(stats)
			.map(([name, count]) => ({ name, count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, limit);
	}

	/**
	 * Search projects by keyword
	 *
	 * Searches in: title, description, highlights, technologies
	 *
	 * @param keyword - Search term
	 * @returns Matching projects
	 */
	searchProjects(keyword: string): ReturnType<typeof cvRepository.getAllProjects> {
		const projects = cvRepository.getAllProjects();
		const lowerKeyword = keyword.toLowerCase();

		return projects.filter(project => {
			// Search in title
			if (project.title.toLowerCase().includes(lowerKeyword)) return true;

			// Search in description
			if (project.description.toLowerCase().includes(lowerKeyword)) return true;

			// Search in highlights
			if (project.highlights.some(h => h.toLowerCase().includes(lowerKeyword))) return true;

			// Search in tech stack
			if (project.techStack.some(t => t.toLowerCase().includes(lowerKeyword))) return true;

			return false;
		});
	}

	/**
	 * Get CV summary statistics
	 * Useful for "About" section or dashboard
	 */
	getCVStatistics() {
		return {
			yearsOfExperience: this.calculateYearsOfExperience(),
			totalProjects: cvRepository.getAllProjects().length,
			featuredProjects: cvRepository.getFeaturedProjects().length,
			companiesWorkedFor: new Set(
				cvRepository.getAllExperience().map(exp => exp.company)
			).size,
			skillCategories: Object.keys(cvRepository.getSkills()).length,
			totalSkills: Object.values(cvRepository.getSkills()).flat().length,
			achievements: cvRepository.getAllAchievements().length,
			educationEntries: cvRepository.getAllEducation().length
		};
	}

	/**
	 * Check if portfolio data is complete
	 * Validates that all required sections have data
	 */
	isPortfolioComplete(): { complete: boolean; missingSections: string[] } {
		const missingSections: string[] = [];

		try {
			const personal = cvRepository.getPersonalInfo();
			if (!personal.name || !personal.title) missingSections.push('personal');
		} catch {
			missingSections.push('personal');
		}

		try {
			const experience = cvRepository.getAllExperience();
			if (experience.length === 0) missingSections.push('experience');
		} catch {
			missingSections.push('experience');
		}

		try {
			const projects = cvRepository.getAllProjects();
			if (projects.length === 0) missingSections.push('projects');
		} catch {
			missingSections.push('projects');
		}

		try {
			const skills = cvRepository.getSkills();
			if (Object.keys(skills).length === 0) missingSections.push('skills');
		} catch {
			missingSections.push('skills');
		}

		return {
			complete: missingSections.length === 0,
			missingSections
		};
	}

	/**
	 * Clear all caches
	 * Delegates to repository
	 */
	clearCache(): void {
		cvRepository.clearCache();
	}
}

/**
 * Singleton instance
 * Export for use in server routes
 */
export const cvService = new CVService();
