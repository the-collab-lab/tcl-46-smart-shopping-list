import { getDaysBetweenDates } from './dates';

/*sorting logic for items*/

let currentTime = new Date().getTime(); //in MS

export const checkIfActive = (ref, current) => {
	return getDaysBetweenDates(ref, current) < 60;
};

export const sortByNextDateAlphabetical = (array) => array.sort((a, b) => a.daysToNext - b.daysToNext || a.name.localeCompare(b.name))

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

const addUrgency = (item) => {
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
};

export const comparePurchaseUrgency = (data) => {
	const dataWithDays = appendDataToDays(data);
	const sorted = sortedMultiArr(dataWithDays)
		.map(sortByNextDateAlphabetical)
		.flat();

	return sorted.map(addUrgency);
}

