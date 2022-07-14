import './Home.css';
import { useNavigate } from 'react-router-dom';
import { generateToken } from '@the-collab-lab/shopping-list-utils';

export function Home({ setListToken }) {
	const navigate = useNavigate();
	const makeNewList = () => {
		/**
		 * Check local storage for token
		 * -- if none,*/
		const newToken = generateToken();
		// update value of listToken
		setListToken(newToken);
		// BUG? token value updates in localStorage when function is called onClick in Firefox browser
		// but localStorage token does not update in Chrome onClick, although key *will* update 1x in new browser session for Chrome

		navigate('/list');
	};

	return (
		<div className="Home">
			<p>
				Hello from the home (<code>/</code>) page!
			</p>
			<button type="button" onClick={makeNewList}>
				Make new list
			</button>
		</div>
	);
}
