import { isEmpty, isDuplicate, cleanup } from '../src/utils/validateStrings';

describe('isEmpty function', () => {
	it('Returns true when passed any empty string', () => {
		const empty = ['', '  ', '          '];

		empty.forEach((input) => {
			expect(isEmpty(input)).toBeTruthy();
		});
	});

	it('Returns false when passed any non-empty string', () => {
		const nonEmpty = ['sdf', ' / ', 'A', '-', '@', '12930'];

		nonEmpty.forEach((input) => {
			expect(isEmpty(input)).toBeFalsy();
		});
	});

	it('Returns undefined when not passed correct type or defined value', () => {
		const notStrings = [
			98,
			['haha', 'fooled you'],
			{ object: 'I am an object' },
			undefined,
		];

		notStrings.forEach((val) => {
			expect(isEmpty(val)).toBeUndefined();
		});
	});
});

describe('isDuplicate function', () => {
	const data = [
		{ name: 'red' },
		{ name: 'blue' },
		{ name: 'green' },
		{ name: 'yellow' },
		{ name: 'orange' },
	];

	it('Returns true when passed a name that exists in a list of items', () => {
		const check = ['red', 'blue', 'orange'];

		check.forEach((color) => {
			expect(isDuplicate(color, data)).toBeTruthy();
		});
	});

	it('Returns false when passed a name that does not exist in a list of items', () => {
		const check = ['aqua', 'teal', 'periwinkle'];

		check.forEach((color) => {
			expect(isDuplicate(color, data)).toBeFalsy();
		});
	});

	it('Returns true when passed a badly typed/spaced name that does exist in the list of items', () => {
		const check = ['r E .  d ', 'b!l---- ---- --- --ue', 'oRAN-_-_-_-ge'];

		check.forEach((color) => {
			expect(isDuplicate(color, data)).toBeTruthy();
		});
	});

	it('Returns undefined if passed data in the incorrect format', () => {
		const falseData = [
			[
				{ name: 'red' },
				{ name: 'blue' },
				{ horse: 'green' },
				{ name: 'yellow' },
				{ name: 'orange' },
			],
			{ name: 'red', color: 'blue', genus: 'green' },
			['red', 'blue', 'green', 'yellow'],
		];

		falseData.forEach((data) => {
			expect(isDuplicate('red', data)).toBeUndefined();
		});
	});

	it('Returns undefined if passed item name in the incorrect format', () => {
		const check = [{ name: 'red' }, 89, undefined, null];
		check.forEach((name) => {
			expect(isDuplicate(name, data)).toBeUndefined();
		});
	});
});

describe('Cleanup function', () => {
	const key = ['square', 'knot', 'key', 'basement', 'fuzzy', 'noodle'];
	it('Removes casing', () => {
		const check = ['squARE', 'KNot', 'KEY', 'BaSeMenT', 'FUZZy', 'NooDLE'];
		check.forEach((item, i) => {
			expect(cleanup(item)).toEqual(key[i]);
		});
	});

	it('Removes extraneous spaces and alt characters', () => {
		const check = [
			's    ---     quar e',
			'     kno %t',
			'   -@  k e y  ',
			'b!> as e ment',
			'fU&&&zzy',
			'n o o dle',
		];
		check.forEach((item, i) => {
			expect(cleanup(item)).toEqual(key[i]);
		});
	});

	it('Returns undefined if passed item name in incorrect format', () => {
		const check = [{ name: 'red' }, 89, undefined, null];
		check.forEach((name) => {
			expect(cleanup(name)).toBeUndefined();
		});
	});
});
