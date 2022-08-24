import { Calendar } from '../components/Calendar';
import { useContext } from 'react';
import { MyContext } from '../App';
import { Copytoken } from '../components/Copytoken';
export function Export() {
	const [adjustedData] = useContext(MyContext).adjustedDataCtx;
	const [listToken, setListToken] = useContext(MyContext).listTokenCtx;
	const [userList] = useContext(MyContext).userListCtx;

	return (
		<>
			<Calendar listOfShoppingListItems={adjustedData} />
			<Copytoken
				listToken={listToken}
				setListToken={setListToken}
				userList={userList}
			/>
		</>
	);
}
