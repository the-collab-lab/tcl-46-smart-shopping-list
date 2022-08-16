import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteItem } from '../api';
import { ListItem } from '../components';
import { comparePurchaseUrgency } from '../utils/item';
import {
	removeList,
	setTokenFirstList,
	getMatchingName,
	updateName,
} from '../utils/user';
import NoToken from '../components/NoToken';
import ListSwitcher from '../components/ListSwitcher';

export function List({ data, listToken, setListToken, user }) {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState('');
	const [copied, setCopied] = useState('');
	const [isDisabled, setIsDisabled] = useState(true);

	const [userToken, setUserToken] = user;
	const [listName, setListName] = useState(
		getMatchingName(userToken, listToken),
	);

	const sortedFullList = useMemo(() => comparePurchaseUrgency(data), [data]);

	useEffect(() => {
		if (copied) setTimeout(() => setCopied(''), 2000);
		if (listName !== getMatchingName(userToken, listToken)) {
			setListName(getMatchingName(userToken, listToken));
		}
	}, [copied, listToken]);

	const filterList = (list) => {
		const cleanup = (inputString) => {
			return inputString.toLowerCase().trim().replace(/\s+/g, ' ');
		};
		return list.filter(({ name }) =>
			cleanup(name).includes(cleanup(searchTerm)),
		);
	};

	const switchList = (token) => {
		setListToken(token);
	};

	const rmListUpdate = (name, token) => {
		const userLists = removeList(user, name);

		if (token === listToken) {
			setTokenFirstList(setListToken, userLists);
		}
	};

	const clearSearchTerm = () => {
		setSearchTerm('');
	};

	const copyToken = () => {
		navigator.clipboard
			.writeText(listToken)
			.then(() => setCopied('Copied!'))
			.catch(() => setCopied('Not Copied.'));
	};

	const deleteList = () => {
		if (
			window.confirm(
				'Are you sure you want to delete your shopping list? This cannot be undone.',
			)
		) {
			const itemsToBeDeleted = [];
			data.forEach((item) => {
				itemsToBeDeleted.push(deleteItem(listToken, item.id));
			});
			Promise.all(itemsToBeDeleted)
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					const userLists = removeList(
						user,
						getMatchingName(userToken, listToken),
					);
					setTokenFirstList(setListToken, userLists);
					navigate('/');
				});
		}
	};

	const editName = (e) => {
		e.preventDefault();
		if (!isDisabled) {
			updateName(user, listName, listToken);
		}
		setIsDisabled(!isDisabled);
	};

	const updateListName = (e) => {
		setListName(e.target.value);
	};

	return (
		<>
			{listToken ? (
				data.length > 1 ? (
					<div>
						<form onSubmit={editName}>
							<input
								readOnly={isDisabled}
								style={
									isDisabled
										? {
												outline: 'none',
												borderWidth: 0,
												backgroundColor: 'transparent',
												width: '100%',
												fontSize: '28px',
										  }
										: {
												backgroundColor: 'white',
												borderWidth: '2px',
												width: '100%',
												fontSize: '28px',
										  }
								}
								onChange={updateListName}
								value={listName}
							></input>
							<button type="submit">{isDisabled ? 'Edit' : 'Save'}</button>
						</form>
						<label>
							Filter Items
							<input
								type="text"
								placeholder="start typing here..."
								id="filter"
								name="filter"
								value={searchTerm}
								onChange={(e) => {
									setSearchTerm(e.target.value);
								}}
							/>
						</label>
						<button type="button" onClick={clearSearchTerm} aria-live="polite">
							clear
						</button>
						<div>
							<p>
								Copy token to allow others join your list:
								<button onClick={copyToken} id="token">
									{copied ? copied : listToken}
								</button>
							</p>
						</div>
						<ul>
							{filterList(sortedFullList)
								.filter((item) => item.name !== '')
								.map((item) => (
									<ListItem
										{...item}
										listToken={listToken}
										key={item.id}
										itemId={item.id}
									/>
								))}
						</ul>
						<button onClick={deleteList}>Delete List</button>
						<ListSwitcher
							userToken={userToken}
							switchList={switchList}
							rmListUpdate={rmListUpdate}
						/>
					</div>
				) : (
					<div>
						<h2>Welcome to your smart shopping list!</h2>
						<p>
							This app will learn from your purchasing habits and help you
							prioritize and plan your shopping list.
						</p>
						Copy token to share your list with others:
						<button onClick={copyToken} id="token">
							{copied ? copied : listToken}
						</button>
						<Link to="/add-item">
							<button type="button">Start adding items</button>
						</Link>
						<button onClick={deleteList}>Delete List</button>
						<ListSwitcher
							userToken={userToken}
							switchList={switchList}
							rmListUpdate={rmListUpdate}
						/>
					</div>
				)
			) : (
				<NoToken />
			)}
		</>
	);
}
