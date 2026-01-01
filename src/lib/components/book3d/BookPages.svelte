<script lang="ts">
	/**
	 * BookPages Component
	 * Manages individual page geometry and page-turning animations
	 * Uses GSAP for smooth animations
	 *
	 * @component
	 */

	import { T } from '@threlte/core';
	import gsap from 'gsap';
	import type { BookPage } from '$lib/types/book';
	import type { Group } from 'three';

	interface Props {
		pages: BookPage[];
		currentPageIndex: number;
		isAnimating?: boolean;
	}

	let { pages, currentPageIndex }: Props = $props();

	// Page dimensions
	const PAGE_WIDTH = 2;
	const PAGE_HEIGHT = 2.8;
	const PAGE_THICKNESS = 0.02;
	const SPINE_WIDTH = 0.15;

	// Store references to page meshes using $state for reactivity
	let pageGroups = $state<Group[]>([]);

	// Track previous page index for animation direction
	let previousPageIndex = $state(0);

	// Animation effect - watch for page changes
	$effect(() => {
		// Create a local reference to track changes
		const current = currentPageIndex;
		const previous = previousPageIndex;

		if (current !== previous) {
			animatePageTurn(previous, current);
			previousPageIndex = current;
		}
	});

	/**
	 * Animates the page turning effect using GSAP
	 */
	function animatePageTurn(fromPage: number, toPage: number) {
		const direction = toPage > fromPage ? 1 : -1;
		const pagesToAnimate = Math.abs(toPage - fromPage);

		// Animate each page between fromPage and toPage
		for (let i = 0; i < pagesToAnimate; i++) {
			const pageIndex = direction > 0 ? fromPage + i : fromPage - i;
			const pageGroup = pageGroups[pageIndex];

			if (!pageGroup) continue;

			const targetRotation = direction > 0 ? -Math.PI : 0;

			gsap.to(pageGroup.rotation, {
				y: targetRotation,
				duration: 0.8,
				ease: 'power2.inOut',
				delay: i * 0.1, // Stagger effect
				onComplete: () => {
					// Animation complete
				}
			});
		}
	}

	/**
	 * Calculate page position based on index
	 */
	function getPagePosition(index: number): [number, number, number] {
		const isLeft = index < currentPageIndex;
		const xOffset = isLeft ? -PAGE_WIDTH / 2 - SPINE_WIDTH / 2 : PAGE_WIDTH / 2 + SPINE_WIDTH / 2;
		const zOffset = index * PAGE_THICKNESS * 0.1; // Slight stacking
		return [xOffset, 0, zOffset];
	}

	/**
	 * Calculate initial rotation for page (left vs right)
	 */
	function getInitialRotation(index: number): [number, number, number] {
		const isLeft = index < currentPageIndex;
		return [0, isLeft ? -Math.PI : 0, 0];
	}
</script>

<!-- Book Group Container -->
<T.Group>
	{#each pages as page, index (page.id)}
		<T.Group
			bind:ref={pageGroups[index]}
			position={getPagePosition(index)}
			rotation={getInitialRotation(index)}
		>
			<!-- Page Front -->
			<T.Mesh castShadow receiveShadow>
				<T.BoxGeometry args={[PAGE_WIDTH, PAGE_HEIGHT, PAGE_THICKNESS]} />
				<T.MeshStandardMaterial
					color="#f8f8f8"
					roughness={0.6}
					metalness={0.1}
				/>
			</T.Mesh>

			<!-- Page Content (HTML/CSS to 3D texture - simplified for now) -->
			<!-- In production, you'd use Canvas2D or HTML2Canvas to render content as texture -->
			<T.Mesh position={[0, 0, PAGE_THICKNESS / 2 + 0.001]}>
				<T.PlaneGeometry args={[PAGE_WIDTH * 0.9, PAGE_HEIGHT * 0.9]} />
				<T.MeshBasicMaterial
					color="#ffffff"
					transparent
					opacity={0.9}
				/>
			</T.Mesh>

			<!-- Page Number Indicator -->
			{#if page.pageNumber >= 0}
				<T.Mesh position={[0, -PAGE_HEIGHT / 2 + 0.2, PAGE_THICKNESS / 2 + 0.002]}>
					<T.PlaneGeometry args={[0.3, 0.15]} />
					<T.MeshBasicMaterial color="#333333" />
				</T.Mesh>
			{/if}
		</T.Group>
	{/each}
</T.Group>
