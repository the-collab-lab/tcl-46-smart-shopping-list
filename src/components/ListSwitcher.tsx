import { useContext } from 'react';
import { MyContext } from '../App';
import { getUserListsArr } from '../utils/user';

const ListSwitcher = ({ switchList, rmListUpdate, deleteListFake }) => {
	const [userList] = useContext(MyContext).userListCtx;
	return (
		<div>
			<h2>Manage Lists</h2>
			{getUserListsArr(userList)
				.filter(([_, token]) => token)
				.map(([name, token]) => (
					<div key={token}>
						<button onClick={() => switchList(token)}>
							<b>{name === 'listToken' ? 'Default List' : name}</b>
						</button>
						<button onClick={() => rmListUpdate(name, token)}>Untrack</button>
						<button onClick={deleteListFake}>Delete List</button>
					</div>
				))}
		</div>
	);
};

export default ListSwitcher;
