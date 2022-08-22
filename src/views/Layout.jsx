import { Outlet, NavLink } from 'react-router-dom';
import FoodPuns from '../components/FoodPuns';
import { useState, useEffect } from 'react';

import './Layout.css';

function NavBarToggle() {
	const [activeComponent, setActiveComponent] = useState();
	useEffect(() => {
		setActiveComponent(`${window.location.pathname.replace('/', '')}`);
	}, [window.location.pathname]);

	return (
		<div
			className={`Nav-link__shadow Nav-link__shadow_${activeComponent}`}
		></div>
	);
}

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
				<NavLink to="/add-item" className="Nav-link">
					Add Item
				</NavLink>
				<NavLink to="/summary" className="Nav-link">
					Summary
				</NavLink>
				<NavBarToggle />
			</nav>
		</div>
	);
}
