import { initializeApp } from 'firebase/app';
import {
	collection,
	getFirestore,
	onSnapshot,
	addDoc,
	doc,
	updateDoc,
	increment,
} from 'firebase/firestore';

import { getFutureDate, getDaysBetweenDates } from '../utils';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils/dist/calculateEstimate';

const firebaseConfig = {
	apiKey: 'AIzaSyCfI_TVGKMzq7CaxBRQZAbqejH713TzGeg',
	authDomain: 'tcl-46-smart-shopping-list.firebaseapp.com',
	projectId: 'tcl-46-smart-shopping-list',
	storageBucket: 'tcl-46-smart-shopping-list.appspot.com',
	messagingSenderId: '750490697092',
	appId: '1:750490697092:web:786defaaac8ae2cf73f1d1',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Subscribe to changes on a specific list in the Firestore database (listId), and run a callback (handleSuccess) every time a change happens.
 * @param {string} listId The user's list token
 * @param {Function} handleSuccess The callback function to call when we get a successful update from the database.
 * @returns {Function}
 *
 * @see: https://firebase.google.com/docs/firestore/query-data/listen
 */
export function streamListItems(listId, handleSuccess) {
	const listCollectionRef = collection(db, listId);
	return onSnapshot(listCollectionRef, handleSuccess);
}

/**
 * Read the information from the provided snapshot and return an array
 * that can be stored in our React state.
 * @param {Object} snapshot A special Firebase document with information about the current state of the database.
 * @returns {Object[]} An array of objects representing the user's list.
 */
export function getItemData(snapshot) {
	return snapshot.docs.map((docRef) => {
		/**
		 * We must call a special `.data()` method to get the data
		 * out of the referenced document
		 */
		const data = docRef.data();

		/**
		 * The document's ID is not part of the data, but it's very useful
		 * so we get it from the document reference.
		 */
		data.id = docRef.id;

		return data;
	});
}

/**
 * Add a new item to the user's list in Firestore.
 * @param {string} listId The id of the list we're adding to.
 * @param {Object} itemData Information about the new item.
 * @param {string} itemData.itemName The name of the item.
 * @param {number} itemData.daysUntilNextPurchase The number of days until the user thinks they'll need to buy the item again.
 */
export async function addItem(listId, { itemName, daysUntilNextPurchase }) {
	const listCollectionRef = collection(db, listId);

	return await addDoc(listCollectionRef, {
		dateCreated: new Date(),
		dateLastPurchased: null,
		dateNextPurchased: getFutureDate(daysUntilNextPurchase),
		isChecked: false,
		name: itemName,
		totalPurchases: 0,
	});
}

export async function updateItem(
	listId,
	{
		itemId,
		isChecked,
		dateLastPurchased,
		dateCreated,
		currentDate,
		currentTime,
		dateNextPurchased,
		totalPurchases,
	},
) {
	let daysSinceLastPurchase;
	let prevEst;

	if (dateLastPurchased) {
		daysSinceLastPurchase = getDaysBetweenDates(
			dateLastPurchased.toMillis(),
			currentTime,
		);
		prevEst = getDaysBetweenDates(
			dateLastPurchased.toMillis(),
			dateNextPurchased.toMillis(),
		);
	} else {
		daysSinceLastPurchase =
			// Math.max(
			// 	1,
			getDaysBetweenDates(dateCreated.toMillis(), currentTime);
		// );
		// prevEst remains undefined in this scenario
	}

	// RESHUFFLED ABOVE
	// if (!dateLastPurchased) {
	// 	daysSinceLastPurchase = Math.max(
	// 		1,
	// 		getDaysBetweenDates(dateCreated.toMillis(), currentTime),
	// 	);
	// 	// prevEst remains undefined in this scenario
	// } else {
	// 	daysSinceLastPurchase = getDaysBetweenDates(
	// 		dateLastPurchased.toMillis(),
	// 		currentTime,
	// 	);
	// 	prevEst = getDaysBetweenDates(
	// 		dateLastPurchased.toMillis(),
	// 		dateNextPurchased.toMillis(),
	// 	);
	// }
	let daysToNextPurchase = calculateEstimate(
		prevEst, // effectively, prevEst || 14 here?
		daysSinceLastPurchase,
		totalPurchases,
	); //returns integer - days to next purchase. Then turn into date:

	let actualDateNextPurchased = getFutureDate(daysToNextPurchase);

	const listCollectionRef = collection(db, listId);
	const listItemRef = doc(listCollectionRef, itemId);
	if (isChecked) {
		await updateDoc(listItemRef, {
			dateLastPurchased: currentDate,
			isChecked: isChecked,
			totalPurchases: increment(1),
			dateNextPurchased: actualDateNextPurchased, //updated with
		});
	} else {
		await updateDoc(listItemRef, {
			isChecked: isChecked,
		});
	}
}

export async function deleteItem() {
	/**
	 * TODO: Fill this out so that it uses the correct Firestore function
	 * to delete an existing item! You'll need to figure out what arguments
	 * this function must accept!
	 */
}
