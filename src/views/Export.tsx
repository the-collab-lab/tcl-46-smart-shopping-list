import { Calendar } from '../components/Calendar';
import { useContext } from 'react';
import { MyContext } from '../App';
import { CopyToken } from '../components/CopyToken';
import { getUserListsArr } from '../utils/user';
import NoToken from '../components/NoToken';
export function Export() {
	const [adjustedData] = useContext(MyContext).adjustedDataCtx;
	const [listToken, setListToken] = useContext(MyContext).listTokenCtx;
	const [userList] = useContext(MyContext).userListCtx;

	return (
		<>
			{listToken && listToken !== 'null' ? (
				<>
					<Calendar listOfShoppingListItems={adjustedData} />
					<CopyToken
						listToken={listToken}
						setListToken={setListToken}
						userList={userList}
					/>
				</>
			) : (
				<NoToken />
			)}
		</>
	);
}

// bug of empty new name string reappeared
