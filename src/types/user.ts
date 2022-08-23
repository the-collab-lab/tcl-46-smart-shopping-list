import { ListToken, ListName } from './index';

export type ParsedUserList =
	| {
			[key: string]: ListToken;
	  }
	| {};

export type UserList = string;

export type setUserList = React.Dispatch<any>;

export type User = [UserList, setUserList];

export type UserListArr = [ListName, ListToken][];
