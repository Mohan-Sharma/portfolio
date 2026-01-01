<script lang="ts">
	/**
	 * Home Page - Interactive Book Card Portfolio
	 * Svelte 5 with runes
	 * Handles closed book → opening animation → open book spread flow
	 */

	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import type { PageData } from './$types';
	import { mapCVDataToBookPages, getCoverData } from '$lib/utils/book-mapper';
	import BookSpreadView from '$lib/components/book/BookSpreadView.svelte';
	import ClosedBookView from '$lib/components/book/ClosedBookView.svelte';
	import BookOpeningAnimation from '$lib/components/book/BookOpeningAnimation.svelte';

	// Get data from page loader
	let { data }: { data: PageData } = $props();

	// Transform CV data into book pages and cover
	let bookPages = $derived(mapCVDataToBookPages(data.cvData, data.yearsOfExperience));
	let coverData = $derived(getCoverData(data.cvData));

	// Book state management - added 'closing' for return to closed state
	let viewMode = $state<'closed' | 'opening' | 'open' | 'closing'>('closed');
	let currentPageIndex = $state(0);

	function handleOpenBook() {
		if (viewMode !== 'closed') return;
		viewMode = 'opening';
	}

	function handleAnimationComplete() {
		viewMode = 'open';
	}

	function handlePageChange(newIndex: number) {
		currentPageIndex = newIndex;
	}

	function handleCloseBook() {
		if (viewMode !== 'open') return;
		viewMode = 'closed';
		currentPageIndex = 0;
		scrollListenerActive = true;
	}

	// Scroll listener for opening/closing book
	let scrollListenerActive = $state(true);

	function handleScroll(event: WheelEvent) {
		// Open book: Scroll down on closed book
		if (viewMode === 'closed' && scrollListenerActive && event.deltaY > 0) {
			scrollListenerActive = false; // Prevent multiple triggers
			handleOpenBook();
		}

		// Close book (Trigger 1 of 3): Scroll up at first page
		if (viewMode === 'open' && currentPageIndex === 0 && event.deltaY < 0) {
			handleCloseBook();
		}
	}

	// Keyboard handler for ESC key (Trigger 3 of 3)
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape' && viewMode === 'open') {
			handleCloseBook();
		}
	}

	onMount(() => {
		// Scroll listener - always active
		window.addEventListener('wheel', handleScroll, { passive: true });

		// ESC key listener
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('wheel', handleScroll);
			window.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

<svelte:head>
	<title>{data.cvData.personal.name} - {data.cvData.personal.title}</title>
	<meta name="description" content={data.cvData.personal.bio} />
</svelte:head>

<div class="portfolio-container">
	{#if viewMode === 'opening'}
		<!-- Opening Animation -->
		<BookOpeningAnimation
			{coverData}
			pages={bookPages}
			onComplete={handleAnimationComplete}
		/>
	{:else if viewMode === 'closed'}
		<!-- Closed State -->
		<ClosedBookView {coverData} onOpen={handleOpenBook} />
	{:else if viewMode === 'open'}
		<!-- Open State -->
		<BookSpreadView
			pages={bookPages}
			{currentPageIndex}
			onPageChange={handlePageChange}
			onClose={handleCloseBook}
		/>
	{/if}
</div>

<style>
	.portfolio-container {
		position: relative;
		width: 100%;
		min-height: 100vh;
	}
</style>
