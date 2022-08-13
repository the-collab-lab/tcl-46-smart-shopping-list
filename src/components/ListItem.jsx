import { useState, useEffect } from 'react';

import { updateItem } from '../api/firebase';

import { getFutureDate } from '../utils';

import { checkIfActive } from '../utils/item';

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
	refTime,
	daysToNext,
}) {
	const DAYINMS = 86400000;
	// sync up checked or not checked data from the database to the page upon page refresh
	const [isPurchased, setIsPurchased] = useState(isChecked);

	const urgency = [
		['overdue', 'Overdue'],
		['soon', 'Soon'],
		['kind-of-soon', 'Kind Of Soon'],
		['not-soon', 'Not Soon'],
		['inactive', 'Inactive'],
	];
	const [urgencyIndex, setUrgencyIndex] = useState(urgency[4]); //requires a default value else throws error

	useEffect(() => {
		let currentTime = new Date().getTime();
		if (!checkIfActive(refTime, currentTime)) {
			setUrgencyIndex(urgency[4]);
		} else if (daysToNext < 0) {
			setUrgencyIndex(urgency[0];
		} else if (daysToNext <= 7) {
			setUrgencyIndex(urgency[1]);
		} else if (daysToNext > 7 && daysToNext < 30) {
			setUrgencyIndex(2);
		} else if (daysToNext >= 30) {
			setUrgencyIndex(3);
		}
	}, [refTime, daysToNext]);

	useEffect(() => {
		if (isChecked !== isPurchased) {
			updateItem(listToken, {
				itemId: itemId,
				isChecked: isPurchased,
				dateCreated: dateCreated,
				dateLastPurchased: dateLastPurchased,

				currentDate: getFutureDate(0),
				currentTime: new Date().getTime(),
				dateNextPurchased: dateNextPurchased, //reassigned inside the function - this passes the initial dNP
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
		<>
			<li className="ListItem">
				<div className="section-checkbox">
					<input
						className="ListItem-checkbox"
						type="checkbox"
						id={name}
						name={name}
						value={name}
						onChange={handleValueChange}
						defaultChecked={isChecked}
					/>
				</div>

				<div className="section-label">
					<label className="ListItem-label" htmlFor={name}>
						{name}
					</label>
				</div>

				<div className="section-urgency">
					<div className={'urgency-icon ' + urgency[urgencyIndex][0]}></div>
					<p>{urgency[urgencyIndex][1]}</p>
				</div>

				<div className="section-delete">
					<button>delete</button>
				</div>
			</li>
		</>
	);
}
