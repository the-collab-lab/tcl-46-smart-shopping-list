import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListItem } from '../components';

// ADDED
import { getDaysBetweenDates } from '../utils';

export function List({ data, listToken }) {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState('');
	const [copied, setCopied] = useState('');

	// separating out the logic for active/inactive
	const checkIfActive = (refDate, current) => {
		return getDaysBetweenDates(refDate, current) < 60;
	};

	// issue 12 test - not alphabetized within equal days yet
	/**Summation of test
	 * brute force of copy by filter (overdue, active, inactive) and concat after lists are sorted internally.
	 * 	to the above, not yet alphabetized
	 * not currently split out comparePurchaseUrgency
	 * lots of duplication in ListItem code (maybe pass more of the daysNext? or keep the daysNext/daysSince extraction from other try)
	 * useEffect prob not the best implementation for real-time update of this kind
	 */

	const sortedOverdueList = data
		.filter((item) => {
			let currentTime = new Date().getTime(); //in MS
			let refDate = item.dateLastPurchased
				? item.dateLastPurchased.toMillis()
				: item.dateCreated.toMillis();

			// for overdues:
			let daysToNext = getDaysBetweenDates(
				currentTime,
				item.dateNextPurchased.toMillis(),
			);
			return checkIfActive(refDate, currentTime) && daysToNext < 0;
		})
		.sort(
			(a, b) => b.dateNextPurchased.toMillis() - a.dateNextPurchased.toMillis(),
		);

	const sortedActiveListNoOverdues = data
		.filter((item) => {
			let currentTime = new Date().getTime(); //in MS
			let refDate = item.dateLastPurchased
				? item.dateLastPurchased.toMillis()
				: item.dateCreated.toMillis();
			// for overdues: omit here
			let daysToNext = getDaysBetweenDates(
				currentTime,
				item.dateNextPurchased.toMillis(),
			);

			return checkIfActive(refDate, currentTime) && daysToNext >= 0;
		})
		.sort(
			(a, b) => b.dateNextPurchased.toMillis() - a.dateNextPurchased.toMillis(),
		);
	// descending order because the further out, the larger the num.

	const sortedInactiveListByDateNext = data
		// need to categorize active or inactive, not sort list by it.
		.filter((item) => {
			let currentTime = new Date().getTime(); //in MS
			let refDate = item.dateLastPurchased
				? item.dateLastPurchased.toMillis()
				: item.dateCreated.toMillis();
			return !checkIfActive(refDate, currentTime);
		})
		.sort(
			(a, b) => b.dateNextPurchased.toMillis() - a.dateNextPurchased.toMillis(),
		);

	const sortedFullList = sortedOverdueList.concat(
		sortedActiveListNoOverdues,
		sortedInactiveListByDateNext,
	);

	// need a useEffect or some kind of setState to rerender list on change? watch the dates?
	useEffect(() => {
		// is that the desired UX - insta reorder of items? feels very abrupt
		// also might be better to setState?
		// but this essentially watches for any change on any field of the data and so can apply to LastPurchased, NextPurchased, etc.
	}, [data]);

	useEffect(() => {
		if (copied) setTimeout(() => setCopied(''), 2000);
	}, [copied]);

	const filterList = (list) => {
		const cleanup = (inputString) => {
			return inputString.toLowerCase().trim().replace(/\s+/g, ' ');
		};
		return list.filter(({ name }) =>
			cleanup(name).includes(cleanup(searchTerm)),
		);
	};

	const clearSearchTerm = () => {
		setSearchTerm('');
	};

	const copyToken = () => {
		navigator.clipboard
			.writeText(listToken)
			.then(() => setCopied('Copied!'))
			.catch(() => setCopied('Not Copied.'));
	};

	return (
		<>
			{data.length ? (
				<div>
					<label>
						Filter Items
						<input
							type="text"
							placeholder="start typing here..."
							id="filter"
							name="filter"
							value={searchTerm}
							onChange={(e) => {
								setSearchTerm(e.target.value);
							}}
						/>
					</label>
					<button type="button" onClick={clearSearchTerm} aria-live="polite">
						clear
					</button>
					<div>
						<p>
							Copy token to allow others join your list:
							<button onClick={copyToken} id="token">
								{copied ? copied : listToken}
							</button>
						</p>
					</div>
				</div>
			) : (
				<div>
					<h2>Welcome to your smart shopping list!</h2>
					<p>
						This app will learn from your purchasing habits and help you
						prioritize and plan your shopping list. You must add at least one
						item to start sharing your list with others.
					</p>
					<button type="button" onClick={() => navigate('/add-item')}>
						Start adding items
					</button>
				</div>
			)}

			<ul>
				{filterList(sortedFullList).map((item) => (
					<ListItem
						{...item}
						listToken={listToken}
						key={item.id}
						itemId={item.id}
					/>
				))}
			</ul>
		</>
	);
}
