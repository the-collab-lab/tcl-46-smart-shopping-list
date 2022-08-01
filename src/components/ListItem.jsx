import { useState, useEffect } from 'react';

import { updateItem } from '../api/firebase';

import { getFutureDate, getDaysBetweenDates } from '../utils';

import { calculateEstimate } from '@the-collab-lab/shopping-list-utils/dist/calculateEstimate';

import './ListItem.css';

export function ListItem({
	listToken,
	itemId,
	name,
	isChecked,
	dateCreated,
	dateLastPurchased,
	dateNextPurchased,
	totalPurchases,
}) {
	const DAYINMS = 86400000;
	// sync up checked or not checked data from the database to the page upon page refresh
	const [isPurchased, setIsPurchased] = useState(isChecked);

	useEffect(() => {
		// only update item when the checkbox has been checked. Don't update when the page just loaded and "isPurchased" is changed accordingly
		if (isChecked !== isPurchased) {
			let currentDate = getFutureDate(0);

			let currentTimeInMS = new Date().getTime();
			let daysSinceLastPurchase;
			let prevEst;
			if (!dateLastPurchased) {
				daysSinceLastPurchase = 0;
				// use date created if no record of previous buys/null
				prevEst = getDaysBetweenDates(
					dateCreated.toMillis(),
					dateNextPurchased.toMillis(),
				);
			} else {
				daysSinceLastPurchase = getDaysBetweenDates(
					dateLastPurchased.toMillis(),
					currentTimeInMS,
				); //date is in ms, returns daysSinceLastPurchase
				prevEst = getDaysBetweenDates(
					dateLastPurchased.toMillis(),
					dateNextPurchased.toMillis(),
				); //any way to grab the days elapsed sooner?(7/14/21)
			}
			// console.log(`current Time ${currentTimeInMS}`)
			// console.log(`dateLastPurchased ${dateLastPurchased}`)
			let daysToNextPurchase = calculateEstimate(
				prevEst,
				daysSinceLastPurchase,
				totalPurchases,
			); //returns integer - days to next purchase. Then turn into date
			let actualDateNextPurchased = getFutureDate(daysToNextPurchase);
			// console.log(`actual date next purchase ${actualDateNextPurchased}`);

			updateItem(listToken, {
				itemId: itemId,
				isChecked: isPurchased,
				currentDate: currentDate,
				dateNextPurchased: actualDateNextPurchased, //reassigned and sent to firebase
			});
		}
	}, [isPurchased, isChecked, itemId, listToken]);

	useEffect(() => {
		if (dateLastPurchased) {
			let currentTime = new Date().getTime();
			let timeElapsed = currentTime - dateLastPurchased.seconds * 1000;
			if (timeElapsed > DAYINMS) {
				setIsPurchased(false);
			}
		}
	}, []);
	function handleValueChange(evt) {
		setIsPurchased(evt.target.checked);
	}

	return (
		<li className="ListItem">
			<input
				className="ListItem-checkbox"
				type="checkbox"
				id={name}
				name={name}
				value={name}
				onChange={handleValueChange}
				defaultChecked={isChecked}
			/>
			<label className="ListItem-label" htmlFor={name}>
				{name}
			</label>
		</li>
	);
}
