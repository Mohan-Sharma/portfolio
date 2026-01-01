/**
 * 3D Book Component Types - Chapter-Based Architecture
 */

import type { Education, Achievement, Project } from '$lib/schemas/cv.schema';

// ===== Content Type Definitions (Define before using) =====

export interface CoverContent {
	name: string;
	title: string;
	tagline: string;
}

// Table of Contents
export interface TOCContent {
	chapters: TOCChapter[];
}

export interface TOCChapter {
	number: number;
	title: string;
	pageNumber: number;
}

// Chapter Title Page
export interface ChapterTitleContent {
	number: number;
	title: string;
	subtitle?: string;
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
	intro: string;
	projects: Array<{
		id: string;
		title: string;
		oneLiner: string;
		tags: string[];
	}>;
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

// Project Spread (2-page layout)
export interface ProjectSpreadLeftContent {
	title: string;
	subtitle: string;
	company: string;
	duration: string;
	oneLiner: string;
	featured: boolean;
	tags: string[];
}

export interface ProjectSpreadRightContent {
	description: string;
	techStack: string[];
	highlights: string[];
}

// Closing/Monologue Page
export interface ClosingContent {
	title: string;
	message: string;
}

// Blank Page (for spacing/alignment)
export interface BlankContent {
	// Intentionally empty
}

// ===== Page Content Union Type =====

export type BookPageContent =
	| { type: 'cover'; data: CoverContent }
	| { type: 'toc'; data: TOCContent }
	| { type: 'chapter-title'; data: ChapterTitleContent }
	| { type: 'about'; data: AboutContent }
	| { type: 'experience'; data: ExperienceContent }
	| { type: 'projects-intro'; data: ProjectsIntroContent }
	| { type: 'project-spread-left'; data: ProjectSpreadLeftContent }
	| { type: 'project-spread-right'; data: ProjectSpreadRightContent }
	| { type: 'skills'; data: SkillsContent }
	| { type: 'education'; data: EducationContent }
	| { type: 'achievements'; data: AchievementsContent }
	| { type: 'contact'; data: ContactContent }
	| { type: 'closing'; data: ClosingContent }
	| { type: 'blank'; data: BlankContent };

// ===== Book Page =====

export interface BookPage {
	id: string;
	pageNumber: number;
	title: string;
	content: BookPageContent;
	side: 'left' | 'right';
}

// ===== Book State =====

export interface BookState {
	currentPage: number;
	totalPages: number;
	isAnimating: boolean;
	viewMode: 'closed' | 'open';
}
