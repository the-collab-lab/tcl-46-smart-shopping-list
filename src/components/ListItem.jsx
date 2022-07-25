import './ListItem.css';
import { useState, useEffect } from 'react';
import { updateItem } from '../api/firebase';

export function ListItem({ name, listToken }) {
	const [isChecked, setIsChecked] = useState(false);
	useEffect(() => {
		// updateItem(listToken);
	}, [isChecked]);
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
