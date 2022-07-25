import { useState, useEffect } from 'react';

import { updateItem } from '../api/firebase';

import './ListItem.css';

export function ListItem({ listToken, name }) {
	const [isChecked, setIsChecked] = useState(false);

	useEffect(() => {
		updateItem(listToken, name, isChecked);
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
