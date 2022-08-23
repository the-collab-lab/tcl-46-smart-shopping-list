/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteItem } from '../api';
import { ListItem } from '../components';
import { comparePurchaseUrgency, getUrgency } from '../utils/item';
import {
	removeList,
	getFirstToken,
	getMatchingName,
	getUserListsArr,
	updateName,
	isDuplicateName,
} from '../utils/user';
import { AddItem } from '../components/AddItem';
import NoToken from '../components/NoToken';
import ListSwitcher from '../components/ListSwitcher';
import ListTitle from '../components/ListTitle';
import { Calendar } from '../components/Calendar';

const defaultDates = { startDate: '', endDate: '' };

export function List({ data, listToken, setListToken, user }) {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState('');
	const [urgencyTerm, setUrgencyTerm] = useState('ALL');
	const [custom, setCustom] = useState(defaultDates);
	const [isDisabled, setIsDisabled] = useState(true);

	const [userToken, setUserToken] = user;
	const [listName, setListName] = useState('');

	const sortedFullList = useMemo(() => comparePurchaseUrgency(data), [data]);

	const updateRange = (e) => {
		if (e.target.name !== 'startDate' && e.target.name !== 'endDate') return;
		const newDates = { ...custom, [e.target.name]: e.target.value };
		setCustom(newDates);
	};

	const customDateRange = (start, end) => {
		if (!start || !end) return () => true;
		const start_IN_MS = new Date(start).getTime();
		const end_IN_MS = new Date(end).getTime();
		return (item) =>
			item.dateNextPurchased.toMillis() >= start_IN_MS &&
			item.dateNextPurchased.toMillis() < end_IN_MS;
	};

	const undoUrgency = () => {
		const selected = document.querySelector('select[name="urgency"]');
		setUrgencyTerm('ALL');
	};

	useEffect(() => {
		if (listToken === 'null') {
			setUserToken('{}');
			return;
		}
		if (!getUserListsArr(userToken).length) {
			setListName('');
			return;
		}

		if (listName !== getMatchingName(userToken, listToken)) {
			setListName(getMatchingName(userToken, listToken));
		}
	}, [userToken, listToken]);

	const filterList = (list) => {
		const cleanup = (inputString) => {
			return inputString.toLowerCase().trim().replace(/\s+/g, ' ');
		};
		return list.filter(({ name }) =>
			cleanup(name).includes(cleanup(searchTerm)),
		);
	};

	const renderedList = filterList(sortedFullList)
		.filter((item) => item.name !== '')
		.filter(getUrgency(urgencyTerm))
		.filter(customDateRange(custom.startDate, custom.endDate));

	const switchList = (token) => {
		setListToken(token);
	};

	const rmListUpdate = (name, token) => {
		const updatedList = removeList(userToken, name);

		setUserToken(updatedList);

		if (token === listToken) {
			setListToken(getFirstToken(JSON.parse(updatedList)));
		}
	};

	const clearSearchTerm = () => {
		setSearchTerm('');
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
					const updatedList = removeList(
						userToken,
						getMatchingName(userToken, listToken),
					);
					setUserToken(updatedList);
					setListToken(getFirstToken(JSON.parse(updatedList)));
					navigate('/');
				});
		}
	};

	const editName = (e) => {
		e.preventDefault();
		setIsDisabled(!isDisabled);

		if (isDisabled) return;

		if (listName === '' || isDuplicateName(userToken, listName, listToken)) {
			setListName(listToken);
			setUserToken(updateName(userToken, listToken));
		} else setUserToken(updateName(userToken, listToken, listName));
	};

	const updateListName = (e) => {
		setListName(e.target.value);
	};

	return (
		<>
			{listToken && listToken !== 'null' ? (
				data.length > 1 ? (
					<div>
						<ListTitle
							editName={editName}
							isDisabled={isDisabled}
							updateListName={updateListName}
							listName={listName}
						/>
						<AddItem data={data} listToken={listToken} user={user} />
						<label>
							Find an item
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
						<fieldset>
							<legend>Search by custom purchase-by date range</legend>
							<label>
								Start date:
								<input
									type="date"
									value={custom.startDate}
									name="startDate"
									max={custom.endDate}
									onChange={updateRange}
								/>
							</label>
							<label>
								End date:
								<input
									type="date"
									value={custom.endDate}
									name="endDate"
									min={custom.startDate}
									onChange={updateRange}
								/>
							</label>
							<button
								type="button"
								onClick={() => setCustom(defaultDates)}
								aria-live="polite"
							>
								Clear custom range
							</button>
						</fieldset>
						<div>
							<label>
								Show by urgency
								<select
									value={urgencyTerm}
									onChange={(e) => setUrgencyTerm(e.target.value)}
									name="urgency"
								>
									<option value="ALL">Choose urgency</option>
									<option value="SOON">Soon</option>
									<option value="KIND_OF_SOON">Kind Of Soon</option>
									<option value="NOT_SOON">Not Soon</option>
									<option value="OVERDUE">Overdue</option>
									<option value="INACTIVE">Inactive</option>
								</select>
							</label>
							<button type="button" onClick={undoUrgency} aria-live="polite">
								Clear urgency selection
							</button>
						</div>
						<ul>
							{renderedList.map((item) => (
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
						<ListTitle
							editName={editName}
							isDisabled={isDisabled}
							updateListName={updateListName}
							listName={listName}
						/>
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
			{/* need renderedList lifted up before calendar can be moved nicely */}
			<Calendar renderedList={renderedList} />
		</>
	);
}