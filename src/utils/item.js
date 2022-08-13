import { getDaysBetweenDates } from './dates';

/*sorting logic for items*/

let currentTime = new Date().getTime(); //in MS

export const checkIfActive = (ref, current) => {
	return getDaysBetweenDates(ref, current) < 60;
};

export const sortByNextDateAlphabetical = (array) =>
	array.sort(
		(a, b) => a.daysToNext - b.daysToNext || a.name.localeCompare(b.name),
	);

const appendDataToDays = (data) =>
	data.map((item) => {
		let refTime = item.dateLastPurchased
			? item.dateLastPurchased.toMillis()
			: item.dateCreated.toMillis();

		let daysToNext = getDaysBetweenDates(
			currentTime,
			item.dateNextPurchased.toMillis(),
		);
		return { ...item, refTime, daysToNext };
	});

const sortedMultiArr = (dataWithDays) =>
	dataWithDays.reduce(
		(sorted, item) => {
			if (!checkIfActive(item.refTime, currentTime)) {
				sorted[2].push(item);
			} else if (
				checkIfActive(item.refTime, currentTime) &&
				item.daysToNext < 0
			) {
				sorted[0].push(item);
			} else sorted[1].push(item);
			return sorted;
		},
		[[], [], []],
	);

export const comparePurchaseUrgency = (data) => {
	const dataWithDays = appendDataToDays(data);
	return sortedMultiArr(dataWithDays).map(sortByNextDateAlphabetical).flat();
};
