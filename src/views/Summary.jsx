import { useState, useMemo } from 'react';
import { getDaysBetweenDates } from '../utils';
import { comparePurchaseUrgency } from '../utils/item';

export function Summary({ data }) {
	const [goals, setGoals] = useState(''); //these should be drawn from association with userID, if we build out user database

	// duplicated fr List - not set up when data is passed to this component
	const sortedFullList = useMemo(() => comparePurchaseUrgency(data), [data]);

	/**
    Summary of data keys - to remove on finalization
  
	itemId,
	name,
	isChecked,
	dateCreated,
	dateLastPurchased,
	dateNextPurchased,
	totalPurchases,
	refTime,
	daysToNext,
    */

	//memoize below?
	const getPurchased = (array) =>
		array.filter((item) => item.dateLastPurchased); //purchased at least once, not null value
	const getOldest = (array) => {
		const refTimesOnly = array.map((item) => item.refTime);
		return array.filter((item) => item.refTime === Math.min(...refTimesOnly)); //there may be more than one, so not using find()
	};
	const getFiveMost = (array, metric) => {
		const arr = [...array].sort((a, b) => b[metric] - a[metric]); //when passing in date in MS, larger is also more recent
		arr.length = 5;
		return arr;
	};

	const currentTime = new Date().getTime();
	const purchased = getPurchased(sortedFullList);
	const fiveMostRecentPurchases = getFiveMost(purchased, 'refTime'); //descending order of most recently purchased items
	const fiveMostPurchased = getFiveMost(purchased, 'totalPurchases');
	const mostPurchased = [...purchased].filter(
		(item) => item.totalPurchases === Math.max(),
	);
	const mostNeglectedItems = getOldest(
		sortedFullList.filter((item) => !item.dateLastPurchased),
	); //oldest never purchased item(s)

	return (
		<div className="Summary">
			{purchased ? (
				<div>
					<h2>Your purchase history to date</h2>
					<h3>Top 5 purchases by frequency:</h3>
					<ol>
						{fiveMostPurchased.map((item) => (
							<li key={item.itemId}>
								{item.name}: bought {item.totalPurchases} times
							</li>
						))}
					</ol>

					<h3>5 most recent purchases:</h3>
					<ol>
						{fiveMostRecentPurchases.map((item) => (
							<li key={item.itemId}>
								{item.name}: bought on{' '}
								{item.dateLastPurchased.toDate().toLocaleDateString('en-us', {
									weekday: 'long',
									year: 'numeric',
									month: 'short',
									day: 'numeric',
								})}
							</li>
						))}
					</ol>
				</div>
			) : (
				<p>No purchase history found.</p>
			)}

			{mostNeglectedItems ? (
				<>
					<h3>Did you forget about these?</h3>

					{mostNeglectedItems.map((item) => (
						<div key={item.itemId}>
							The item "{item.name}" is{' '}
							{getDaysBetweenDates(item.refTime, currentTime)} days old and was
							never purchased.
						</div> //ambivalent about this one and also where the logic is
					))}
				</>
			) : (
				"You've bought everything on your list at least once! Good job."
			)}

			<h2>Personal Goals</h2>
			{goals ? <p>{goals}</p> : 'Set some goals for your shopping habits!'}
		</div>
	);
}
