import './Home.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateToken } from '@the-collab-lab/shopping-list-utils';

export function Home({ makeNewList }) {
	const [errorMessage, setErrorMessage] = useState('');
	const [joinListToken, setJoinListToken] = useState('');

	const navigate = useNavigate();

	// use callback function so the newToken that's generated in this child component
	// can be passed up to the parent component (App.js)
	function handleClick() {
		const newToken = generateToken();
		makeNewList(newToken);
		navigate('/list');
	}

	function handleShareListSubmit(event) {
		event.preventDefault();
	}
	function handleJoinListChange(event) {
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
