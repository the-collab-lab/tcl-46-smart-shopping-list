import { Item, UserList } from './index';

export type GlobalContext = {
	userListCtx: [UserList, React.Dispatch<React.SetStateAction<string>>];
	dataCtx: [Item[], React.Dispatch<React.SetStateAction<any[]>>];
	listTokenCtx: [string, React.Dispatch<React.SetStateAction<string>>];
	adjustedDataCtx: [Item[], React.Dispatch<React.SetStateAction<any[]>>];
};
