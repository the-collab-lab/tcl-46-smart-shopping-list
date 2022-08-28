import {
	UserList,
	ParsedUserList,
	ListToken,
	ListName,
	UserListArr,
} from '../types';

/** Returns updated User List with new List */
export const addList = (
	userList: UserList,
	listName: ListName,
	newToken: ListToken,
): UserList =>
	JSON.stringify(
		rmNullToken({
			...JSON.parse(userList),
			[listName || newToken]: newToken,
		}),
	);

/** Checks if token already exists in user list */
export const hasToken = (userList: UserList, listToken: ListToken): boolean =>
	Object.values(JSON.parse(userList)).includes(listToken);

/** Converts user list to a 2D List Array */
export const getUserListsArr = (userList: UserList): UserListArr =>
	Object.entries(JSON.parse(userList));

/** Returns first token in user list or null if none */
export const getFirstToken = (userLists: ParsedUserList): ListToken | null =>
	Object.entries(userLists).length ? Object.entries(userLists)[0][1] : null;

/** Returns list with updated name  */
export const updateName = (
	userList: UserList,
	listToken: ListToken,
	value?: ListName,
): UserList => {
	const prevList: ParsedUserList = JSON.parse(userList);

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
	userList: UserList,
	listName: ListName,
	listToken: ListToken,
): boolean =>
	getUserListsArr(userList)
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
	userList: UserList,
	listToken: ListToken,
): ListName =>
	getUserListsArr(userList).find(([, token]) => token === listToken)[0];

/** Remove list from user lists by name */
export const removeList = (userList, name: ListName): UserList => {
	const tokenLists: ParsedUserList = JSON.parse(userList);
	delete tokenLists[name];
	return JSON.stringify(tokenLists);
};
