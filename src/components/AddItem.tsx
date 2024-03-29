import { useState, useContext } from 'react';
import { MyContext } from '../App';
import { isEmpty, isDuplicate } from '../utils/validateStrings';
import { addItem } from '../api/firebase';

import { getUserListsArr } from '../utils/user';
import './AddItem.css';

const defaultItem = { itemName: '', daysUntilNextPurchase: 7 };
export function AddItem({ hasItems }) {
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
		<div className="AddItem">
			<form
				className={`addItem__form${hasItems ? '__hasItems' : ''}`}
				onSubmit={addItemToDatabase}
			>
				<div className={`addItem__section${hasItems ? '__hasItems' : ''}`}>
					<label
						htmlFor="addItem"
						id={`addInput${hasItems ? '__hasItems' : ''}`}
						className={`addItem__label${hasItems ? '__hasItems' : ''}`}
					>
						<p className={`addItem__title ${hasItems ? 'p__hasItems' : ''}`}>
							Add:
						</p>
						<input
							placeholder="Item name"
							id={`${hasItems ? 'addItem__hasItems' : ''}`}
							value={item.itemName}
							onChange={updateItem}
							name="itemName"
							className={`addItem__input ${hasItems ? 'input__hasItems' : ''}`}
						/>
					</label>
				</div>
				<div className={`addItem__modifiers${hasItems ? '__hasItems' : ''}`}>
					<label
						htmlFor="itemFrequency"
						className={`addItem__label${hasItems ? '__hasItems' : ''}`}
					>
						<p className={`addItem__title ${hasItems ? 'p__hasItems' : ''}`}>
							Frequency:
						</p>
						<select
							value={item.daysUntilNextPurchase}
							onChange={updateItem}
							name="daysUntilNextPurchase"
							id="itemFrequency"
							className={`addItem__select${
								hasItems ? '__hasItems' : ''
							} addItem__select_frequency`}
						>
							<option value={7}>Soon</option>
							<option value={14}>Kind of Soon</option>
							<option value={30}>Not Soon</option>
						</select>
					</label>
					<div className={`addItem__section${hasItems ? '__hasItems' : ''}`}>
						<label
							htmlFor="userList"
							className={`addItem__label${
								hasItems ? '__hasItems' : ''
							} label__select`}
						>
							<p className={`${hasItems ? 'p__hasItems' : ''}`}>Select List:</p>
							<select
								value={selectedListToken}
								onChange={updateSelectedList}
								id={`${hasItems ? 'userList__hasItems' : ''}`}
								className={`addItem__select${hasItems ? '__hasItems' : ''}
								addItem__select_listNames`}
							>
								{getUserListsArr(userList).map(([name, token]) => (
									<option key={token} value={token}>
										{name}
									</option>
								))}
							</select>
						</label>
					</div>
					<button
						type="submit"
						id="submit"
						className={`btn__submit${hasItems ? '__hasItems' : ''}`}
					>
						Submit
					</button>
				</div>
			</form>
			<p>{status}</p>
		</div>
	);
}
