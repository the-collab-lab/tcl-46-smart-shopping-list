import { ListToken, ListName } from './index';

export type ParsedUserList =
	| {
			[key: string]: ListToken;
	  }
	| {};

export type UserList = string;

export type SetUserList = React.Dispatch<any>;

export type User = [UserList, SetUserList];

export type UserListArr = [ListName, ListToken][];
