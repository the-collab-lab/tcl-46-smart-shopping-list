import { Item } from '../types/item';

/** Checks if an empty string of any length has been passed in */
export const isEmpty = (itemName: string): boolean | undefined =>
	typeof itemName === 'string' ? itemName.trim().length === 0 : undefined;

/** Checks if a name exists in an array of item objects, allowing for fuzziness */
export const isDuplicate = (
	itemName: string,
	data: Item[],
): boolean | undefined => {
	if (
		typeof itemName !== 'string' ||
		!data ||
		!Array.isArray(data) ||
		!data.every((val) => val.hasOwnProperty('name'))
	)
		return undefined;

	return data.some(({ name }) => cleanup(name) === cleanup(itemName));
};

/** Normalizes by lowercasing and replacing any non word character including _ and - with '' */
export const cleanup = (itemName: string): string | undefined =>
	typeof itemName === 'string'
		? itemName.toLowerCase().replace(/[\W_-]/g, '')
		: undefined;
