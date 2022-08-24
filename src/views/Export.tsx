import { Calendar } from '../components/Calendar';
import { useContext, useEffect } from 'react';
import { MyContext } from '../App';
import { CopyToken } from '../components/CopyToken';
import NoToken from '../components/NoToken';
import { isValidToken } from '../utils';
export function Export() {
	const [adjustedData] = useContext(MyContext).adjustedDataCtx;
	const [listToken, setListToken] = useContext(MyContext).listTokenCtx;
	const [userList] = useContext(MyContext).userListCtx;

	return (
		<>
			{listToken && isValidToken(listToken) ? (
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
