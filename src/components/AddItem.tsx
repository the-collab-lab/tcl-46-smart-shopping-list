import { useState, useContext } from 'react';
import { MyContext } from '../App';
import { isEmpty, isDuplicate, isValidToken } from '../utils/validateStrings';
import { addItem } from '../api/firebase';
import NoToken from './NoToken';
import { getUserListsArr } from '../utils/user';
import '../views/List.css';

const defaultItem = { itemName: '', daysUntilNextPurchase: 7 };
export function AddItem() {
	const [item, setItem] = useState(defaultItem);
	const [status, setStatus] = useState('');
	const [listToken] = useContext(MyContext).listTokenCtx;
	const [data] = useContext(MyContext).dataCtx;
	const [userList] = useContext(MyContext).userListCtx;
	const [selectedListToken, setSelectedListToken] = useState(listToken);

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
			setStatus('Cannot add an empty item.');
			setItem(defaultItem);
			return true;
		}
		if (isDuplicate(name, data)) {
			setStatus('This item has already been added.');
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
			{listToken && isValidToken(listToken) ? (
				<div className="AddItem">
					<form className="addItem__form" onSubmit={addItemToDatabase}>
						<div className="addItem__section">
							<label htmlFor="addItem" className="addItem__label">
								Add:
								<input
									placeholder="Item name"
									id="addItem"
									value={item.itemName}
									onChange={updateItem}
									name="itemName"
									className="addItem__input"
								/>
							</label>
							<label htmlFor="itemFrequency" className="addItem__label">
								Frequency:
								<select
									value={item.daysUntilNextPurchase}
									onChange={updateItem}
									name="daysUntilNextPurchase"
									id="itemFrequency"
									className="addItem__select addItem__select_frequency"
								>
									<option value={7}>Soon</option>
									<option value={14}>Kind of Soon</option>
									<option value={30}>Not Soon</option>
								</select>
							</label>
						</div>
						<div className="addItem__section">
							<label
								htmlFor="userList"
								className="addItem__label label__select"
							>
								to List
								<select
									value={selectedListToken}
									onChange={updateSelectedList}
									id="userList"
									className="addItem__select addItem__select_listNames"
								>
									{getUserListsArr(userList).map(([name, token]) => (
										<option key={token} value={token}>
											{name}
										</option>
									))}
								</select>
							</label>
							<button type="submit" className="btn__submit">
								Submit
							</button>
						</div>
					</form>
					<p>{status}</p>
				</div>
			) : (
				<NoToken />
			)}
		</>
	);
}
