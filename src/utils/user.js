export const addNewListToUser = (user, listName, newToken) => {
	const [userToken, setUserToken] = user;
	const tokenLists = JSON.parse(userToken);
	setUserToken(JSON.stringify({ ...tokenLists, [listName]: newToken }));
	return { ...tokenLists, [listName]: newToken };
};

export const setNewUserToken = (user, newToken) => {
	const [userToken, setUserToken] = user;
	setUserToken(JSON.stringify({ newToken }));
	return { newToken };
};

export const getUserListsArr = (userToken) =>
	Object.entries(JSON.parse(userToken));

export const setTokenFirstList = (setListToken, userLists) => {
	setListToken(Object.entries(userLists)[0][1]);
};

export const removeList = (user, name) => {
	const [userToken, setUserToken] = user;

	const tokenLists = JSON.parse(userToken);
	delete tokenLists[name];

	setUserToken(JSON.stringify(tokenLists));
	return tokenLists;
};
