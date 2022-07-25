import './ListItem.css';
import { useState } from 'react';

export function ListItem({ name }) {
	const [isChecked, setIsChecked] = useState(false);

	function handleValueChange(evt) {
		setIsChecked(evt.target.checked);
	}

	return (
		<label>
			{name}
			<input
				type="checkbox"
				name={name}
				value={name}
				onChange={handleValueChange}
			></input>
		</label>
	);
}
