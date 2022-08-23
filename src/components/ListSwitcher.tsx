import React from 'react';
import { getUserListsArr } from '../utils/user';

const ListSwitcher = ({ userToken, switchList, rmListUpdate }) => {
	return (
		<div>
			<h1>My Lists</h1>
			{getUserListsArr(userToken)
				.filter(([_, token]) => token)
				.map(([name, token]) => (
					<div key={token}>
						<button onClick={() => switchList(token)}>
							<b>{name === 'listToken' ? 'Default List' : name}</b>
						</button>
						<button onClick={() => rmListUpdate(name, token)}>Untrack</button>
					</div>
				))}
		</div>
	);
};

export default ListSwitcher;
