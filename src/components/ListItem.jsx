import { useState, useEffect } from 'react';

import { updateItem } from '../api/firebase';

import { getFutureDate } from '../utils';

import './ListItem.css';

export function ListItem({ listToken, itemId, name }) {
	const [isChecked, setIsChecked] = useState(false);

	useEffect(() => {
		updateItem(listToken, {
			itemId: itemId,
			name: name,
			isChecked: isChecked,
			dateLastPurchased: getFutureDate(0),
		});
	}, [isChecked]);

	function handleValueChange(evt) {
		setIsChecked(evt.target.checked);
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
			/>
			<label className="ListItem-label" htmlFor={name}>
				{name}
			</label>
		</li>
	);
}
