import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../App';
import { streamListItems, getItemData, deleteItem } from '../api';
import {
	getUserListsArr,
	removeList,
	getFirstToken,
	getMatchingName,
} from '../utils/user';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const ListSwitcher = () => {
	const navigate = useNavigate();
	const [userList, setUserList] = useContext(MyContext).userListCtx;
	const [listToken, setListToken] = useContext(MyContext).listTokenCtx;

	const switchList = (token) => {
		setListToken(token);
	};

	const rmListUpdate = (name, chosenToken) => {
		const updatedList = removeList(userList, name);
		setUserList(updatedList);
		if (chosenToken === listToken) {
			setListToken(getFirstToken(JSON.parse(updatedList)));
		}
	};

	const deleteList = (chosenToken) => {
		if (
			window.confirm(
				'Are you sure you want to delete your shopping list? This cannot be undone.',
			)
		) {
			const itemsToBeDeleted = [];
			return streamListItems(chosenToken, (snapshot) => {
				const dataToDelete = getItemData(snapshot);
				dataToDelete.forEach((item) => {
					itemsToBeDeleted.push(deleteItem(chosenToken, item.id));
				});
				Promise.all(itemsToBeDeleted)
					.catch((err) => {
						console.log(err);
					})
					.finally(() => {
						const updatedList = removeList(
							userList,
							getMatchingName(userList, chosenToken),
						);
						setUserList(updatedList);
						setListToken(getFirstToken(JSON.parse(updatedList)));
						navigate('/');
					});
			});
		}
	};

	return (
		<div className="ListSwitcher">
			<h2 className="ListSwitcher__heading main">My Lists</h2>
			{getUserListsArr(userList)
				.filter(([_, token]) => token)
				.map(([name, token]) => (
					<div key={token} className="Listswitcher__listUnit">
						<button
							className="ListSwitcher__btn listName"
							onClick={() => switchList(token)}
						>
							<b>{name === 'listToken' ? 'Default List' : name}</b>
						</button>
						<button
							className="ListSwitcher__btn trackerToggle"
							onClick={() => rmListUpdate(name, token)}
						>
							Untrack
						</button>
						<button
							className="btn__delete"
							onClick={() => deleteList(token)}
							aria-label="Delete List"
						>
							<FontAwesomeIcon icon={faTrashAlt} />
						</button>
					</div>
				))}
		</div>
	);
};

export default ListSwitcher;
