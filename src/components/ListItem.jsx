import { useState, useEffect } from 'react';

import { updateItem } from '../api/firebase';

import { getFutureDate } from '../utils';

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

	function deleteItem() {
		if (window.confirm('Are you sure you want to delete?')) {
			console.log('delete function');
		}
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
			<button onClick={deleteItem}>Delete</button>
		</li>
	);
}
