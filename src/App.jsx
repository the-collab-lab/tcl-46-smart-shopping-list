import { useEffect, useState } from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';

import { AddItem, Home, Layout, List } from './views';

import { getItemData, streamListItems } from './api';
import { useStateWithStorage } from './utils';
import { generateToken } from '@the-collab-lab/shopping-list-utils';

export function App() {
	const [data, setData] = useState([]);

	// the following state works as a flag to redirect 1x on load, then lets user navigate to Home if wanted.
	const [visited, setVisited] = useState(false);
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
		null,
		'tcl-shopping-list-token',
	);

	const makeNewList = () => {
		/**
		 * Check local storage for token
		 * -- if none,*/
		const newToken = generateToken();
		// useStateWithStorage saves that to localStorage

		// update value of listToken
		setListToken(newToken);

		// go to List view by toggling the 'visited' state
		setVisited(false);
	};

	useEffect(() => {
		if (!listToken) return;
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

	return (
		<Router>
			<Routes>
				<Route path="/" element={<Layout toggle={setVisited} />}>
					<Route
						index
						element={
							listToken && visited === false ? (
								<Navigate to="/list" />
							) : (
								// Navigate also updates the path, unlike if <List /> element went here directly.
								<Home makeList={makeNewList} />
							)
						}
					/>
					<Route path="/list" element={<List data={data} />} />
					<Route path="/add-item" element={<AddItem />} />
				</Route>
			</Routes>
		</Router>
	);
}
