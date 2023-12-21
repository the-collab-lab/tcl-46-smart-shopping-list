import { getDaysBetweenDates } from './dates';
import { type Item } from '../types/item';
import { UrgencyStatus } from '../types/urgency';

const currentTime = new Date().getTime(); //in MS

/** True if < 60 days since purchase  */
export const checkIfActive = (ref: number, current: number) =>
	getDaysBetweenDates(ref, current) < 60;

export const sortByNextDateAlphabetical = (array: Item[]): Item[] =>
	array.sort(
		(a, b) => a.daysToNext - b.daysToNext || a.name.localeCompare(b.name),
	);

const appendDaysToData = (data: Item[]) =>
	data?.map((item: Item) => {
		let refTime = item.dateLastPurchased
			? item.dateLastPurchased.toMillis()
			: item.dateCreated.toMillis();

		let daysToNext = getDaysBetweenDates(
			currentTime,
			item.dateNextPurchased.toMillis(),
		);
		return { ...item, refTime, daysToNext };
	});

const sortedMultiArr = (dataWithDays: Item[]): [Item[], Item[], Item[]] =>
	dataWithDays?.reduce(
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

export const comparePurchaseUrgency = (data: Item[]) =>
	sortedMultiArr(appendDaysToData(data))
		?.map(sortByNextDateAlphabetical)
		.flat();

export const getUrgency = (urgencyGroup: UrgencyStatus) => {
	const urgencyLevels = {
		ALL: () => true,
		OVERDUE: (item: Item) =>
			item.daysToNext < 0 && checkIfActive(item.refTime, currentTime),
		SOON: (item: Item) =>
			item.daysToNext > 0 &&
			item.daysToNext <= 7 &&
			checkIfActive(item.refTime, currentTime),
		KIND_OF_SOON: (item: Item) =>
			item.daysToNext > 7 &&
			item.daysToNext < 30 &&
			checkIfActive(item.refTime, currentTime),
		NOT_SOON: (item: Item) =>
			item.daysToNext >= 30 && checkIfActive(item.refTime, currentTime),
		INACTIVE: (item: Item) => !checkIfActive(item.refTime, currentTime),
	};
	return urgencyLevels[urgencyGroup];
};
