import { useState, useEffect } from 'react';

import { updateItem } from '../api/firebase';

import { getFutureDate } from '../utils';

import './ListItem.css';

export function ListItem({
	listToken,
	itemId,
	name,
	isChecked,
	dateLastPurchased,
}) {
	const twentyFourHoursInMilleSeconds = 86400000;
	// sync up checked or not checked data from the database to the page upon page refresh
	const [isPurchased, setIsPurchased] = useState(isChecked);

	useEffect(() => {
		// only update item when the checkbox has been checked. Don't update when the page just loaded and "isPurchased" is changed accordingly
		if (isChecked !== isPurchased) {
			updateItem(listToken, {
				itemId: itemId,
				isChecked: isPurchased,
				currentTime: getFutureDate(0),
			});
		}
	}, [isPurchased, isChecked, itemId, listToken]);

	useEffect(() => {
		let currentTime = new Date().getTime();
		let timeElapsed = currentTime - dateLastPurchased.seconds * 1000;
		if (timeElapsed > twentyFourHoursInMilleSeconds) {
			setIsPurchased(false);
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
