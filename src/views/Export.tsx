import { Calendar } from '../components/Calendar';
import { useContext } from 'react';
import { MyContext } from '../App';
import { CopyToken } from '../components/CopyToken';
export function Export() {
	const [adjustedData] = useContext(MyContext).adjustedDataCtx;
	const [listToken, setListToken] = useContext(MyContext).listTokenCtx;
	const [userList] = useContext(MyContext).userListCtx;

	return (
		<>
			<Calendar listOfShoppingListItems={adjustedData} />
			<CopyToken
				listToken={listToken}
				setListToken={setListToken}
				userList={userList}
			/>
		</>
	);
}
