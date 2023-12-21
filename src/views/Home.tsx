import './Home.css';
import { useState, useContext } from 'react';
import { MyContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { getItemData, streamListItems } from '../api';

import { addList, hasToken } from '../utils/user';
import { ListToken } from '../types';
import { isValidToken } from '../utils';
import ListSwitcher from '../components/ListSwitcher';
import NoTokenWelcome from '../components/NoTokenWelcome';
import { Summary } from './Summary';
import { ArchivalNoticeModal } from '@the-collab-lab/shopping-list-utils';

export function Home() {
	const [errorMessage, setErrorMessage] = useState('');
	const [joinListToken, setJoinListToken] = useState('');
	const [listName, setListName] = useState('');
	const [userList, setUserList] = useContext(MyContext).userListCtx;
	const [listToken, setListToken] = useContext(MyContext).listTokenCtx;

	const navigate = useNavigate();

	// function addPlaceholderItem(listId) {
	// 	addItem(listId, { itemName: '', daysUntilNextPurchase: 0 });
	// }

	function makeNewList(e) {
		e.preventDefault();
		// const newToken = generateToken();

		// setUserList(addList(userList, listName, newToken as ListToken));
		// setListToken(newToken);
		// addPlaceholderItem(newToken);

		// navigate('/list');
		console.log('Creating new lists is no longer supported');
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
			{listToken && isValidToken(listToken) ? (
				<div className="Home__container">
					<h1 className="Home__heading">Manage Lists</h1>
					<form className="form__list" onSubmit={makeNewList}>
						<input
							id="make-list"
							type="text"
							className="input__primary"
							placeholder="Type new list name"
							onChange={updateListName}
							value={listName}
						/>

						<button className="btn__primary" type="submit">
							Start New List
						</button>
					</form>
					<form className="form__list" onSubmit={joinListSubmit}>
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

						<button className="btn__primary" type="submit">
							Join a List
						</button>
					</form>
					{errorMessage && <p className="error">{errorMessage}</p>}

					<div className="container__token-detail">
						<Summary />
						<ListSwitcher />
					</div>
				</div>
			) : (
				<NoTokenWelcome
					updateListName={updateListName}
					makeNewList={makeNewList}
					joinListSubmit={joinListSubmit}
					joinListChange={joinListChange}
					joinListToken={joinListToken}
					listName={listName}
					errorMessage={errorMessage}
				/>
			)}
			<ArchivalNoticeModal />
		</div>
	);
}
