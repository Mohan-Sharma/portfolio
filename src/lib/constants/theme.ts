/**
 * Theme Constants
 * Modern color palette and design tokens
 */

export const COLORS = {
	light: {
		bgPrimary: '#f2f2f7',
		bgSecondary: '#e5e5ea',
		textPrimary: '#1c1c1e',
		textSecondary: '#8e8e93',
		accent: '#a64b35',
		accentSecondary: '#88b04b',
		border: '#e5e5ea'
	},
	dark: {
		bgPrimary: '#08080a',
		bgSecondary: '#141418',
		textPrimary: '#ffffff',
		textSecondary: '#8e8e93',
		accent: '#e27d60',
		accentSecondary: '#ffb347',
		border: '#1c1c1e'
	}
} as const;

export const MATERIAL_PROPERTIES = {
	light: {
		roughness: 0.4,
		metalness: 0.1
	},
	dark: {
		roughness: 0.2,
		metalness: 0.8
	}
} as const;

export const TRANSITIONS = {
	fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
	base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
	slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)'
} as const;

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';
export type ColorPalette = typeof COLORS.light | typeof COLORS.dark;
