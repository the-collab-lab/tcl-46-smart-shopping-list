import { render } from '@testing-library/react';
import { App } from '../src/App';
import { BrowserRouter as Router } from 'react-router-dom';

it('renders without crashing', () => {
	render(
		<Router>
			<App />
		</Router>,
	);
});
