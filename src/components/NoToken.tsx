import { Link } from 'react-router-dom';

const NoToken = () => {
	return (
		<div>
			You do not have a list token! Please create one to start adding items.
			<Link to="/">
				<button type="button">Home</button>
			</Link>
		</div>
	);
};

export default NoToken;
