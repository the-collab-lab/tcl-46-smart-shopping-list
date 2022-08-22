import {
	type User,
	UserList,
	SetUserList,
	ParsedUserList,
	ListToken,
	ListName,
	UserListArr,
} from '../types';

import { isEmpty } from '../utils';

/** Returns updated User List with new List */
export const addList = (
	userToken: UserList,
	listName: ListName,
	newToken: ListToken,
): UserList =>
	JSON.stringify(
		rmNullToken({
			...JSON.parse(userToken),
			[listName || newToken]: newToken,
		}),
	);

/** Checks if token already exists in user list */
export const hasToken = (userToken: UserList, listToken: ListToken): boolean =>
	Object.values(JSON.parse(userToken)).includes(listToken);

/** Converts user list to a 2D List Array */
export const getUserListsArr = (userToken: UserList): UserListArr =>
	Object.entries(JSON.parse(userToken));

/** Returns first token in user list or null if none */
export const getFirstToken = (userLists: ParsedUserList): ListToken | null =>
	Object.entries(userLists).length ? Object.entries(userLists)[0][1] : null;

/** Returns list with updated name  */
export const updateName = (
	userToken: UserList,
	listToken: ListToken,
	value?: ListName,
): UserList => {
	const prevList: ParsedUserList = JSON.parse(userToken);

	for (let name in prevList) {
		if (prevList[name] === listToken) {
			delete prevList[name];
		}
	}

	return JSON.stringify({
		...prevList,
		[value || listToken]: listToken,
	});
};

/** Checks whether the name passed in has an existing duplicate name */
export const isDuplicateName = (
	userToken: UserList,
	listName: ListName,
	listToken: ListToken,
): boolean =>
	getUserListsArr(userToken)
		.filter(([, token]) => token !== listToken)
		.some(([name]) => name === listName);

/** Remove any user lists that are null */
export function rmNullToken(list: ParsedUserList): ParsedUserList {
	const userList = list;

	for (let name in userList) {
		if (userList[name] === null) {
			delete userList[name];
		}
	}
	return userList;
}

/** Finds name that matches passed in token */
export const getMatchingName = (
	userToken: UserList,
	listToken: ListToken,
): ListName =>
	getUserListsArr(userToken).find(([, token]) => token === listToken)[0];

/** Remove list from user lists by name */
export const removeList = (user: User, name: ListName): ParsedUserList => {
	const [userToken, setUserToken] = user;

	const tokenLists: ParsedUserList = JSON.parse(userToken);
	delete tokenLists[name];

	setUserToken(JSON.stringify(tokenLists));
	return tokenLists;
};
