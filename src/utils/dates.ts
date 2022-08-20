const ONE_DAY_IN_MILLISECONDS = 86400000;

/** Get a new JavaScript Date that is `offset` days in the future. */
export const getFutureDate = (offset: number) =>
	new Date(Date.now() + offset * ONE_DAY_IN_MILLISECONDS);

/** Gets # of days between current and start milliseconds */
export const getDaysBetweenDates = (startTime: number, currentTime: number) =>
	Math.round((currentTime - startTime) / ONE_DAY_IN_MILLISECONDS);
