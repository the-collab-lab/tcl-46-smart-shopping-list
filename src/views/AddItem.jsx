import { useState } from 'react';
import { addItem } from '../api/firebase';

const defaultItem = { itemName: '', daysUntilNextPurchase: 7 };
export function AddItem({ data, listToken }) {
	const [item, setItem] = useState(defaultItem);
	const [status, setStatus] = useState('');

	const updateItem = (e) => {
		if (status) setStatus('');
		if (
			e.target.name !== 'daysUntilNextPurchase' &&
			e.target.name !== 'itemName'
		)
			return;
		let updateVal = e.target.value;
		if (e.target.name === 'daysUntilNextPurchase') {
			updateVal = Number(updateVal);
		}
		setItem({ ...item, [e.target.name]: updateVal });
	};

	const cleanup = (inputString) => {
		return inputString.toLowerCase().trim().replace(/[\W]/g, '');
	};

	const checkForEmpty = (itemName) => {
		// defer cleanup to this step so 'user’s original input is saved in the database'
		if (cleanup(itemName) === '') {
			setStatus(`Can not add an empty item`);
		}
	};

	const checkForDuplicate = (itemName) => {
		data.forEach((item) => {
			if (cleanup(item.name) === cleanup(itemName)) {
				setStatus(`This item has already been added`);
			}
		});
	};

	const addItemToDatabase = (e) => {
		e.preventDefault();

		checkForEmpty(item.itemName);

		checkForDuplicate(item.itemName);

		// addItem(listToken, item)
		// 	.then(() => setStatus('Item added successfully!'))
		// 	.then(() => setItem(defaultItem))
		// 	.catch(() => setStatus('Item could not be added.'));
	};

	return (
		<div>
			<p>
				Hello from the <code>/add-item</code> page!
			</p>
			<form onSubmit={addItemToDatabase}>
				<label htmlFor="addItem">
					Add Item
					<input
						placeholder="Item Name"
						id="addItem"
						value={item.itemName}
						onChange={updateItem}
						name="itemName"
					/>
				</label>
				<label htmlFor="itemFrequency">
					Select Frequency
					<select
						value={item.daysUntilNextPurchase}
						onChange={updateItem}
						name="daysUntilNextPurchase"
						id="itemFrequency"
					>
						<option value={7}>Soon</option>
						<option value={14}>Kind of Soon</option>
						<option value={30}>Not Soon</option>
					</select>
				</label>
				<button type="submit">Submit</button>
			</form>
			<p>{status}</p>
		</div>
	);
}
