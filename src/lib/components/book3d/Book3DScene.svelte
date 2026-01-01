<script lang="ts">
	/**
	 * Book3DScene Component
	 * Main 3D book scene using Threlte for Three.js integration
	 * Renders the book at a reading angle with proper lighting
	 *
	 * @component
	 */

	import { Canvas } from '@threlte/core';
	import Book3D from './Book3D.svelte';
	import type { BookPage } from '$lib/types/book';

	interface Props {
		pages: BookPage[];
		currentPageIndex: number;
		isAnimating?: boolean;
	}

	let { pages, currentPageIndex, isAnimating = false }: Props = $props();
</script>

<div class="book-scene-container">
	<Canvas>
		<Book3D
			{pages}
			{currentPageIndex}
			{isAnimating}
		/>
	</Canvas>
</div>

<style>
	.book-scene-container {
		width: 100%;
		height: 100vh;
		position: relative;
		overflow: hidden;
	}
</style>
