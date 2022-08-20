import {
	type User,
	UserList,
	SetUserList,
	ParsedUserList,
	ListToken,
	ListName,
	UserListArr,
} from '../types';

/** Adds a new list to User List Token with a new List Name and Token */
export const addNewListToUser = (
	user: User,
	listName: ListName,
	newToken: ListToken,
): ParsedUserList => {
	const [userToken, setUserToken] = user;
	const tokenLists: ParsedUserList = JSON.parse(userToken);

	if (!listName) listName = newToken;
	const updatedList: ParsedUserList = rmNullToken({
		...tokenLists,
		[listName]: newToken,
	});

	setUserToken(JSON.stringify(updatedList));
	return updatedList;
};

/** Sets a new user token */
export const setNewUserToken = (
	user: User,
	newToken: ListToken,
	listName: ListName,
): ParsedUserList => {
	const [, setUserToken] = user;

	setUserToken(JSON.stringify({ [listName ? listName : newToken]: newToken }));
	return { [listName]: newToken };
};

/** Converts user list to a 2D List Array */
export const getUserListsArr = (userToken: UserList): UserListArr =>
	Object.entries(JSON.parse(userToken));

/** Updates List Token to First entry in User List */
export const setTokenFirstList = (
	setListToken: SetUserList,
	userLists: ParsedUserList,
): ListToken => {
	let token: ListToken = null;
	if (Object.entries(userLists).length) {
		token = Object.entries(userLists)[0][1];
	}
	setListToken(token);
	return token;
};

/** Update Name of a list  */
export const updateName = (
	user: User,
	value: ListName,
	listToken: ListToken,
): ParsedUserList => {
	const [userToken, setUserToken] = user;
	const prevList: ParsedUserList = JSON.parse(userToken);

	for (let name in prevList) {
		if (prevList[name] === listToken) {
			delete prevList[name];
		}
	}

	setUserToken(JSON.stringify({ ...prevList, [value]: listToken }));
	return { ...prevList, [value]: listToken };
};

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
