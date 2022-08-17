import { useState, useEffect } from 'react';

import { updateItem, deleteItem } from '../api/firebase';

import { getFutureDate } from '../utils';

import { checkIfActive } from '../utils/item';
import { getUrgency } from '../utils/item';

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

	const urgency = {
		OVERDUE: ['overdue', 'Overdue'],
		SOON: ['soon', 'Soon'],
		KIND_OF_SOON: ['kind-of-soon', 'Kind Of Soon'],
		NOT_SOON: ['not-soon', 'Not Soon'],
		INACTIVE: ['inactive', 'Inactive'],
	};
	const [urgencyIndex, setUrgencyIndex] = useState(urgency.INACTIVE); //requires a default value else throws error

	useEffect(() => {
		let currentTime = new Date().getTime();

		if (checkIfActive(refTime, currentTime)) {
			if (daysToNext < 0) {
				setUrgencyIndex(urgency.OVERDUE);
			} else if (daysToNext <= 7) {
				setUrgencyIndex(urgency.SOON);
			} else if (daysToNext > 7 && daysToNext < 30) {
				setUrgencyIndex(urgency.KIND_OF_SOON);
			} else if (daysToNext >= 30) {
				setUrgencyIndex(urgency.NOT_SOON);
			}
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

	function handleDelete() {
		if (window.confirm(`Are you sure you want to delete ${name}?`)) {
			deleteItem(listToken, itemId);
		}
	}

	return (
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
				<div className={'urgency-icon ' + urgencyIndex[0]}></div>
				<p>{urgencyIndex[1]}</p>
			</div>

			<div className="section-delete">
				<button type="button" onClick={handleDelete}>
					delete
				</button>
			</div>
		</li>
	);
}
