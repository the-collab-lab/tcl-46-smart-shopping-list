export const addNewListToUser = (user, listName, newToken) => {
	const [userToken, setUserToken] = user;
	const tokenLists = JSON.parse(userToken);
	if (!listName) listName = `My List ${countMyLists(tokenLists) + 1}`;
	const updatedList = rmNullToken({ ...tokenLists, [listName]: newToken });
	setUserToken(JSON.stringify(updatedList));
	return updatedList;
};

export function countMyLists(tokenLists) {
	console.log(Object.keys(tokenLists));
	return Object.keys(tokenLists).reduce((key, curr) => {
		if (curr.includes('My List')) {
			key++;
		}
		return key;
	}, 0);
}

export const setNewUserToken = (user, newToken, listName) => {
	const [, setUserToken] = user;
	if (listName) {
		setUserToken(JSON.stringify({ [listName]: newToken }));
		return { [listName]: newToken };
	} else {
		setUserToken(JSON.stringify({ newToken }));
		return { newToken };
	}
};

export const getUserListsArr = (userToken) =>
	Object.entries(JSON.parse(userToken));

export const setTokenFirstList = (setListToken, userLists) => {
	if (Object.entries(userLists).length) {
		setListToken(Object.entries(userLists)[0][1]);
	} else setListToken(null);
};

export const updateName = (user, value, listToken) => {
	const [userToken, setUserToken] = user;
	const prevList = JSON.parse(userToken);

	for (let name in prevList) {
		if (prevList[name] === listToken) {
			delete prevList[name];
		}
	}

	setUserToken(JSON.stringify({ ...prevList, [value]: listToken }));
	return { ...prevList, [value]: listToken };
};

export function rmNullToken(list) {
	const userList = list;

	for (let name in userList) {
		if (userList[name] === null) {
			delete userList[name];
		}
	}
	return userList;
}

export const getMatchingName = (userToken, listToken) =>
	getUserListsArr(userToken).find(([, token]) => token === listToken)[0];

export const removeList = (user, name) => {
	const [userToken, setUserToken] = user;

	const tokenLists = JSON.parse(userToken);
	delete tokenLists[name];

	setUserToken(JSON.stringify(tokenLists));
	return tokenLists;
};
