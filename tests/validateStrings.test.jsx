import { isEmpty, isDuplicate, cleanup } from '../src/utils/validateStrings';

describe('isEmpty function', () => {
	it('Returns true when passed any empty string', () => {
		const empty = ['', '  ', '          '];

		empty.forEach((input) => {
			expect(isEmpty(input)).toBeTruthy();
		});
	});

	it('Returns true when not passed correct type or defined value', () => {
		const notStrings = [
			98,
			['haha', 'fooled you'],
			{ object: 'I am an object' },
			undefined,
		];

		notStrings.forEach((val) => {
			expect(isEmpty(val)).toBeTruthy();
		});
	});

	it('Returns false when passed any non-empty string', () => {
		const nonEmpty = ['sdf', ' / ', 'A', '-', '@', '12930'];

		nonEmpty.forEach((input) => {
			expect(isEmpty(input)).toBeFalsy();
		});
	});
});
