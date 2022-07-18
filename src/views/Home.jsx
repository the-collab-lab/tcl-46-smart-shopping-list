import './Home.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateToken } from '@the-collab-lab/shopping-list-utils';
import { getItemData, streamListItems } from '../api';

export function Home({ setListToken }) {
	const [errorMessage, setErrorMessage] = useState('');
	const [joinListToken, setJoinListToken] = useState('');

	const navigate = useNavigate();

	function handleClick() {
		const newToken = generateToken();
		setListToken(newToken);
		navigate('/list');
	}

	function handleShareListSubmit(event) {
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

	function handleJoinListChange(event) {
		if (errorMessage) setErrorMessage('');
		setJoinListToken(event.target.value);
	}
	return (
		<div className="Home">
			<p>
				Hello from the home (<code>/</code>) page!
			</p>
			<button type="button" onClick={handleClick}>
				Make new list
			</button>
			<form onSubmit={handleShareListSubmit}>
				<label htmlFor="share-list">
					Join a List
					<input
						id="share-list"
						onChange={handleJoinListChange}
						value={joinListToken}
					></input>
				</label>
				<button type="submit">Submit</button>
			</form>
			<p>{errorMessage}</p>
		</div>
	);
}
