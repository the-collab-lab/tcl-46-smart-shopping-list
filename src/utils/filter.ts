export const customDateRange = (start, end) => {
	if (!start || !end) return () => true;
	const start_IN_MS = new Date(start).getTime();
	const end_IN_MS = new Date(end).getTime();
	return (item) =>
		item.dateNextPurchased.toMillis() >= start_IN_MS &&
		item.dateNextPurchased.toMillis() < end_IN_MS;
};
