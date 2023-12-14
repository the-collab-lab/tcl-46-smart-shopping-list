/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, createContext, Context } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ArchivalNoticeModal } from '@the-collab-lab/shopping-list-utils';

import { Home, Layout, List, Export } from './views';

import { getItemData, streamListItems } from './api';
import { useStateWithStorage } from './utils';
import { type GlobalContext } from './types';

export const MyContext: Context<GlobalContext> | Context<any> = createContext({
	dataCtx: [],
	userListCtx: [],
	listTokenCtx: [],
	adjustedDataCtx: [],
});

export function App() {
	const [data, setData] = useState([]);
	const navigate = useNavigate();
	const [adjustedData, setAdjustedData] = useState(data);

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
				adjustedDataCtx: [adjustedData, setAdjustedData],
			}}
		>
			<Routes>
				<Route
					path="/"
					element={
						<>
							<ArchivalNoticeModal />
							<Layout />
						</>
					}
				>
					<Route index element={<Home />} />
					<Route path="/list" element={<List />} />
					<Route path="/export" element={<Export />} />
				</Route>
			</Routes>
		</MyContext.Provider>
	);
}
