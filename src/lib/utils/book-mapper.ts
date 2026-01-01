/**
 * Maps CV data to book page structure - CORRECTED Architecture
 *
 * CRITICAL Page Side Rules:
 * - Page 0, 2, 4, 6, 8... = LEFT pages (even numbers)
 * - Page 1, 3, 5, 7, 9... = RIGHT pages (odd numbers)
 * - Chapter titles ALWAYS on RIGHT pages (odd: 3, 5, 7, 9, 11...)
 * - Content ALWAYS on LEFT pages (even: 4, 6, 8, 10, 12...)
 *
 * Book Structure:
 * 0 (L) + 1 (R) = Table of Contents spread
 * 2 (L) = [Blank if needed]
 * 3 (R) = Chapter 1 Title
 * 4 (L) = Chapter 1 Content
 * 5 (R) = Chapter 2 Title
 * 6 (L) = Chapter 2 Content
 * ... and so on
 *
 * Projects Special Case:
 * After Chapter 3 Title (RIGHT), we have:
 * - Next LEFT: Projects Overview
 * - Then: Each project as LEFT+RIGHT spread (hero on left, details on right)
 */

import type { CVData } from '$lib/schemas/cv.schema';
import type { BookPage, TOCChapter } from '$lib/types/book';

export function mapCVDataToBookPages(cvData: CVData, yearsOfExperience: number): BookPage[] {
	const pages: BookPage[] = [];
	const chapters: TOCChapter[] = [];

	// Helper to determine side
	const getSide = (num: number): 'left' | 'right' => (num % 2 === 0 ? 'left' : 'right');

	// Helper to add a blank page
	const addBlank = (num: number) => {
		pages.push({
			id: `blank-${num}`,
			pageNumber: num,
			title: '',
			side: getSide(num),
			content: {
				type: 'blank',
				data: {}
			}
		});
	};

	let pageNum = 0;

	// ===== PAGE 0-1: TABLE OF CONTENTS =====
	pages.push({
		id: 'toc-left',
		pageNumber: pageNum++, // 0 (LEFT)
		title: 'Table of Contents',
		side: getSide(pageNum - 1),
		content: {
			type: 'toc',
			data: { chapters: [] }
		}
	});

	pages.push({
		id: 'toc-right',
		pageNumber: pageNum++, // 1 (RIGHT)
		title: 'Table of Contents',
		side: getSide(pageNum - 1),
		content: {
			type: 'toc',
			data: { chapters: [] }
		}
	});

	// ===== PAGE 2: BLANK (to make chapter 1 start on page 3 = RIGHT) =====
	//addBlank(pageNum++); // 2 (LEFT)

	// ===== CHAPTER 1: ABOUT ME =====
	// Chapter title MUST be on RIGHT page (3)
	chapters.push({
		number: 1,
		title: 'About Me',
		pageNumber: pageNum
	});

	pages.push({
		id: 'chapter-1-title',
		pageNumber: pageNum++, // 3 (RIGHT)
		title: 'Chapter One',
		side: getSide(pageNum - 1),
		content: {
			type: 'chapter-title',
			data: {
				number: 1,
				title: 'About Me',
				subtitle: 'My Journey & Expertise'
			}
		}
	});

	// Content on LEFT page (4)
	pages.push({
		id: 'about',
		pageNumber: pageNum++, // 4 (LEFT)
		title: 'About Me',
		side: getSide(pageNum - 1),
		content: {
			type: 'about',
			data: {
				bio: cvData.personal.bio,
				location: `${cvData.personal.location.city}, ${cvData.personal.location.country}`,
				yearsOfExperience
			}
		}
	});

	// ===== CHAPTER 2: PROFESSIONAL EXPERIENCE =====
	// Chapter title on RIGHT page (5)
	chapters.push({
		number: 2,
		title: 'Professional Experience',
		pageNumber: pageNum
	});

	pages.push({
		id: 'chapter-2-title',
		pageNumber: pageNum++, // 5 (RIGHT)
		title: 'Chapter Two',
		side: getSide(pageNum - 1),
		content: {
			type: 'chapter-title',
			data: {
				number: 2,
				title: 'Professional Experience',
				subtitle: `${yearsOfExperience}+ Years of Building Enterprise Systems`
			}
		}
	});

	// Content on LEFT page (6)
	pages.push({
		id: 'experience',
		pageNumber: pageNum++, // 6 (LEFT)
		title: 'Professional Experience',
		side: getSide(pageNum - 1),
		content: {
			type: 'experience',
			data: {
				items: cvData.experience.map((exp) => ({
					title: exp.title,
					company: exp.company,
					duration: exp.current ? `${exp.startDate} - Present` : `${exp.startDate} - ${exp.endDate}`,
					technologies: exp.technologies,
					description: exp.description
				}))
			}
		}
	});

	// ===== CHAPTER 3: FEATURED PROJECTS =====
	// Chapter title on RIGHT page (7)
	chapters.push({
		number: 3,
		title: 'Featured Projects',
		pageNumber: pageNum
	});

	pages.push({
		id: 'chapter-3-title',
		pageNumber: pageNum++, // 7 (RIGHT)
		title: 'Chapter Three',
		side: getSide(pageNum - 1),
		content: {
			type: 'chapter-title',
			data: {
				number: 3,
				title: 'Featured Projects',
				subtitle: `${cvData.projects.length} Projects Across AI, Integration & Commerce`
			}
		}
	});

	// Projects Overview on LEFT page (8)
	pages.push({
		id: 'projects-overview',
		pageNumber: pageNum++, // 8 (LEFT)
		title: 'Projects Overview',
		side: getSide(pageNum - 1),
		content: {
			type: 'projects-intro',
			data: {
				intro: 'A showcase of my most impactful work spanning AI governance, enterprise integration, and e-commerce platforms.',
				projects: cvData.projects.map((p) => ({
					id: p.id,
					title: p.title,
					oneLiner: p.description.split('.')[0] + '.',
					tags: p.tags
				}))
			}
		}
	});

	// Each project gets 2-page spread: LEFT (hero) + RIGHT (details)
	cvData.projects.forEach((project) => {
		// Ensure we're starting on a LEFT page for project hero
		if (pageNum % 2 !== 0) {
			// We're on RIGHT, need to add blank to get to LEFT
			addBlank(pageNum++);
		}

		// LEFT page: Project hero
		pages.push({
			id: `project-${project.id}-left`,
			pageNumber: pageNum++,
			title: project.title,
			side: getSide(pageNum - 1),
			content: {
				type: 'project-spread-left',
				data: {
					title: project.title,
					subtitle: project.subtitle || '',
					company: project.company || '',
					duration: project.duration || '',
					oneLiner: project.description.split('.')[0] + '.',
					featured: project.featured,
					tags: project.tags
				}
			}
		});

		// RIGHT page: Project details
		pages.push({
			id: `project-${project.id}-right`,
			pageNumber: pageNum++,
			title: project.title,
			side: getSide(pageNum - 1),
			content: {
				type: 'project-spread-right',
				data: {
					description: project.description,
					techStack: project.techStack,
					highlights: project.highlights
				}
			}
		});
	});

	// ===== CHAPTER 4: TECHNICAL SKILLS =====

	chapters.push({
		number: 4,
		title: 'Technical Skills',
		pageNumber: pageNum
	});

	pages.push({
		id: 'chapter-4-title',
		pageNumber: pageNum++,
		title: 'Chapter Four',
		side: getSide(pageNum - 1),
		content: {
			type: 'chapter-title',
			data: {
				number: 4,
				title: 'Technical Skills',
				subtitle: 'Tools & Technologies I Master'
			}
		}
	});

	// Content on LEFT
	pages.push({
		id: 'skills',
		pageNumber: pageNum++,
		title: 'Technical Skills',
		side: getSide(pageNum - 1),
		content: {
			type: 'skills',
			data: {
				categories: cvData.skills
			}
		}
	});

	// ===== CHAPTER 5: EDUCATION =====

	chapters.push({
		number: 5,
		title: 'Education',
		pageNumber: pageNum
	});

	pages.push({
		id: 'chapter-5-title',
		pageNumber: pageNum++,
		title: 'Chapter Five',
		side: getSide(pageNum - 1),
		content: {
			type: 'chapter-title',
			data: {
				number: 5,
				title: 'Education',
				subtitle: 'Academic Foundation & Certifications'
			}
		}
	});

	pages.push({
		id: 'education',
		pageNumber: pageNum++,
		title: 'Education',
		side: getSide(pageNum - 1),
		content: {
			type: 'education',
			data: {
				items: cvData.education
			}
		}
	});

	// ===== CHAPTER 6: GET IN TOUCH =====

	chapters.push({
		number: 6,
		title: 'Get In Touch',
		pageNumber: pageNum
	});

	pages.push({
		id: 'chapter-6-title',
		pageNumber: pageNum++,
		title: 'Chapter Six',
		side: getSide(pageNum - 1),
		content: {
			type: 'chapter-title',
			data: {
				number: 6,
				title: 'Get In Touch',
				subtitle: "Let's Build Something Amazing Together"
			}
		}
	});

	pages.push({
		id: 'contact',
		pageNumber: pageNum++,
		title: 'Get In Touch',
		side: getSide(pageNum - 1),
		content: {
			type: 'contact',
			data: {
				email: cvData.personal.contact.email,
				phone: cvData.personal.contact.phone,
				socials: cvData.socials as Record<string, string>
			}
		}
	});

	// ===== CHAPTER 7: CLOSING THOUGHTS =====

	chapters.push({
		number: 7,
		title: 'Closing Thoughts',
		pageNumber: pageNum
	});

	pages.push({
		id: 'chapter-7-title',
		pageNumber: pageNum++,
		title: 'Chapter Seven',
		side: getSide(pageNum - 1),
		content: {
			type: 'chapter-title',
			data: {
				number: 7,
				title: 'Closing Thoughts',
				subtitle: 'Thank You for Reading'
			}
		}
	});

	pages.push({
		id: 'closing',
		pageNumber: pageNum++,
		title: 'Closing Thoughts',
		side: getSide(pageNum - 1),
		content: {
			type: 'closing',
			data: {
				title: 'Thank You',
				message: `Thank you for taking the time to explore my portfolio. With over ${yearsOfExperience} years of experience in enterprise software development, I'm passionate about building scalable, secure, and maintainable systems that solve real-world problems.\n\nI'm always excited to discuss new opportunities, collaborate on interesting projects, or simply connect with fellow engineers. Feel free to reach out through any of the channels provided in the previous pages.\n\nLet's build something amazing together!`
			}
		}
	});

	// ===== FILL TOC WITH CHAPTERS =====
	const tocLeft = pages.find((p) => p.id === 'toc-left');
	const tocRight = pages.find((p) => p.id === 'toc-right');

	if (tocLeft && tocLeft.content.type === 'toc') {
		tocLeft.content.data.chapters = chapters;
	}
	if (tocRight && tocRight.content.type === 'toc') {
		tocRight.content.data.chapters = chapters;
	}

	return pages;
}

export function getCoverData(cvData: CVData) {
	return {
		name: cvData.personal.name,
		title: cvData.personal.title,
		tagline: cvData.personal.tagline
	};
}
