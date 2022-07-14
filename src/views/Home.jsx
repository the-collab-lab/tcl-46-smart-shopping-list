import './Home.css';
import { useNavigate } from 'react-router-dom';
import { generateToken } from '@the-collab-lab/shopping-list-utils';

export function Home({ makeNewList }) {
	const navigate = useNavigate();
	function handleClick() {
		const newToken = generateToken();
		makeNewList(newToken);
		navigate('/list');
		/**
		 * Check local storage for token
		 * -- if none,*/

		// update value of listToken

		// BUG? token value updates in localStorage when function is called onClick in Firefox browser
		// but localStorage token does not update in Chrome onClick, although key *will* update 1x in new browser session for Chrome
	}

	return (
		<div className="Home">
			<p>
				Hello from the home (<code>/</code>) page!
			</p>
			<button type="button" onClick={handleClick}>
				Make new list
			</button>
		</div>
	);
}
