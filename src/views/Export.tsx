import './Export.css';
import { Calendar } from '../components/Calendar';
import { useContext } from 'react';
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
				<div className="export">
					<h1 className="export__heading">Share</h1>

					<CopyToken
						listToken={listToken}
						setListToken={setListToken}
						userList={userList}
					/>
					<Calendar listOfShoppingListItems={adjustedData} />
				</div>
			) : (
				<NoToken />
			)}
		</>
	);
}
