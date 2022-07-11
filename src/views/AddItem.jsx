import { useState } from 'react';

const defaultItem = { itemName: '', frequency: 7 };
export function AddItem() {
	const [item, setItem] = useState(defaultItem);

	const updateItem = (e) => {
		if (e.target.name !== 'frequency' && e.target.name !== 'itemName') return;
		let updateVal = e.target.value;
		if (e.target.name === 'frequency') {
			updateVal = Number(updateVal);
		}

		setItem({ ...item, [e.target.name]: updateVal });
	};

	const addItemToList = (e) => {
		e.preventDefault();
		console.log(item);
	};

	return (
		<div>
			<p>
				Hello from the <code>/add-item</code> page!
			</p>
			<form onSubmit={addItemToList}>
				<label htmlFor="item">
					Add Item
					<input
						placeholder="my form"
						id="addItem"
						value={item.itemName}
						onChange={updateItem}
						name="itemName"
					/>
				</label>
				<label htmlFor="itemFrequency">
					Select Frequency
					<select
						value={item.frequency}
						onChange={updateItem}
						name="frequency"
						id="itemFrequency"
					>
						<option value={7}>Soon</option>
						<option value={14}>Kind of Soon</option>
						<option value={30}>Not Soon</option>
					</select>
				</label>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}
