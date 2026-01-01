/**
 * Scroll Handler Utility
 * Manages scroll-based page navigation with debouncing
 * Prevents rapid page changes and provides smooth navigation
 */

/**
 * Creates a debounced scroll handler for page navigation
 */
export function createScrollHandler(
	onPageChange: (direction: 'next' | 'prev') => void,
	debounceMs = 300
) {
	let isScrolling = false;
	let scrollTimeout: ReturnType<typeof setTimeout>;

	return (event: WheelEvent) => {
		if (isScrolling) return;

		const delta = event.deltaY;
		const threshold = 50; // Minimum scroll distance to trigger page change

		if (Math.abs(delta) < threshold) return;

		isScrolling = true;

		if (delta > 0) {
			// Scrolling down - next page
			onPageChange('next');
		} else {
			// Scrolling up - previous page
			onPageChange('prev');
		}

		// Reset scroll lock after debounce period
		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(() => {
			isScrolling = false;
		}, debounceMs);
	};
}

/**
 * Creates a touch handler for mobile swipe navigation
 */
export function createTouchHandler(onPageChange: (direction: 'next' | 'prev') => void) {
	let touchStartX = 0;
	let touchStartY = 0;
	let isSwiping = false;

	function handleTouchStart(event: TouchEvent): void {
		touchStartX = event.touches[0]!.clientX;
		touchStartY = event.touches[0]!.clientY;
		isSwiping = true;
	}

	function handleTouchMove(event: TouchEvent): void {
		if (!isSwiping) return;

		const touchEndX = event.touches[0]!.clientX;
		const touchEndY = event.touches[0]!.clientY;

		const deltaX = touchEndX - touchStartX;
		const deltaY = touchEndY - touchStartY;

		// Prevent default if horizontal swipe is detected
		if (Math.abs(deltaX) > Math.abs(deltaY)) {
			event.preventDefault();
		}
	}

	function handleTouchEnd(event: TouchEvent): void {
		if (!isSwiping) return;

		const touchEndX = event.changedTouches[0]!.clientX;
		const touchEndY = event.changedTouches[0]!.clientY;

		const deltaX = touchEndX - touchStartX;
		const deltaY = touchEndY - touchStartY;

		const minSwipeDistance = 50;

		// Horizontal swipe
		if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
			if (deltaX > 0) {
				// Swipe right - previous page
				onPageChange('prev');
			} else {
				// Swipe left - next page
				onPageChange('next');
			}
		}

		isSwiping = false;
	}

	return {
		handleTouchStart,
		handleTouchMove,
		handleTouchEnd
	};
}

/**
 * Keyboard navigation handler
 */
export function createKeyboardHandler(onPageChange: (direction: 'next' | 'prev') => void) {
	return (event: KeyboardEvent) => {
		switch (event.key) {
			case 'ArrowRight':
			case 'ArrowDown':
			case 'PageDown':
			case ' ': // Space
				event.preventDefault();
				onPageChange('next');
				break;

			case 'ArrowLeft':
			case 'ArrowUp':
			case 'PageUp':
				event.preventDefault();
				onPageChange('prev');
				break;
		}
	};
}
