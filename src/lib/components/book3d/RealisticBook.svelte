<script lang="ts">
	/**
	 * RealisticBook Component
	 * Three.js based realistic book with page-turning animation
	 * Displays two pages at once (left and right) like an opened book
	 */

	import { onMount, onDestroy } from 'svelte';
	import * as THREE from 'three';
	import type { BookPage } from '$lib/types/book';

	interface Props {
		pages: BookPage[];
		currentPageIndex?: number;
		onPageChange?: (index: number) => void;
	}

	let { pages, currentPageIndex = 0, onPageChange }: Props = $props();

	let container: HTMLDivElement;
	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let renderer: THREE.WebGLRenderer;
	let bookGroup: THREE.Group;
	let leftPage: THREE.Mesh;
	let rightPage: THREE.Mesh;
	let turningPage: THREE.Mesh | null = null;
	let isAnimating = $state(false);
	let animationId: number;

	// Book dimensions (in Three.js units)
	const BOOK_WIDTH = 4;
	const BOOK_HEIGHT = 5.5;
	const PAGE_THICKNESS = 0.01;

	onMount(() => {
		initThreeJS();
		createBook();
		updatePages();
		animate();

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	onDestroy(() => {
		if (animationId) {
			cancelAnimationFrame(animationId);
		}
		if (renderer) {
			renderer.dispose();
		}
	});

	function initThreeJS() {
		// Scene setup
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0x4a3728); // Wooden table color

		// Camera setup - positioned to view the book from slightly above
		camera = new THREE.PerspectiveCamera(
			45,
			container.clientWidth / container.clientHeight,
			0.1,
			1000
		);
		camera.position.set(0, 8, 12);
		camera.lookAt(0, 0, 0);

		// Renderer setup
		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		container.appendChild(renderer.domElement);

		// Lighting
		// Ambient light for overall illumination
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
		scene.add(ambientLight);

		// Directional light from above-left (like a desk lamp)
		const directionalLight = new THREE.DirectionalLight(0xfff8e1, 0.8);
		directionalLight.position.set(-5, 10, 5);
		directionalLight.castShadow = true;
		directionalLight.shadow.camera.left = -10;
		directionalLight.shadow.camera.right = 10;
		directionalLight.shadow.camera.top = 10;
		directionalLight.shadow.camera.bottom = -10;
		scene.add(directionalLight);

		// Warm spot light for book highlighting
		const spotLight = new THREE.SpotLight(0xffd4a3, 0.5);
		spotLight.position.set(0, 8, 8);
		spotLight.angle = Math.PI / 6;
		spotLight.penumbra = 0.3;
		spotLight.castShadow = true;
		scene.add(spotLight);

		// Add wooden table plane
		const tableGeometry = new THREE.PlaneGeometry(20, 20);
		const tableTexture = createWoodTexture();
		const tableMaterial = new THREE.MeshStandardMaterial({
			map: tableTexture,
			roughness: 0.8,
			metalness: 0.1
		});
		const table = new THREE.Mesh(tableGeometry, tableMaterial);
		table.rotation.x = -Math.PI / 2;
		table.position.y = -PAGE_THICKNESS;
		table.receiveShadow = true;
		scene.add(table);
	}

	function createWoodTexture(): THREE.CanvasTexture {
		const canvas = document.createElement('canvas');
		canvas.width = 512;
		canvas.height = 512;
		const ctx = canvas.getContext('2d')!;

		// Create wood grain effect
		const gradient = ctx.createLinearGradient(0, 0, 512, 512);
		gradient.addColorStop(0, '#6b5344');
		gradient.addColorStop(0.5, '#8b7355');
		gradient.addColorStop(1, '#6b5344');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, 512, 512);

		// Add noise for texture
		for (let i = 0; i < 5000; i++) {
			ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.1})`;
			ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, Math.random() * 50);
		}

		return new THREE.CanvasTexture(canvas);
	}

	function createBook() {
		bookGroup = new THREE.Group();

		// Create book spine (center binding)
		const spineGeometry = new THREE.BoxGeometry(0.2, BOOK_HEIGHT, PAGE_THICKNESS);
		const spineMaterial = new THREE.MeshStandardMaterial({
			color: 0x2c1810,
			roughness: 0.7,
			metalness: 0.1
		});
		const spine = new THREE.Mesh(spineGeometry, spineMaterial);
		spine.castShadow = true;
		bookGroup.add(spine);

		// Create left page
		const leftPageGeometry = new THREE.PlaneGeometry(BOOK_WIDTH, BOOK_HEIGHT);
		const leftPageMaterial = new THREE.MeshStandardMaterial({
			color: 0xfff8dc,
			side: THREE.DoubleSide,
			roughness: 0.9,
			metalness: 0.0
		});
		leftPage = new THREE.Mesh(leftPageGeometry, leftPageMaterial);
		leftPage.position.x = -BOOK_WIDTH / 2 - 0.1;
		leftPage.castShadow = true;
		leftPage.receiveShadow = true;
		bookGroup.add(leftPage);

		// Create right page
		const rightPageGeometry = new THREE.PlaneGeometry(BOOK_WIDTH, BOOK_HEIGHT);
		const rightPageMaterial = new THREE.MeshStandardMaterial({
			color: 0xfff8dc,
			side: THREE.DoubleSide,
			roughness: 0.9,
			metalness: 0.0
		});
		rightPage = new THREE.Mesh(rightPageGeometry, rightPageMaterial);
		rightPage.position.x = BOOK_WIDTH / 2 + 0.1;
		rightPage.castShadow = true;
		rightPage.receiveShadow = true;
		bookGroup.add(rightPage);

		// Add book shadow catcher
		const shadowGeometry = new THREE.PlaneGeometry(BOOK_WIDTH * 2.5, BOOK_HEIGHT * 1.5);
		const shadowMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
		const shadowPlane = new THREE.Mesh(shadowGeometry, shadowMaterial);
		shadowPlane.rotation.x = -Math.PI / 2;
		shadowPlane.position.y = -PAGE_THICKNESS - 0.01;
		shadowPlane.receiveShadow = true;
		bookGroup.add(shadowPlane);

		scene.add(bookGroup);
	}

	function createPageTexture(page: BookPage, isLeft: boolean): THREE.CanvasTexture {
		const canvas = document.createElement('canvas');
		const scale = 2; // Higher resolution
		canvas.width = 512 * scale;
		canvas.height = 700 * scale;
		const ctx = canvas.getContext('2d')!;

		// Background - aged paper
		const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
		gradient.addColorStop(0, '#fef9e7');
		gradient.addColorStop(1, '#f8f4e1');
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Add paper texture
		ctx.fillStyle = 'rgba(139, 119, 101, 0.02)';
		for (let i = 0; i < 500; i++) {
			ctx.fillRect(
				Math.random() * canvas.width,
				Math.random() * canvas.height,
				Math.random() * 3,
				Math.random() * 3
			);
		}

		// Page margins
		const margin = 80 * scale;
		const contentWidth = canvas.width - margin * 2;
		const contentHeight = canvas.height - margin * 2;

		// Page number (bottom corner)
		ctx.fillStyle = '#8b7355';
		ctx.font = `${24 * scale}px "Times New Roman", serif`;
		ctx.textAlign = isLeft ? 'left' : 'right';
		ctx.fillText(
			String(page.pageNumber + 1),
			isLeft ? margin : canvas.width - margin,
			canvas.height - margin / 2
		);

		// Content based on page type
		ctx.fillStyle = '#2c2416';
		ctx.textAlign = 'left';

		if (page.content.type === 'cover') {
			// Cover page styling
			ctx.font = `bold ${48 * scale}px "Times New Roman", serif`;
			ctx.textAlign = 'center';
			const titleY = canvas.height / 2 - 100 * scale;
			wrapText(ctx, page.content.data.name, canvas.width / 2, titleY, contentWidth, 60 * scale);

			ctx.font = `${32 * scale}px "Times New Roman", serif`;
			wrapText(
				ctx,
				page.content.data.title,
				canvas.width / 2,
				titleY + 100 * scale,
				contentWidth,
				40 * scale
			);
		} else {
			// Regular content pages
			ctx.font = `bold ${36 * scale}px "Times New Roman", serif`;
			ctx.fillText(page.title, margin, margin + 40 * scale);

			// Content text
			ctx.font = `${20 * scale}px "Georgia", serif`;
			let yPos = margin + 100 * scale;
			const lineHeight = 32 * scale;

			// Render content based on type
			const contentText = getPageContentText(page);
			wrapText(ctx, contentText, margin, yPos, contentWidth, lineHeight);
		}

		const texture = new THREE.CanvasTexture(canvas);
		texture.needsUpdate = true;
		return texture;
	}

	function getPageContentText(page: BookPage): string {
		switch (page.content.type) {
			case 'about':
				return page.content.data.bio;
			case 'experience':
				return page.content.data.items
					.map((exp) => `${exp.title} at ${exp.company}\n${exp.duration}`)
					.join('\n\n');
			case 'skills':
				return Object.entries(page.content.data.categories)
					.map(([cat, skills]) => `${cat}:\n${skills.join(', ')}`)
					.join('\n\n');
			case 'contact':
				return `Email: ${page.content.data.email}\nPhone: ${page.content.data.phone}`;
			default:
				return page.title;
		}
	}

	function wrapText(
		ctx: CanvasRenderingContext2D,
		text: string,
		x: number,
		y: number,
		maxWidth: number,
		lineHeight: number
	) {
		const words = text.split(' ');
		let line = '';
		let yPos = y;

		for (let i = 0; i < words.length; i++) {
			const testLine = line + words[i] + ' ';
			const metrics = ctx.measureText(testLine);

			if (metrics.width > maxWidth && i > 0) {
				ctx.fillText(line, x, yPos);
				line = words[i] + ' ';
				yPos += lineHeight;
			} else {
				line = testLine;
			}
		}
		ctx.fillText(line, x, yPos);
	}

	function updatePages() {
		const leftPageIndex = Math.floor(currentPageIndex / 2) * 2;
		const rightPageIndex = leftPageIndex + 1;

		// Update left page
		if (leftPageIndex < pages.length) {
			const leftTexture = createPageTexture(pages[leftPageIndex], true);
			(leftPage.material as THREE.MeshStandardMaterial).map = leftTexture;
			(leftPage.material as THREE.MeshStandardMaterial).needsUpdate = true;
		}

		// Update right page
		if (rightPageIndex < pages.length) {
			const rightTexture = createPageTexture(pages[rightPageIndex], false);
			(rightPage.material as THREE.MeshStandardMaterial).map = rightTexture;
			(rightPage.material as THREE.MeshStandardMaterial).needsUpdate = true;
		}
	}

	function animatePageTurn(direction: 'next' | 'prev') {
		if (isAnimating) return;
		isAnimating = true;

		// Create turning page
		const turningGeometry = new THREE.PlaneGeometry(BOOK_WIDTH, BOOK_HEIGHT, 20, 1);
		const turningMaterial = new THREE.MeshStandardMaterial({
			color: 0xfff8dc,
			side: THREE.DoubleSide,
			roughness: 0.9
		});
		turningPage = new THREE.Mesh(turningGeometry, turningMaterial);
		turningPage.position.x = direction === 'next' ? BOOK_WIDTH / 2 + 0.1 : -BOOK_WIDTH / 2 - 0.1;

		bookGroup.add(turningPage);

		const duration = 1000; // 1 second animation
		const startTime = Date.now();

		function animate() {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const eased = easeInOutCubic(progress);

			if (turningPage) {
				// Curl the page using vertex manipulation
				const positions = turningPage.geometry.attributes.position;
				for (let i = 0; i < positions.count; i++) {
					const x = positions.getX(i);
					const normalized = (x + BOOK_WIDTH / 2) / BOOK_WIDTH;

					if (direction === 'next') {
						const curl = Math.sin(normalized * Math.PI) * eased;
						positions.setZ(i, curl * 0.5);
						positions.setX(i, x - eased * BOOK_WIDTH);
					} else {
						const curl = Math.sin((1 - normalized) * Math.PI) * eased;
						positions.setZ(i, curl * 0.5);
						positions.setX(i, x + eased * BOOK_WIDTH);
					}
				}
				positions.needsUpdate = true;
			}

			if (progress < 1) {
				requestAnimationFrame(animate);
			} else {
				// Animation complete
				if (turningPage) {
					bookGroup.remove(turningPage);
					turningPage = null;
				}
				updatePages();
				isAnimating = false;
			}
		}

		animate();
	}

	function easeInOutCubic(t: number): number {
		return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
	}

	function animate() {
		animationId = requestAnimationFrame(animate);
		renderer.render(scene, camera);
	}

	function handleResize() {
		if (!container || !camera || !renderer) return;

		camera.aspect = container.clientWidth / container.clientHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(container.clientWidth, container.clientHeight);
	}

	export function nextPage() {
		if (currentPageIndex < pages.length - 2 && !isAnimating) {
			const newIndex = currentPageIndex + 2;
			onPageChange?.(newIndex);
			animatePageTurn('next');
		}
	}

	export function previousPage() {
		if (currentPageIndex > 0 && !isAnimating) {
			const newIndex = currentPageIndex - 2;
			onPageChange?.(newIndex);
			animatePageTurn('prev');
		}
	}

	// Watch for external page changes
	$effect(() => {
		if (leftPage && rightPage) {
			updatePages();
		}
	});
</script>

<div class="realistic-book-container" bind:this={container}>
	<!-- Navigation overlay -->
	<div class="book-navigation">
		<button
			class="nav-btn prev-btn"
			disabled={currentPageIndex === 0 || isAnimating}
			onclick={previousPage}
			aria-label="Previous pages"
		>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>

		<div class="page-info">
			<span>Pages {currentPageIndex + 1}-{Math.min(currentPageIndex + 2, pages.length)}</span>
			<span class="divider">•</span>
			<span>{pages.length} total</span>
		</div>

		<button
			class="nav-btn next-btn"
			disabled={currentPageIndex >= pages.length - 2 || isAnimating}
			onclick={nextPage}
			aria-label="Next pages"
		>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	</div>
</div>

<style>
	.realistic-book-container {
		width: 100%;
		height: 100vh;
		position: relative;
		overflow: hidden;
		background: linear-gradient(135deg, #4a3728 0%, #5c4633 100%);
	}

	.book-navigation {
		position: absolute;
		bottom: 3rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 2rem;
		padding: 1rem 2rem;
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(10px);
		border-radius: 9999px;
		z-index: 10;
	}

	.nav-btn {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.nav-btn:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.2);
		transform: scale(1.1);
	}

	.nav-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.page-info {
		color: white;
		font-size: 0.875rem;
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.divider {
		opacity: 0.5;
	}

	@media (max-width: 768px) {
		.book-navigation {
			bottom: 1.5rem;
			padding: 0.75rem 1.5rem;
			gap: 1rem;
		}

		.nav-btn {
			width: 2.5rem;
			height: 2.5rem;
		}

		.page-info {
			font-size: 0.75rem;
		}
	}
</style>
