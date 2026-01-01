/**
 * 3D Book Component Types - Chapter-Based Architecture
 */

import type { Education, Achievement, Project } from '$lib/schemas/cv.schema';

export interface BookPage {
	id: string;
	pageNumber: number;
	title: string;
	content: BookPageContent;
	side: 'left' | 'right';
}

export type BookPageContent =
	| { type: 'cover'; data: CoverContent }
	| { type: 'about'; data: AboutContent }
	| { type: 'experience'; data: ExperienceContent }
	| { type: 'projects'; data: ProjectsContent }
	| { type: 'projects-intro'; data: ProjectsIntroContent }
	| { type: 'project-detail'; data: ProjectDetailContent }
	| { type: 'skills'; data: SkillsContent }
	| { type: 'education'; data: EducationContent }
	| { type: 'achievements'; data: AchievementsContent }
	| { type: 'contact'; data: ContactContent };

export interface CoverContent {
	name: string;
	title: string;
	tagline: string;
}

export interface AboutContent {
	bio: string;
	location: string;
	yearsOfExperience: number;
}

export interface ExperienceContent {
	items: Array<{
		title: string;
		company: string;
		duration: string;
		technologies: string[];
		description?: string;
	}>;
}

export interface ProjectsContent {
	items: Array<{
		title: string;
		subtitle: string;
		description: string;
		techStack: string[];
	}>;
}

export interface ProjectsIntroContent {
	totalProjects: number;
	featuredCount: number;
}

export interface ProjectDetailContent extends Project {
	projectNumber: number;
	totalProjects: number;
}

export interface SkillsContent {
	categories: Record<string, string[]>;
}

export interface EducationContent {
	items: Education[];
}

export interface AchievementsContent {
	items: Achievement[];
}

export interface ContactContent {
	email: string;
	phone: string;
	socials: Record<string, string>;
}

export interface BookState {
	currentPage: number;
	totalPages: number;
	isAnimating: boolean;
}
