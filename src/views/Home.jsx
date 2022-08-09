import './Home.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateToken } from '@the-collab-lab/shopping-list-utils';
import { getItemData, streamListItems, addItem } from '../api';

export function Home({ setListToken }) {
	const [errorMessage, setErrorMessage] = useState('');
	const [joinListToken, setJoinListToken] = useState('');

	const navigate = useNavigate();

	function addPlaceholderItem(listId) {
		addItem(listId, { itemName: '', daysUntilNextPurchase: 0 });
	}

	function makeNewList() {
		const newToken = generateToken();
		setListToken(newToken);
		addPlaceholderItem(newToken);
		navigate('/list');
	}

	function joinListSubmit(event) {
		event.preventDefault();

		return streamListItems(joinListToken, (snapshot) => {
			const data = getItemData(snapshot);
			if (data.length) {
				setListToken(joinListToken);
				navigate('/list');
			} else {
				setErrorMessage('Could not join the list.');
			}
		});
	}

	function joinListChange(event) {
		if (errorMessage) setErrorMessage('');
		setJoinListToken(event.target.value);
	}
	return (
		<div className="Home">
			<p>
				Hello from the home (<code>/</code>) page!
			</p>
			<button type="button" onClick={makeNewList}>
				Make new list
			</button>
			<form onSubmit={joinListSubmit}>
				<label htmlFor="share-list">
					Join a List
					<input
						id="share-list"
						pattern="(?:\w+ ){2}\w+"
						title="Token must be three words separated with spaces."
						onChange={joinListChange}
						value={joinListToken}
					></input>
				</label>
				<button type="submit">Submit</button>
			</form>
			{errorMessage && <p>{errorMessage}</p>}
		</div>
	);
}
