/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, createContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import { AddItem, Home, Layout, List, Summary } from './views';

import { getItemData, streamListItems } from './api';
import { useStateWithStorage } from './utils';

export const MyContext = createContext({});

export function App() {
	const [data, setData] = useState([]);
	const navigate = useNavigate();

	const [listToken, setListToken] = useStateWithStorage(
		null,
		'tcl-shopping-list-token',
	);

	const [userList, setUserList] = useStateWithStorage(
		JSON.stringify({ listToken }),
		'tcl-user-lists',
	);

	useEffect(() => {
		if (!listToken) return;
		else {
			navigate('/list');
		}
		return streamListItems(listToken, (snapshot) => {
			const nextData = getItemData(snapshot);

			setData(nextData);
		});
	}, [listToken]);

	return (
		<MyContext.Provider
			value={{
				dataCtx: [data, setData],
				listTokenCtx: [listToken, setListToken],
				userListCtx: [userList, setUserList],
			}}
		>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="/list" element={<List />} />
					<Route path="/add-item" element={<AddItem />} />
					<Route path="/summary" element={<Summary />} />
				</Route>
			</Routes>
		</MyContext.Provider>
	);
}
