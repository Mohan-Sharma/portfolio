/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class', // Enable class-based dark mode
	theme: {
		extend: {
			colors: {
				// 🌑 Dark Mode: "Anodized Obsidian" - Deep blacks with burnt metal accents
				'void': '#08080a', // Darkest neutral (background)
				'surface': '#141418', // Cards/surfaces (solid, use with opacity in classes)
				'copper': '#e27d60', // Warm accent (primary CTA)
				'steel': '#8e8e93', // Neutral gray (text/borders)
				'amber': '#FFB347', // Highlight accent
				'text-main-dark': '#e6e9ef', // Main text in dark mode
				'text-sub-dark': '#8e8e93', // Secondary text in dark mode

				// ☀️ Light Mode: "Liquid Pearl" - High-chroma neutrals, art gallery feel
				'gallery': '#f2f2f7', // Background (light)
				'mercury': '#e5e5ea', // Cards/surfaces (solid, use with opacity in classes)
				'terracotta': '#a64b35', // Warm accent (light mode primary)
				'obsidian-ink': '#1c1c1e', // Text (light mode)
				'text-sub-light': '#636366', // Secondary text in light mode
				'sage': '#88B04B' // Soft green accent
			},
			fontFamily: {
				sans: ['Aptos', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif']
			},
			backdropBlur: {
				'chrome': '25px' // Changed from 20px to match HTML reference
			},
			keyframes: {
				fadeInScale: {
					'0%': { opacity: '0', transform: 'scale(0.5)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				fadeInUp: {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				fadeInScale: 'fadeInScale 0.6s ease-out',
				fadeInUp: 'fadeInUp 0.6s ease-out'
			}
		}
	},
	plugins: []
};
