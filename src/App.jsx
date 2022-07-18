import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import { AddItem, Home, Layout, List } from './views';

import { getItemData, streamListItems } from './api';
import { useStateWithStorage } from './utils';

export function App() {
	const [data, setData] = useState([]);
	const navigate = useNavigate();
	// hooks must be used only w/n Component function

	/**
	 * Here, we're using a custom hook to create `listToken` and a function
	 * that can be used to update `listToken` later.
	 *
	 * `listToken` is `my test list` by default so you can see the list
	 * of items that was prepopulated for this project.
	 * You'll later set it to `null` by default (since new users do not
	 * have tokens), and use `setListToken` when you allow a user
	 * to create and join a new list.
	 */
	const [listToken, setListToken] = useStateWithStorage(
		'my token list', //will change this back
		'tcl-shopping-list-token',
	);

	useEffect(() => {
		if (!listToken) return;
		else {
			navigate('/list');
		}
		/**
		 * streamListItems` takes a `listToken` so it can commuinicate
		 * with our database; then calls a callback function with
		 * a `snapshot` from the database.
		 *
		 * Refer to `api/firebase.js`.
		 */

		return streamListItems(listToken, (snapshot) => {
			/**
			 * Read the documents in the snapshot and do some work
			 * on them, so we can save them in our React state.
			 *
			 * Refer to `api/firebase.js`
			 */
			const nextData = getItemData(snapshot);

			/** Finally, we update our React state. */
			setData(nextData);
		});
	}, [listToken]);
	// redirects 1x on first load, but omitting navigate fr deps results in warning

	function setListTokenFunction(token) {
		setListToken(token);
	}
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route
					index
					element={
						<Home
							makeNewList={(token) => {
								setListTokenFunction(token);
							}}
						/>
					}
				/>
				<Route path="/list" element={<List data={data} />} />
				<Route path="/add-item" element={<AddItem listToken={listToken} />} />
			</Route>
		</Routes>
	);
}
