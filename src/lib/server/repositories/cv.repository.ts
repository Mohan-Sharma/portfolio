/**
 * CV Data Repository
 *
 * Repository Pattern - Abstraction over data access
 * Single Responsibility: Read and validate data from storage
 *
 * Current: Reads from JSON files
 * Future: Will read from PostgreSQL/MySQL database
 *
 * Benefits:
 * - Decouples business logic from data source
 * - Easy to swap JSON → Database
 * - Validates data at the boundary
 * - Caching for performance
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import type {
	PersonalInfo,
	SocialLinks,
	Experience,
	Project,
	Education,
	Achievement,
	Skills,
	About,
	Contact
} from '$lib/schemas/cv.schema';
import {
	PersonalInfoSchema,
	SocialLinksSchema,
	ExperienceSchema,
	ProjectSchema,
	EducationSchema,
	AchievementSchema,
	SkillsSchema,
	AboutSchema,
	ContactSchema
} from '$lib/schemas/cv.schema';

/**
 * In-memory cache for performance
 * Cleared on server restart (intentional for data updates)
 */
const cache = new Map<string, any>();

/**
 * Cache TTL (Time To Live) in milliseconds
 * Set to 0 in development for instant updates
 */
const CACHE_TTL = process.env.NODE_ENV === 'production' ? 5 * 60 * 1000 : 0; // 5 min in prod, no cache in dev

interface CacheEntry<T> {
	data: T;
	timestamp: number;
}

/**
 * Generic cache getter with TTL
 */
function getCached<T>(key: string): T | null {
	const entry = cache.get(key) as CacheEntry<T> | undefined;

	if (!entry) return null;

	const now = Date.now();
	if (now - entry.timestamp > CACHE_TTL) {
		cache.delete(key);
		return null;
	}

	return entry.data;
}

/**
 * Generic cache setter
 */
function setCache<T>(key: string, data: T): void {
	cache.set(key, {
		data,
		timestamp: Date.now()
	});
}

/**
 * Generic JSON file loader with validation
 *
 * @param filename - Name of JSON file in /data directory
 * @param schema - Zod schema for validation
 * @param cacheKey - Unique cache key
 * @returns Validated and typed data
 */
function loadAndValidateJSON<T>(
	filename: string,
	schema: { parse: (data: unknown) => T },
	cacheKey: string
): T {
	// Check cache first
	const cached = getCached<T>(cacheKey);
	if (cached !== null) {
		return cached;
	}

	try {
		// Read file
		const dataPath = join(process.cwd(), 'data', filename);
		const rawData = readFileSync(dataPath, 'utf-8');

		// Parse JSON
		const jsonData = JSON.parse(rawData);

		// Validate with Zod schema
		const validatedData = schema.parse(jsonData);

		// Cache the result
		setCache(cacheKey, validatedData);

		return validatedData;
	} catch (error) {
		// Proper error handling
		if (error instanceof Error) {
			throw new Error(`Failed to load ${filename}: ${error.message}`);
		}
		throw new Error(`Failed to load ${filename}: Unknown error`);
	}
}

/**
 * CV Repository Class
 * Encapsulates all data access operations
 */
export class CVRepository {
	/**
	 * Get personal information
	 */
	getPersonalInfo(): PersonalInfo {
		return loadAndValidateJSON(
			'personal.json',
			PersonalInfoSchema,
			'personal'
		);
	}

	/**
	 * Get social media links
	 */
	getSocialLinks(): SocialLinks {
		return loadAndValidateJSON(
			'socials.json',
			SocialLinksSchema,
			'socials'
		);
	}

	/**
	 * Get about/summary information
	 */
	getAbout(): About {
		return loadAndValidateJSON(
			'about.json',
			AboutSchema,
			'about'
		);
	}

	/**
	 * Get all work experience entries
	 * Sorted by date (most recent first)
	 */
	getAllExperience(): Experience[] {
		const experiences = loadAndValidateJSON(
			'experience.json',
			ExperienceSchema.array(),
			'experience'
		);

		// Sort by start date (most recent first)
		return experiences.sort((a, b) => {
			const dateA = new Date(a.startDate);
			const dateB = new Date(b.startDate);
			return dateB.getTime() - dateA.getTime();
		});
	}

	/**
	 * Get current/ongoing experience
	 */
	getCurrentExperience(): Experience | null {
		const experiences = this.getAllExperience();
		return experiences.find(exp => exp.current) || null;
	}

	/**
	 * Get experience by ID
	 */
	getExperienceById(id: string): Experience | null {
		const experiences = this.getAllExperience();
		return experiences.find(exp => exp.id === id) || null;
	}

	/**
	 * Get all projects
	 */
	getAllProjects(): Project[] {
		return loadAndValidateJSON(
			'projects.json',
			ProjectSchema.array(),
			'projects'
		);
	}

	/**
	 * Get featured projects only
	 */
	getFeaturedProjects(): Project[] {
		return this.getAllProjects().filter(project => project.featured);
	}

	/**
	 * Get project by ID
	 */
	getProjectById(id: string): Project | null {
		const projects = this.getAllProjects();
		return projects.find(project => project.id === id) || null;
	}

	/**
	 * Get projects by tag
	 */
	getProjectsByTag(tag: string): Project[] {
		return this.getAllProjects().filter(project =>
			project.tags.some(t => t.toLowerCase() === tag.toLowerCase())
		);
	}

	/**
	 * Get all skills grouped by category
	 */
	getSkills(): Skills {
		return loadAndValidateJSON(
			'skills.json',
			SkillsSchema,
			'skills'
		);
	}

	/**
	 * Get all education entries
	 */
	getAllEducation(): Education[] {
		return loadAndValidateJSON(
			'education.json',
			EducationSchema.array(),
			'education'
		);
	}

	/**
	 * Get all achievements
	 */
	getAllAchievements(): Achievement[] {
		return loadAndValidateJSON(
			'achievements.json',
			AchievementSchema.array(),
			'achievements'
		);
	}

	/**
	 * Get contact information
	 */
	getContactInfo(): Contact {
		return loadAndValidateJSON(
			'contact.json',
			ContactSchema,
			'contact'
		);
	}

	/**
	 * Clear all caches
	 * Useful for testing or forcing data refresh
	 */
	clearCache(): void {
		cache.clear();
	}
}

/**
 * Singleton instance
 * Reuse across the application
 */
export const cvRepository = new CVRepository();
