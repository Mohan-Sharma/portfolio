/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class', // Critical for SvelteKit theme toggling
	theme: {
		extend: {
			fontFamily: {
				// Aptos first for Microsoft 365 users, falling back to Inter
				sans: ['Aptos', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif']
			},
			colors: {
				// Modern CSS Variable-based colors (mapped from app.css)
				background: 'hsl(var(--bg-main))',
				primary: 'hsl(var(--text-primary))',
				secondary: 'hsl(var(--text-secondary))',
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},

				// Legacy color names for backwards compatibility
				// 🌑 Dark Mode: "Ethereal Obsidian"
				'void': '#040508', // Dark background
				'surface': '#0D0F16', // Dark cards/surfaces
				'copper': '#e27d60', // Anodized Copper (original orange)
				'steel': '#94A3B8', // Subdued gray
				'text-main-dark': '#F8FAFC', // Main text in dark mode
				'text-sub-dark': '#94A3B8', // Secondary text in dark mode

				// ☀️ Light Mode: "Sun-Bleached Silk"
				'gallery': '#FBFBFA', // Light background
				'mercury': '#FFFFFF', // Light cards/surfaces
				'terracotta': '#a64b35', // Deep Terracotta (original orange)
				'obsidian-ink': '#0F172A', // Text (light mode)
				'text-sub-light': '#64748B', // Secondary text in light mode
				'amber': '#e27d60' // Orange accent
			},
			backgroundImage: {
				'ethereal-gradient': 'radial-gradient(circle at 50% 50%, hsl(var(--accent) / 0.15), transparent 60%)'
			},
			backdropBlur: {
				'chrome': '30px' // Increased for enhanced glassmorphism
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
