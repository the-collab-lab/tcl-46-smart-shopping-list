import { Calendar } from '../components/Calendar';
import { useContext } from 'react';
import { MyContext } from '../App';
import { Copytoken } from '../components/Copytoken';
export function Export() {
	const [adjustedData] = useContext(MyContext).adjustedDataCtx;
	const [listToken] = useContext(MyContext).listTokenCtx;
	return (
		<>
			<Calendar listOfShoppingListItems={adjustedData} />
			<Copytoken listToken={listToken} />
		</>
	);
}
