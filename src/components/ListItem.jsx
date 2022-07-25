import './ListItem.css';
import { useState, useEffect } from 'react';
import { updateItem } from '../api/firebase';
import { getFutureDate } from '../utils/dates';

export function ListItem({ name, listToken }) {
	const [isChecked, setIsChecked] = useState(false);

	useEffect(() => {
		updateItem(listToken, {
			itemName: name,
			dateLastPurchased: getFutureDate(0),
			totalPurchases: isChecked,
		});
	}, [isChecked, listToken, name]);

	function handleValueChange(evt) {
		setIsChecked(evt.target.checked);
	}
	return (
		<label className="ListItem ListItem-label ">
			<input
				type="checkbox"
				name={name}
				value={name}
				onChange={handleValueChange}
				className="ListItem ListItem-checkbox"
			></input>
			{name}
		</label>
	);
}
