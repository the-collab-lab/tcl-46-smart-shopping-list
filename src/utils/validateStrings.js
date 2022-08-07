/**
 * Checks if an empty string of any length has been passed in
 * @param {string} itemName
 * @returns {boolean | undefined}
 */
export const isEmpty = (itemName) =>
	typeof itemName === 'string' ? itemName.trim().length === 0 : undefined;

/**
 * Checks if a name exists in an array of item objects, allowing for fuzziness
 * @param {string} itemName
 * @param {{name: string}[]} data
 * @returns {boolean | undefined}
 */
export const isDuplicate = (itemName, data) => {
	if (
		typeof itemName !== 'string' ||
		!data ||
		!Array.isArray(data) ||
		!data.every((val) => val.hasOwnProperty('name'))
	)
		return undefined;

	return data.some(({ name }) => cleanup(name) === cleanup(itemName));
};

/**
 * Normalizes by lowercasing and replacing any non word character including _ and - with ''
 * @param {string} inputString
 * @returns {string | undefined}
 */
export const cleanup = (itemName) =>
	typeof itemName === 'string'
		? itemName.toLowerCase().replace(/[\W_-]/g, '')
		: undefined;
