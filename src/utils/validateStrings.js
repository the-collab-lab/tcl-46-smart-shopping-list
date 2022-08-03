export const isEmpty = (itemName) => cleanup(itemName) === '';
export const isDuplicate = (itemName, data) =>
	data.some(({ name }) => cleanup(name) === cleanup(itemName));

const cleanup = (inputString) =>
	inputString
		.toLowerCase()
		.trim()
		.replace(/[\W_-]/g, '');
