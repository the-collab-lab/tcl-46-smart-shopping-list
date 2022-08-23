import './Home.css';
import { useState, useContext } from 'react';
import { MyContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { generateToken } from '@the-collab-lab/shopping-list-utils';
import { getItemData, streamListItems, addItem } from '../api';
import { addList, hasToken } from '../utils/user';
import { ListToken } from '../types';

export function Home() {
	const [errorMessage, setErrorMessage] = useState('');
	const [joinListToken, setJoinListToken] = useState('');
	const [listName, setListName] = useState('');
	const [userList, setUserList] = useContext(MyContext).userListCtx;
	const [, setListToken] = useContext(MyContext).listTokenCtx;

	const navigate = useNavigate();

	function addPlaceholderItem(listId) {
		addItem(listId, { itemName: '', daysUntilNextPurchase: 0 });
	}

	function makeNewList() {
		const newToken = generateToken();

		setUserList(addList(userList, listName, newToken as ListToken));
		setListToken(newToken);
		addPlaceholderItem(newToken);

		navigate('/list');
	}

	function joinListSubmit(event) {
		event.preventDefault();

		return streamListItems(joinListToken, (snapshot) => {
			const data = getItemData(snapshot);
			try {
				if (!data.length) throw new Error('That list does not exist.');
				if (hasToken(userList, joinListToken as ListToken))
					throw new Error('You have already joined that list.');
				setListToken(joinListToken);
				setUserList(
					addList(userList, joinListToken, joinListToken as ListToken),
				);
				navigate('/list');
			} catch (err) {
				setErrorMessage(err.message);
			}
		});
	}

	function joinListChange(event) {
		if (errorMessage) setErrorMessage('');
		setJoinListToken(event.target.value);
	}

	const updateListName = (e) => {
		setListName(e.target.value);
	};
	return (
		<div className="Home">
			<form onSubmit={makeNewList}>
				<label htmlFor="make-list">
					<input
						id="make-list"
						type="text"
						onChange={updateListName}
						value={listName}
					/>
				</label>
				<button type="submit">Make new list</button>
			</form>
			<form onSubmit={joinListSubmit}>
				<label htmlFor="share-list">
					Join a List
					<input
						id="share-list"
						pattern="(?:\w+ ){2}\w+"
						title="Token must be three words separated with spaces."
						onChange={joinListChange}
						value={joinListToken}
					></input>
				</label>
				<button type="submit">Submit</button>
			</form>
			{errorMessage && <p>{errorMessage}</p>}
		</div>
	);
}
