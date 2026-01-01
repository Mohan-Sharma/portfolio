<script lang="ts">
	/**
	 * Book3D Component
	 * Core 3D book implementation with Threlte
	 * Handles camera, lighting, and book geometry
	 *
	 * @component
	 */

	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import BookPages from './BookPages.svelte';
	import type { BookPage } from '$lib/types/book';

	interface Props {
		pages: BookPage[];
		currentPageIndex: number;
		isAnimating?: boolean;
	}

	let { pages, currentPageIndex, isAnimating = false }: Props = $props();

	// Camera position for reading angle (slightly above and tilted)
	const cameraPosition: [number, number, number] = [0, 2, 5];
	const cameraRotation: [number, number, number] = [-0.3, 0, 0];
</script>

<!-- Scene Setup -->
<T.PerspectiveCamera
	makeDefault
	position={cameraPosition}
	rotation={cameraRotation}
	fov={50}
>
	<OrbitControls
		enableDamping
		dampingFactor={0.05}
		enableZoom={true}
		enablePan={false}
		maxPolarAngle={Math.PI / 2}
		minDistance={3}
		maxDistance={10}
	/>
</T.PerspectiveCamera>

<!-- Lighting -->
<!-- Ambient light for overall scene illumination -->
<T.AmbientLight intensity={0.4} />

<!-- Main directional light (reading lamp effect) -->
<T.DirectionalLight
	position={[5, 8, 5]}
	intensity={0.8}
	castShadow
/>

<!-- Fill light from opposite side -->
<T.DirectionalLight
	position={[-3, 4, -2]}
	intensity={0.3}
/>

<!-- Spot light for dramatic effect -->
<T.SpotLight
	position={[0, 10, 0]}
	intensity={0.5}
	angle={0.6}
	penumbra={0.5}
	castShadow
/>

<!-- Book Pages -->
<BookPages
	{pages}
	{currentPageIndex}
	{isAnimating}
/>

<!-- Optional: Desk/Table surface -->
<T.Mesh
	position={[0, -0.5, 0]}
	receiveShadow
>
	<T.BoxGeometry args={[20, 0.5, 15]} />
	<T.MeshStandardMaterial
		color="#2a2a2a"
		roughness={0.7}
		metalness={0.2}
	/>
</T.Mesh>

<!-- Optional: Background -->
<T.Mesh
	position={[0, 5, -10]}
	receiveShadow
>
	<T.PlaneGeometry args={[30, 20]} />
	<T.MeshStandardMaterial
		color="#1a1a1a"
		roughness={0.9}
	/>
</T.Mesh>
