/**
 * Book state management using Svelte 5 runes
 */

import type { BookState } from '$lib/types/book';

class BookStore {
	currentPage = $state(0);
	totalPages = $state(0);
	isAnimating = $state(false);

	nextPage() {
		if (this.isAnimating || this.currentPage >= this.totalPages - 1) return;
		this.isAnimating = true;
		this.currentPage++;
	}

	previousPage() {
		if (this.isAnimating || this.currentPage <= 0) return;
		this.isAnimating = true;
		this.currentPage--;
	}

	goToPage(pageNumber: number) {
		if (this.isAnimating || pageNumber < 0 || pageNumber >= this.totalPages) return;
		this.isAnimating = true;
		this.currentPage = pageNumber;
	}

	setTotalPages(total: number) {
		this.totalPages = total;
	}

	setAnimating(animating: boolean) {
		this.isAnimating = animating;
	}

	get state(): BookState {
		return {
			currentPage: this.currentPage,
			totalPages: this.totalPages,
			isAnimating: this.isAnimating
		};
	}
}

export const bookStore = new BookStore();
