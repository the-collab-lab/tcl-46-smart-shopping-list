import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListItem } from '../components';

// ADDED
import { getDaysBetweenDates } from '../utils';

export function List({ data, listToken }) {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState('');
	const [copied, setCopied] = useState('');

	let currentTime = new Date().getTime(); //in MS
	// separating out the logic for active/inactive
	const checkIfActive = (refDate, current) => {
		return getDaysBetweenDates(refDate, current) < 60;
	};
	/*
	 * not currently split out comparePurchaseUrgency
	 * lots of duplication in ListItem code (maybe pass more of the daysNext? or keep the daysNext/daysSince extraction from other try)
	 * useEffect prob not the best implementation for real-time update of this kind
	 */

	const sortedOverdueList = data
		.filter((item) => {
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
		) //descending order here - farther out = MORE overdue
		// alphabetize same daysToNext items:
		.sort((a, b) => {
			//get days to next
			let aDaysToNext = getDaysBetweenDates(
				currentTime,
				a.dateNextPurchased.toMillis(),
			);
			let bDaysToNext = getDaysBetweenDates(
				currentTime,
				b.dateNextPurchased.toMillis(),
			);
			return aDaysToNext - bDaysToNext || a.name.localeCompare(b.name);
		});

	const sortedActiveListNoOverdues = data
		.filter((item) => {
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
			(a, b) => a.dateNextPurchased.toMillis() - b.dateNextPurchased.toMillis(),
		) //ascending order - proximity to currentTime
		.sort((a, b) => {
			//get days to next
			let aDaysToNext = getDaysBetweenDates(
				currentTime,
				a.dateNextPurchased.toMillis(),
			);
			let bDaysToNext = getDaysBetweenDates(
				currentTime,
				b.dateNextPurchased.toMillis(),
			);
			return aDaysToNext - bDaysToNext || a.name.localeCompare(b.name);
			// if we wanted reverse alph order: return - ( a.id - b.id  ||  a.name.localeCompare(b.name) )
			// does not function: return bDaysToNext - DaysToNext || [a.name,b.name].sort()
		});

	const sortedInactiveListByDateNext = data
		.filter((item) => {
			let refDate = item.dateLastPurchased
				? item.dateLastPurchased.toMillis()
				: item.dateCreated.toMillis();
			return !checkIfActive(refDate, currentTime);
		})
		.sort(
			(a, b) => a.dateNextPurchased.toMillis() - b.dateNextPurchased.toMillis(),
		)
		.sort((a, b) => {
			//get days to next
			let aDaysToNext = getDaysBetweenDates(
				currentTime,
				a.dateNextPurchased.toMillis(),
			);
			let bDaysToNext = getDaysBetweenDates(
				currentTime,
				b.dateNextPurchased.toMillis(),
			);
			return aDaysToNext - bDaysToNext || a.name.localeCompare(b.name);
		});

	const sortedFullList = sortedOverdueList.concat(
		sortedActiveListNoOverdues,
		sortedInactiveListByDateNext,
	);

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
