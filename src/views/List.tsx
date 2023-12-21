/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from 'react';
import { ListItem } from '../components';
import {
	getMatchingName,
	getUserListsArr,
	updateName,
	isDuplicateName,
} from '../utils/user';
import { isEmpty, isValidToken } from '../utils';
import NoToken from '../components/NoToken';

import ListTitle from '../components/ListTitle';
import { MyContext } from '../App';
import { AddItem } from '../components/AddItem';
import Filter from '../components/Filter';

export function List() {
	const [searchTerm, setSearchTerm] = useState('');
	const [isDisabled, setIsDisabled] = useState(true);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [listToken, setListToken] = useContext(MyContext).listTokenCtx;
	const [userList, setUserList] = useContext(MyContext).userListCtx;
	const [data] = useContext(MyContext).dataCtx;
	const [adjustedData, setAdjustedData] = useContext(MyContext).adjustedDataCtx;

	const [listName, setListName] = useState('');

	useEffect(() => {
		if (listToken === 'null') {
			setUserList('{}');
			return;
		}
		if (!getUserListsArr(userList).length) {
			setListName('');
			return;
		}

		if (listName !== getMatchingName(userList, listToken)) {
			setListName(getMatchingName(userList, listToken));
		}
	}, [userList, listToken]);

	const editName = (e) => {
		e.preventDefault();
		setIsDisabled(!isDisabled);

		if (isDisabled) return;

		if (isEmpty(listName) || isDuplicateName(userList, listName, listToken)) {
			setListName(listToken);
			setUserList(updateName(userList, listToken));
		} else setUserList(updateName(userList, listToken, listName));
	};

	const updateListName = (e) => {
		setListName(e.target.value);
	};

	return (
		<div>
			{listToken && isValidToken(listToken) ? (
				data.length > 1 ? (
					<div>
						<ListTitle
							editName={editName}
							isDisabled={isDisabled}
							updateListName={updateListName}
							listName={listName}
						/>
						<AddItem hasItems={true} />
						<Filter
							searchTerm={searchTerm}
							setSearchTerm={setSearchTerm}
							setAdjustedData={setAdjustedData}
						/>
						{adjustedData.map((item) => (
							<ListItem
								{...item}
								listToken={listToken}
								key={item.id}
								itemId={item.id}
							/>
						))}
					</div>
				) : (
					<div className="ListBody">
						<ListTitle
							editName={editName}
							isDisabled={isDisabled}
							updateListName={updateListName}
							listName={listName}
						/>
						<p>Welcome!</p>
						<p>
							This app will learn from your purchasing habits and help you
							prioritize and plan your shopping list.
						</p>
						<p>Add an item to get started!</p>
						<AddItem hasItems={false} />
					</div>
				)
			) : (
				<NoToken />
			)}
		</div>
	);
}
