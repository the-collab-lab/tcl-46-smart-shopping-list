const ONE_DAY_IN_MILLISECONDS = 86400000;

/**
 * Get a new JavaScript Date that is `offset` days in the future.
 * @example
 * // Returns a Date 3 days in the future
 * getFutureDate(3)
 * @param {number} offset
 */
export function getFutureDate(offset) {
	return new Date(Date.now() + offset * ONE_DAY_IN_MILLISECONDS);
}

export function getDaysBetweenDates(dateLastPurchased, currentTime) {
	// param both in ms
	const daysSinceLastPurchase = Math.round(
		(currentTime - dateLastPurchased) / ONE_DAY_IN_MILLISECONDS,
	);
	console.log(daysSinceLastPurchase);
	// do calc to get daysSinceLastTransaction
	return daysSinceLastPurchase;
}
