import { Outlet, NavLink } from 'react-router-dom';
import FoodPuns from '../components/FoodPuns';

import './Layout.css';

export function Layout() {
	return (
		<div className="Layout">
			<header className="Layout-header">
				<h1>Smart shopping list</h1>
			</header>
			<main className="Layout-main">
				<Outlet />
			</main>
			<FoodPuns />
			<nav className="Nav">
				<NavLink to="/" className="Nav-link">
					Home
				</NavLink>
				<NavLink to="/list" className="Nav-link">
					List
				</NavLink>
				<NavLink to="/export" className="Nav-link">
					Export
				</NavLink>
			</nav>
		</div>
	);
}
