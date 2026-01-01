<script lang="ts">
	/**
	 * Page Content Router
	 * Routes to appropriate page component based on content type
	 */

	import type { BookPage } from '$lib/types/book';
	import CoverPage from './pages/CoverPage.svelte';
	import AboutPage from './pages/AboutPage.svelte';
	import ExperiencePage from './pages/ExperiencePage.svelte';
	import ProjectsPage from './pages/ProjectsPage.svelte';
	import ProjectsIntroPage from './pages/ProjectsIntroPage.svelte';
	import ProjectDetailPage from './pages/ProjectDetailPage.svelte';
	import SkillsPage from './pages/SkillsPage.svelte';
	import EducationPage from './pages/EducationPage.svelte';
	import AchievementsPage from './pages/AchievementsPage.svelte';
	import ContactPage from './pages/ContactPage.svelte';

	interface Props {
		page: BookPage;
	}

	let { page }: Props = $props();
</script>

<div class="w-full h-full overflow-hidden">
	{#if page.content.type === 'cover'}
		<CoverPage data={page.content.data} />
	{:else if page.content.type === 'about'}
		<AboutPage data={page.content.data} />
	{:else if page.content.type === 'experience'}
		<ExperiencePage data={page.content.data} />
	{:else if page.content.type === 'projects'}
		<ProjectsPage data={page.content.data} />
	{:else if page.content.type === 'projects-intro'}
		<ProjectsIntroPage data={page.content.data} />
	{:else if page.content.type === 'project-detail'}
		<ProjectDetailPage data={page.content.data} />
	{:else if page.content.type === 'skills'}
		<SkillsPage data={page.content.data} />
	{:else if page.content.type === 'education'}
		<EducationPage data={page.content.data} />
	{:else if page.content.type === 'achievements'}
		<AchievementsPage data={page.content.data} />
	{:else if page.content.type === 'contact'}
		<ContactPage data={page.content.data} />
	{/if}
</div>
