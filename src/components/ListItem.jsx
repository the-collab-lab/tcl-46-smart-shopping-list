import { useState, useEffect } from 'react';

import './ListItem.css';

export function ListItem({ name }) {
	const [isChecked, setIsChecked] = useState(false);

	useEffect(() => {
		console.log(isChecked);
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
