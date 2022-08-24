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
	const [data] = useContext(MyContext).dataCtx;

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

	/**
	 Changes needed from deleteList functionality in List:
	 * data provided to the List's deleteList function is based on the current listToken.
	 * the new button in Home needs to 
	 * 	take listToken from matching listname being mapped, rather than the current listToken
	 * iterate over data based on that list, rather than the current listToken, to push to itemstodelete
	 * the above list token also needs to be passed to removeList.
	
	 * 
	 */
	const deleteListFake = () => {
		if (
			window.confirm(
				'Are you sure you want to delete your shopping list? This cannot be undone.',
			)
		) {
			const itemsToBeDeleted = [];
			data.forEach((item) => {
				console.log(`item to remove: ${item.name}`);
				itemsToBeDeleted.push(item);
				// itemsToBeDeleted.push(deleteItem(listToken, item.id));
			});
			// Promise.all(itemsToBeDeleted)
			// 	.catch((err) => {
			// 		console.log(err);
			// 	})
			// 	.finally(() => {
			// 		const updatedList = removeList(
			// 			userList,
			// 			getMatchingName(userList, listToken),
			// 		);
			// 		setUserList(updatedList);
			// 		setListToken(getFirstToken(JSON.parse(updatedList)));
			// 		navigate('/');
			// 	});
		}
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
			<ListSwitcher
				switchList={switchList}
				rmListUpdate={rmListUpdate}
				deleteListFake={deleteListFake}
			/>
			<Summary />
		</div>
	);
}
