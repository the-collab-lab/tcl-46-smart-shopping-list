import { getDaysBetweenDates } from './dates';

/*sorting logic for items*/
export function comparePurchaseUrgency(data) {
	/**with the following behaviors
	sorts inactive items last, then
	sorts items in ascending order of days until purchase, and
	sorts items with the same days until purchase alphabetically */

	let currentTime = new Date().getTime(); //in MS
	const checkIfActive = (refDate, current) => {
		return getDaysBetweenDates(refDate, current) < 60;
	};

	const sortByNextDateAlphabetical = (array) => {
		return array.sort((a, b) => {
			return a.daysToNext - b.daysToNext || a.name.localeCompare(b.name);
		});
	};

	const dataWithDays = data.map((item) => {
		// we will use these frequently in the next ops, so passing as additional keys:
		let refDate = item.dateLastPurchased
			? item.dateLastPurchased.toMillis()
			: item.dateCreated.toMillis();

		let daysToNext = getDaysBetweenDates(
			currentTime,
			item.dateNextPurchased.toMillis(),
		);
		return { ...item, refDate, daysToNext };
	});

	const sortedOverdueList = sortByNextDateAlphabetical(
		dataWithDays
			.filter((item) => {
				const { refDate, daysToNext } = item;
				return checkIfActive(refDate, currentTime) && daysToNext < 0;
			})
			.map((item) => {
				let urgency = 'overdue';
				let urgencyMessage = 'Overdue';

				return { ...item, urgency, urgencyMessage };
			}),
	);

	const sortedActiveListNoOverdues = sortByNextDateAlphabetical(
		dataWithDays
			.filter((item) => {
				const { refDate, daysToNext } = item;
				return checkIfActive(refDate, currentTime) && daysToNext >= 0;
			})
			.map((item) => {
				let urgency;
				let urgencyMessage;

				const { daysToNext } = item;
				if (daysToNext < 0) {
					urgency = 'overdue';
					urgencyMessage = 'Overdue';
				} else if (daysToNext <= 7) {
					urgency = 'soon';
					urgencyMessage = 'Soon';
				} else if (daysToNext > 7 && daysToNext < 30) {
					urgency = 'kind-of-soon';
					urgencyMessage = 'Kind Of Soon';
				} else if (daysToNext >= 30) {
					urgency = 'not-soon';
					urgencyMessage = 'Not Soon';
				}

				return { ...item, urgency, urgencyMessage };
			}),
	);
	const sortedInactiveListByDateNext = sortByNextDateAlphabetical(
		dataWithDays
			.filter((item) => {
				const { refDate } = item;
				return !checkIfActive(refDate, currentTime);
			})
			.map((item) => {
				let urgency = 'inactive';
				let urgencyMessage = 'Inactive';
				return { ...item, urgency, urgencyMessage };
			}),
	);
	return sortedOverdueList.concat(
		sortedActiveListNoOverdues,
		sortedInactiveListByDateNext,
	);
}
