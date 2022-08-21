/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteItem } from '../api';
import { ListItem } from '../components';
import { comparePurchaseUrgency, getUrgency } from '../utils/item';
import {
	removeList,
	setTokenFirstList,
	getMatchingName,
	getUserListsArr,
	updateName,
} from '../utils/user';
import NoToken from '../components/NoToken';
import {
	ICalendar,
	GoogleCalendar,
	OutlookCalendar,
	YahooCalendar,
} from 'datebook';
import ListSwitcher from '../components/ListSwitcher';
import ListTitle from '../components/ListTitle';

const defaultDates = { startDate: '', endDate: '' };

export function List({ data, listToken, setListToken, user }) {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState('');
	const [copied, setCopied] = useState('');
	const [urgencyTerm, setUrgencyTerm] = useState('ALL');
	const [custom, setCustom] = useState(defaultDates);
	const [isDisabled, setIsDisabled] = useState(true);

	const [userToken] = user;
	const [listName, setListName] = useState('');
	const [exclude, setExclude] = useState(false);

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
		selected.selectedIndex = 0;
		setUrgencyTerm('ALL');
	};

	useEffect(() => {
		if (copied) setTimeout(() => setCopied(''), 2000);
	}, [copied]);

	useEffect(() => {
		if (getUserListsArr(userToken).length === 0) {
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

	const excludeChecked = (array) => {
		return array.filter((item) => !item.isChecked);
	};

	const renderedList = filterList(sortedFullList)
		.filter((item) => item.name !== '')
		.filter(getUrgency(urgencyTerm))
		.filter(customDateRange(custom.startDate, custom.endDate));

	const excludeCheckList = excludeChecked(renderedList);

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
	const listOfShoppingListItems = [];

	// this is not inside a function?
	!exclude
		? renderedList.forEach((item) => {
				listOfShoppingListItems.push(item.name);
		  })
		: excludeChecked(renderedList).forEach((item) => {
				listOfShoppingListItems.push(item.name);
		  });

	const handleCalendarDownload = (evt) => {
		const defaultStartTime = new Date(Date());
		const dt = new Date();
		dt.setHours(dt.getHours() + 1);
		const defaultEndTime = dt;
		const eventConfig = {
			title: 'Shopping trip',
			description: listOfShoppingListItems.join('\n'),
			start: defaultStartTime,
			end: defaultEndTime,
		};
		if (evt.target.name === 'ical') {
			const ical = new ICalendar(eventConfig);
			ical.download();
		} else if (evt.target.name === 'google') {
			const googleCalendar = new GoogleCalendar(eventConfig);
			window.open(googleCalendar.render());
		} else if (evt.target.name === 'outlook') {
			const outlookCalendar = new OutlookCalendar(eventConfig);
			window.open(outlookCalendar.render());
		} else {
			const yahooCalendar = new YahooCalendar(eventConfig);
			window.open(yahooCalendar.render());
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
						<ListTitle
							editName={editName}
							isDisabled={isDisabled}
							updateListName={updateListName}
							listName={listName}
						/>
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

						<div>
							<p>
								Copy token to allow others join your list:
								<button type="button" onClick={copyToken} id="token">
									{copied ? copied : listToken}
								</button>
							</p>
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
			<div>
				<p>
					You have {listOfShoppingListItems.length} items in your current
					shopping cart.
				</p>
				<button
					type="button"
					id="excludeCheckedItems"
					aria-pressed={exclude}
					onClick={() => setExclude(!exclude)}
				>
					{exclude ? `Include checked items` : `Exclude checked items`}
				</button>
				<p>Want to add a shopping trip to your calendar? </p>
				<button type="button" onClick={handleCalendarDownload} name="ical">
					iCalendar
				</button>
				<button type="button" onClick={handleCalendarDownload} name="google">
					Google Calendar
				</button>
				<button type="button" onClick={handleCalendarDownload} name="outlook">
					Outlook Calendar
				</button>
				<button type="button" onClick={handleCalendarDownload} name="yahoo">
					Yahoo Calendar
				</button>
			</div>
		</>
	);
}
