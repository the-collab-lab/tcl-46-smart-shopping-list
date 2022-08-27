import { Link } from 'react-router-dom';
import './NoToken.css';

const NoToken = () => {
	return (
		<div className="notoken__container">
			<h1>Oh Crêpe!</h1>
			<h2>
				You do not have a list token! Please create one to start adding items.
			</h2>
			<Link to="/">
				<button type="button">Home</button>
			</Link>
			<p className="notoken__footer">
				This shopping app was created with love by members of The Collab Lab.
			</p>
		</div>
	);
};

export default NoToken;
