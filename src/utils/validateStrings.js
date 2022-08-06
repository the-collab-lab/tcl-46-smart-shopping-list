/**
 * Checks if an empty string of any length has been passed in
 * @param {string} itemName
 * @returns {boolean}
 */
export const isEmpty = (itemName) =>
	typeof itemName !== 'string' || itemName.trim().length === 0;

export const isDuplicate = (itemName, data) =>
	data.some(({ name }) => cleanup(name) === cleanup(itemName));

export const cleanup = (inputString) =>
	inputString
		.toLowerCase()
		.trim()
		.replace(/[\W_-]/g, '');
