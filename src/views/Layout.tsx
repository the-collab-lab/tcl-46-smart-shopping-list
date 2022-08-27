import { Outlet, NavLink } from 'react-router-dom';
import FoodPuns from '../components/FoodPuns';

import './Layout.css';

export function Layout() {
	return (
		<div className="Container">
			<div className="Layout">
				<main className="Layout-main">
					<Outlet />
				</main>
				<FoodPuns />
			</div>
			<nav className="Nav">
				<NavLink to="/" className="Nav-link">
					Home
				</NavLink>
				<NavLink to="/list" className="Nav-link">
					List
				</NavLink>
				<NavLink to="/export" className="Nav-link">
					Share
				</NavLink>
			</nav>
		</div>
	);
}
