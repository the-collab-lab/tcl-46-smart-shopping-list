import { checkIfActive, sortByNextDateAlphabetical } from '../src/utils/item';
import { ONE_DAY_IN_MILLISECONDS } from '../src/utils/dates';

describe('check if active function', () => {
	let currentTime = new Date().getTime();

	it('Returns true when passed a time no more than 59 days before current time', () => {
		const check = [
			currentTime,
			currentTime - 59 * ONE_DAY_IN_MILLISECONDS,
			currentTime - 7 * ONE_DAY_IN_MILLISECONDS,
		];

		check.forEach((ref) => {
			expect(checkIfActive(ref, currentTime)).toBeTruthy(); //failing this test
		});
	});

	it('Returns false when passed a time 60 or more days earlier than current time', () => {
		const check = [
			currentTime - 60 * ONE_DAY_IN_MILLISECONDS,
			currentTime - 61 * ONE_DAY_IN_MILLISECONDS,
		];

		check.forEach((ref) => {
			expect(checkIfActive(ref, currentTime)).toBeFalsy();
		});
	});
});

describe('order by daysToNext ascending, then sort by UTF-16 code', () => {
	const check = [
		{
			name: 'Albatross',
			daysToNext: 3,
		},
		{
			name: '@lbatross',
			daysToNext: 3,
		},
		{
			name: '1lbatross',
			daysToNext: 3,
		},
		{
			name: 'bubblegum',
			daysToNext: 5,
		},
		{
			name: 'cheese',
			daysToNext: 4,
		},
		{
			name: 'jar',
			daysToNext: 1,
		},
		{
			name: 'hamster',
			daysToNext: 2,
		},
		{
			name: 'Berlin',
			daysToNext: 1,
		},
	];

	const key = [
		'Berlin',
		'jar',
		'hamster',
		'@lbatross',
		'1lbatross',
		'Albatross',
		'cheese',
		'bubblegum',
	];
	it('Sorts in order', () => {
		let sortedCheckNames = sortByNextDateAlphabetical(check).map(
			(item) => item.name,
		);
		sortedCheckNames.forEach((item, i) => expect(item).toEqual(key[i]));
	});
});
