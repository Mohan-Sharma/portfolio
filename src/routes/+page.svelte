<script lang="ts">
	/**
	 * Home Page - Interactive Book Card Portfolio
	 * Svelte 5 with runes
	 */

	import type { PageData } from './$types';
	import { mapCVDataToBookPages } from '$lib/utils/book-mapper';
	import BookSpreadView from '$lib/components/book/BookSpreadView.svelte';

	// Get data from page loader
	let { data }: { data: PageData } = $props();

	// Transform CV data into book pages
	let bookPages = $derived(mapCVDataToBookPages(data.cvData, data.yearsOfExperience));

	// Current page state
	let currentPageIndex = $state(0);

	function handlePageChange(newIndex: number) {
		currentPageIndex = newIndex;
	}
</script>

<svelte:head>
	<title>{data.cvData.personal.name} - {data.cvData.personal.title}</title>
	<meta name="description" content={data.cvData.personal.bio} />
</svelte:head>

<!-- Book Spread Portfolio -->
<BookSpreadView
	pages={bookPages}
	{currentPageIndex}
	onPageChange={handlePageChange}
/>
