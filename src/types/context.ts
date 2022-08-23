import { Item, UserList, ListToken } from './index';

export type GlobalContext = {
	userListCtx: [UserList, React.Dispatch<React.SetStateAction<any[]>>];
	dataCtx: [Item[], React.Dispatch<React.SetStateAction<any[]>>];
	listTokenCtx: [ListToken, React.Dispatch<React.SetStateAction<any[]>>];
};
