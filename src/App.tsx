import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import { Home, Layout, List, Export } from './views';

import { getItemData, streamListItems } from './api';
import { useStateWithStorage } from './utils';

export function App() {
	const [data, setData] = useState([]);
	const navigate = useNavigate();

	const [listToken, setListToken] = useStateWithStorage(
		null,
		'tcl-shopping-list-token',
	);

	const [userToken, setUserToken] = useStateWithStorage(
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
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route
					index
					element={
						<Home
							listToken={listToken}
							setListToken={setListToken}
							user={[userToken, setUserToken]}
							data={data} //temp for moving
						/>
					}
				/>
				<Route
					path="/list"
					element={
						<List
							data={data}
							listToken={listToken}
							setListToken={setListToken}
							user={[userToken, setUserToken]}
						/>
					}
				/>
				{/* path needs update but breaks currently */}
				<Route
					path="/export"
					element={
						<Export
							data={data}
							listToken={listToken}
							setListToken={setListToken}
							user={[userToken, setUserToken]}
						/>
					}
				/>
			</Route>
		</Routes>
	);
}
