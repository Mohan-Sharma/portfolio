<script lang="ts">
	/**
	 * Page Content Router
	 * Routes to appropriate page component based on content type
	 */

	import type { BookPage } from '$lib/types/book';
	import CoverPage from './pages/CoverPage.svelte';
	import TableOfContentsPage from './pages/TableOfContentsPage.svelte';
	import ChapterTitlePage from './pages/ChapterTitlePage.svelte';
	import AboutPage from './pages/AboutPage.svelte';
	import ExperiencePage from './pages/ExperiencePage.svelte';
	import ProjectsIntroPage from './pages/ProjectsIntroPage.svelte';
	import ProjectSpreadLeftPage from './pages/ProjectSpreadLeftPage.svelte';
	import ProjectSpreadRightPage from './pages/ProjectSpreadRightPage.svelte';
	import SkillsPage from './pages/SkillsPage.svelte';
	import EducationPage from './pages/EducationPage.svelte';
	import AchievementsPage from './pages/AchievementsPage.svelte';
	import ContactPage from './pages/ContactPage.svelte';
	import ClosingPage from './pages/ClosingPage.svelte';
	import BlankPage from './pages/BlankPage.svelte';

	interface Props {
		page: BookPage;
		onChapterClick?: (pageNumber: number) => void;
	}

	let { page, onChapterClick }: Props = $props();
</script>

<div class="w-full h-full overflow-hidden">
	{#if page.content.type === 'cover'}
		<CoverPage data={page.content.data} />
	{:else if page.content.type === 'toc'}
		<TableOfContentsPage data={page.content.data} side={page.side} {onChapterClick} />
	{:else if page.content.type === 'chapter-title'}
		<ChapterTitlePage data={page.content.data} />
	{:else if page.content.type === 'about'}
		<AboutPage data={page.content.data} />
	{:else if page.content.type === 'experience'}
		<ExperiencePage data={page.content.data} />
	{:else if page.content.type === 'projects-intro'}
		<ProjectsIntroPage data={page.content.data} />
	{:else if page.content.type === 'project-spread-left'}
		<ProjectSpreadLeftPage data={page.content.data} />
	{:else if page.content.type === 'project-spread-right'}
		<ProjectSpreadRightPage data={page.content.data} />
	{:else if page.content.type === 'skills'}
		<SkillsPage data={page.content.data} />
	{:else if page.content.type === 'education'}
		<EducationPage data={page.content.data} />
	{:else if page.content.type === 'achievements'}
		<AchievementsPage data={page.content.data} />
	{:else if page.content.type === 'contact'}
		<ContactPage data={page.content.data} />
	{:else if page.content.type === 'closing'}
		<ClosingPage data={page.content.data} />
	{:else if page.content.type === 'blank'}
		<BlankPage />
	{/if}
</div>
