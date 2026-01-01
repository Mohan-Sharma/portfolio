/**
 * Maps CV data to book page structure - Chapter-Based Architecture
 * Each major section gets its own chapter
 * Each project gets its own dedicated page
 */

import type { CVData } from '$lib/schemas/cv.schema';
import type { BookPage } from '$lib/types/book';

export function mapCVDataToBookPages(cvData: CVData, yearsOfExperience: number): BookPage[] {
	const pages: BookPage[] = [];
	let pageNumber = 0;
	let currentSide: 'left' | 'right' = 'right';

	// Helper to toggle side
	const toggleSide = () => {
		currentSide = currentSide === 'left' ? 'right' : 'left';
		return currentSide;
	};

	// ===== CHAPTER 1: COVER =====
	pages.push({
		id: 'cover',
		pageNumber: pageNumber++,
		title: 'Portfolio',
		side: currentSide,
		content: {
			type: 'cover',
			data: {
				name: cvData.personal.name,
				title: cvData.personal.title,
				tagline: cvData.personal.tagline
			}
		}
	});
	toggleSide();

	// ===== CHAPTER 2: ABOUT ME =====
	pages.push({
		id: 'about',
		pageNumber: pageNumber++,
		title: 'About Me',
		side: currentSide,
		content: {
			type: 'about',
			data: {
				bio: cvData.personal.bio,
				location: `${cvData.personal.location.city}, ${cvData.personal.location.country}`,
				yearsOfExperience
			}
		}
	});
	toggleSide();

	// ===== CHAPTER 3: PROFESSIONAL EXPERIENCE =====
	pages.push({
		id: 'experience',
		pageNumber: pageNumber++,
		title: 'Professional Experience',
		side: currentSide,
		content: {
			type: 'experience',
			data: {
				items: cvData.experience.map((exp) => ({
					title: exp.title,
					company: exp.company,
					duration: exp.current
						? `${exp.startDate} - Present`
						: `${exp.startDate} - ${exp.endDate}`,
					technologies: exp.technologies,
					description: exp.description
				}))
			}
		}
	});
	toggleSide();

	// ===== CHAPTER 4: PROJECTS (One page per project!) =====
	// First, add a projects intro/index page
	pages.push({
		id: 'projects-intro',
		pageNumber: pageNumber++,
		title: 'Projects',
		side: currentSide,
		content: {
			type: 'projects-intro',
			data: {
				totalProjects: cvData.projects.length,
				featuredCount: cvData.projects.filter((p) => p.featured).length
			}
		}
	});
	toggleSide();

	// Now add each project as its own page
	cvData.projects.forEach((project, index) => {
		pages.push({
			id: `project-${project.id}`,
			pageNumber: pageNumber++,
			title: project.title,
			side: currentSide,
			content: {
				type: 'project-detail',
				data: {
					...project,
					projectNumber: index + 1,
					totalProjects: cvData.projects.length
				}
			}
		});
		toggleSide();
	});

	// ===== CHAPTER 5: TECHNICAL SKILLS =====
	pages.push({
		id: 'skills',
		pageNumber: pageNumber++,
		title: 'Technical Skills',
		side: currentSide,
		content: {
			type: 'skills',
			data: {
				categories: cvData.skills
			}
		}
	});
	toggleSide();

	// ===== CHAPTER 6: EDUCATION =====
	pages.push({
		id: 'education',
		pageNumber: pageNumber++,
		title: 'Education',
		side: currentSide,
		content: {
			type: 'education',
			data: {
				items: cvData.education
			}
		}
	});
	toggleSide();

	// ===== CHAPTER 7: ACHIEVEMENTS =====
	pages.push({
		id: 'achievements',
		pageNumber: pageNumber++,
		title: 'Achievements',
		side: currentSide,
		content: {
			type: 'achievements',
			data: {
				items: cvData.achievements
			}
		}
	});
	toggleSide();

	// ===== CHAPTER 8: CONTACT =====
	pages.push({
		id: 'contact',
		pageNumber: pageNumber++,
		title: 'Get In Touch',
		side: currentSide,
		content: {
			type: 'contact',
			data: {
				email: cvData.personal.contact.email,
				phone: cvData.personal.contact.phone,
				socials: cvData.socials as Record<string, string>
			}
		}
	});

	return pages;
}
