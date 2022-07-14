import './Home.css';
import { useNavigate } from 'react-router-dom';
import { generateToken } from '@the-collab-lab/shopping-list-utils';

export function Home({ makeNewList }) {
	const navigate = useNavigate();

	// use callback function so the newToken that's generated in this child component
	// can be passed up to the parent component (App.js)
	function handleClick() {
		const newToken = generateToken();
		makeNewList(newToken);
		navigate('/list');
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
