import { Calendar } from '../components/Calendar';
import { useContext, useEffect } from 'react';
import { MyContext } from '../App';
import { CopyToken } from '../components/CopyToken';
import NoToken from '../components/NoToken';
export function Export() {
	const [adjustedData] = useContext(MyContext).adjustedDataCtx;
	const [listToken, setListToken] = useContext(MyContext).listTokenCtx;
	const [userList] = useContext(MyContext).userListCtx;

	const isValidToken = (token) => {
		const regexPattern = /(?:\w+ ){2}\w+/;
		return regexPattern.test(token);
	};

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
