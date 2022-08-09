import { useNavigate } from 'react-router-dom';

const NoToken = () => {
	const navigate = useNavigate();
	return (
		<div>
			You do not have a list token! Please create one to start adding items.
			<button onClick={() => navigate('/')}>Home</button>
		</div>
	);
};

export default NoToken;
