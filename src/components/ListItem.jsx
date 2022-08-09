import { useState, useEffect } from 'react';

import { updateItem } from '../api/firebase';

import {
	getFutureDate,
	getDaysBetweenDates, //ADDED
} from '../utils';

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

	//for grouping
	const [whenToBuy, setWhenToBuy] = useState('');
	const [activeStatus, setActiveStatus] = useState('');

	// run on render:
	useEffect(() => {
		let currentTime = new Date().getTime(); //in MS

		let refDate = dateLastPurchased
			? dateLastPurchased.toMillis()
			: dateCreated.toMillis();
		let daysSinceLast = getDaysBetweenDates(refDate, currentTime);

		let daysToNext = getDaysBetweenDates(
			currentTime,
			dateNextPurchased.toMillis(),
		);
		console.log(
			`Item name: ${name}; daysSinceLast: ${daysSinceLast}; daysToNext: ${daysToNext}`,
		);
		if (daysSinceLast > 60) {
			setActiveStatus('inactive');
			// do I care to have the whenToBuy for this set too?
			// currently omitted now that I split the lists in List component.
		} else {
			setActiveStatus('active');
			if (daysToNext < 0) {
				setWhenToBuy('Overdue |');
			} else if (daysToNext <= 7) {
				setWhenToBuy('Soon |');
			} else if (daysToNext > 7 && daysToNext < 30) {
				setWhenToBuy('Kind of soon |');
			} else if (daysToNext >= 30) {
				setWhenToBuy('Not soon |');
			}
		}
	}, [dateLastPurchased]); //I don't really need to watch daysNext - it duplicates

	useEffect(() => {
		if (isChecked !== isPurchased) {
			updateItem(listToken, {
				itemId: itemId,
				isChecked: isPurchased,
				dateCreated: dateCreated,
				dateLastPurchased: dateLastPurchased, // added

				currentDate: getFutureDate(0),
				currentTime: new Date().getTime(),
				dateNextPurchased: dateNextPurchased, //reassigned inside the function - this passes initial dNP
				totalPurchases: totalPurchases,
			});
		}
	}, [isPurchased, itemId, listToken]); //excluding isChecked - fixes looping and doublecounting

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
			<span className="tempReadable">{whenToBuy}</span>
			<span className="tempReadable">{activeStatus}</span>
			<label className="ListItem-label" htmlFor={name}>
				{name}
			</label>
		</li>
	);
}
