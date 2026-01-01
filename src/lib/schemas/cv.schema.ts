/**
 * Zod Schemas for CV Data
 * Provides runtime validation and type inference
 * Single source of truth for data validation
 */

import { z } from 'zod';

/**
 * Personal Information Schema
 */
export const PersonalInfoSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	title: z.string().min(1, 'Title is required'),
	tagline: z.string().min(1, 'Tagline is required'),
	bio: z.string().min(1, 'Bio is required'),
	location: z.object({
		city: z.string().min(1, 'City is required'),
		state: z.string().optional(),
		country: z.string().min(1, 'Country is required')
	}),
	contact: z.object({
		email: z.string().email('Invalid email format'),
		phone: z.string().min(1, 'Phone is required')
	})
});

/**
 * Social Links Schema
 */
export const SocialLinksSchema = z.object({
	linkedin: z.string().url('Invalid LinkedIn URL').optional(),
	github: z.string().url('Invalid GitHub URL').optional(),
	youtube: z.string().url('Invalid YouTube URL').optional(),
	twitter: z.string().url('Invalid Twitter URL').optional(),
	website: z.string().url('Invalid website URL').optional()
});

/**
 * Experience Schema
 */
export const ExperienceSchema = z.object({
	id: z.string().min(1, 'Experience ID is required'),
	title: z.string().min(1, 'Job title is required'),
	company: z.string().min(1, 'Company name is required'),
	location: z.string().min(1, 'Location is required'),
	startDate: z.string().min(1, 'Start date is required'),
	endDate: z.string().nullable(),
	current: z.boolean(),
	description: z.string().min(1, 'Description is required'),
	technologies: z.array(z.string()).min(1, 'At least one technology is required')
});

/**
 * Project Schema
 */
export const ProjectSchema = z.object({
	id: z.string().min(1, 'Project ID is required'),
	title: z.string().min(1, 'Project title is required'),
	subtitle: z.string().optional(),
	company: z.string().optional(),
	duration: z.string().min(1, 'Duration is required'),
	description: z.string().min(1, 'Description is required'),
	techStack: z.array(z.string()).min(1, 'At least one technology is required'),
	highlights: z.array(z.string()),
	impact: z.array(z.string()).optional(),
	featured: z.boolean(),
	image: z.string().optional(),
	liveUrl: z.string().url('Invalid live URL').optional().or(z.literal('')),
	githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
	tags: z.array(z.string())
});

/**
 * Education Schema
 */
export const EducationSchema = z.object({
	id: z.string().min(1, 'Education ID is required'),
	degree: z.string().min(1, 'Degree is required'),
	field: z.string().optional(),
	institution: z.string().min(1, 'Institution is required'),
	location: z.string().optional(),
	year: z.string().min(1, 'Year is required'),
	grade: z.string().optional(),
	description: z.string().optional()
});

/**
 * Achievement Schema
 */
export const AchievementSchema = z.object({
	id: z.string().min(1, 'Achievement ID is required'),
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required'),
	year: z.string().nullable().optional(),
	organization: z.string().optional(),
	category: z.string().optional()
});

/**
 * Skills Schema
 */
export const SkillsSchema = z.record(z.string(), z.array(z.string()));

/**
 * About Schema
 */
export const AboutSchema = z.object({
	summary: z.string().min(1, 'Summary is required'),
	bio: z.string().optional()
});

/**
 * Contact Schema
 */
export const ContactSchema = z.object({
	email: z.string().email('Invalid email format'),
	phone: z.string().optional(),
	location: z.string().optional(),
	availability: z.string().optional(),
	preferredContact: z.string().optional()
});

/**
 * Complete CV Data Schema
 */
export const CVDataSchema = z.object({
	personal: PersonalInfoSchema,
	socials: SocialLinksSchema,
	summary: z.string().min(1, 'Summary is required'),
	experience: z.array(ExperienceSchema),
	projects: z.array(ProjectSchema),
	skills: SkillsSchema,
	education: z.array(EducationSchema),
	achievements: z.array(AchievementSchema)
});

/**
 * Infer TypeScript types from Zod schemas
 * Single source of truth for types
 */
export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
export type SocialLinks = z.infer<typeof SocialLinksSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Achievement = z.infer<typeof AchievementSchema>;
export type Skills = z.infer<typeof SkillsSchema>;
export type About = z.infer<typeof AboutSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type CVData = z.infer<typeof CVDataSchema>;

/**
 * Export all schemas for reuse
 */
export const CVSchemas = {
	PersonalInfo: PersonalInfoSchema,
	SocialLinks: SocialLinksSchema,
	Experience: ExperienceSchema,
	Project: ProjectSchema,
	Education: EducationSchema,
	Achievement: AchievementSchema,
	Skills: SkillsSchema,
	About: AboutSchema,
	Contact: ContactSchema,
	CVData: CVDataSchema
} as const;
