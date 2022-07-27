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
	const twentyFourHoursInSeconds = 86400000;
	const [isPurchased, setIsPurchased] = useState(isChecked);

	useEffect(() => {
		updateItem(listToken, {
			itemId: itemId,
			isChecked: isPurchased,
			currentTime: getFutureDate(0),
		});
	}, [isPurchased, itemId, listToken]);

	useEffect(() => {
		let currentTime = new Date().getTime();
		let timeElapsed = currentTime - dateLastPurchased;
		if (timeElapsed > twentyFourHoursInSeconds) {
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
