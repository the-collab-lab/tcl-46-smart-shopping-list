import { useState } from 'react';
import { isEmpty, isDuplicate } from '../utils/validateStrings';
import { addItem } from '../api/firebase';
import NoToken from '../components/NoToken';
import { getUserListsArr } from '../utils/user';

const defaultItem = { itemName: '', daysUntilNextPurchase: 7 };
export function AddItem({ data, listToken, user }) {
	const [item, setItem] = useState(defaultItem);
	const [status, setStatus] = useState('');
	const [selectedListToken, setSelectedListToken] = useState(listToken);
	const [userToken] = user;

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

	const updateSelectedList = (e) => setSelectedListToken(e.target.value);

	const isInvalid = (name) => {
		if (isEmpty(name)) {
			setStatus('Can not add an empty item');
			setItem(defaultItem);
			return true;
		}
		if (isDuplicate(name, data)) {
			setStatus('This item has already been added');
			setItem(defaultItem);
			return true;
		}
		return false;
	};

	const addItemToDatabase = (e) => {
		e.preventDefault();
		if (isInvalid(item.itemName)) return;

		addItem(selectedListToken, item)
			.then(() => setStatus('Item added successfully!'))
			.then(() => setItem(defaultItem))
			.catch(() => setStatus('Item could not be added.'));
	};

	return (
		<>
			{listToken ? (
				<div>
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
						<label htmlFor="userList">
							Select List
							<select
								value={selectedListToken}
								onChange={updateSelectedList}
								id="userList"
							>
								{getUserListsArr(userToken).map(([name, token]) => (
									<option key={token} value={token}>
										{name}
									</option>
								))}
							</select>
						</label>
						<button type="submit">Submit</button>
					</form>
					<p>{status}</p>
				</div>
			) : (
				<NoToken />
			)}
		</>
	);
}
