import './Home.css';
import { useState, useContext } from 'react';
import { MyContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { generateToken } from '@the-collab-lab/shopping-list-utils';
import { getItemData, streamListItems, addItem } from '../api';
import { addList, hasToken } from '../utils/user';
import { ListToken } from '../types';
import { removeList, getFirstToken } from '../utils';
import ListSwitcher from '../components/ListSwitcher';
import { Summary } from './Summary';

export function Home() {
	const [errorMessage, setErrorMessage] = useState('');
	const [joinListToken, setJoinListToken] = useState('');
	const [listName, setListName] = useState('');
	const [userList, setUserList] = useContext(MyContext).userListCtx;
	const [listToken, setListToken] = useContext(MyContext).listTokenCtx;

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

	const switchList = (token) => {
		setListToken(token);
	};

	const rmListUpdate = (name, token) => {
		const updatedList = removeList(listToken, name);

		setListToken(updatedList);

		if (token === listToken) {
			setListToken(getFirstToken(JSON.parse(updatedList)));
		}
	};

	// remove and import fr utils after merge
	const isValidToken = (token) => {
		const regexPattern = /(?:\w+ ){2}\w+/;
		return regexPattern.test(token);
	};

	return (
		<div className="Home">
			{listToken && isValidToken(listToken) ? (
				<>
					<h1 className="Home__heading">Manage Lists</h1>
					<form className="form__list" onSubmit={makeNewList}>
						<label htmlFor="make-list">
							<input
								id="make-list"
								type="text"
								className="input__primary"
								placeholder="Type new list name"
								onChange={updateListName}
								value={listName}
							/>
						</label>
						<button className="btn__primary" type="submit">
							Start New List
						</button>
					</form>
					<form className="form__list" onSubmit={joinListSubmit}>
						<label htmlFor="share-list">
							{/* Join a List  */}
							<input
								id="share-list"
								type="text"
								className="input__primary"
								placeholder="Type list token"
								pattern="(?:\w+ ){2}\w+"
								title="Token must be three words separated with spaces."
								onChange={joinListChange}
								value={joinListToken}
							></input>
						</label>
						<button className="btn__primary" type="submit">
							Join a List
						</button>
					</form>
					{errorMessage && <p>{errorMessage}</p>}
					<ListSwitcher switchList={switchList} rmListUpdate={rmListUpdate} />
					<Summary />
				</>
			) : (
				<>
					<h1 className="Home__heading">Home</h1>
					<form className="form__list" onSubmit={makeNewList}>
						<label htmlFor="make-list">
							<input
								id="make-list"
								type="text"
								className="input__primary"
								placeholder="Type new list name"
								onChange={updateListName}
								value={listName}
							/>
						</label>
						<button className="btn__primary" type="submit">
							Start New List
						</button>
					</form>
					<form className="form__list" onSubmit={joinListSubmit}>
						<label htmlFor="share-list">
							<input
								id="share-list"
								type="text"
								className="input__primary"
								placeholder="Type list token"
								pattern="(?:\w+ ){2}\w+"
								title="Token must be three words separated with spaces."
								onChange={joinListChange}
								value={joinListToken}
							></input>
						</label>
						<button className="btn__primary" type="submit">
							Join a List
						</button>
					</form>
					{errorMessage && <p>{errorMessage}</p>}
				</>
			)}
		</div>
	);
}
