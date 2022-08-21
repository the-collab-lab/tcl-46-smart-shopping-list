import { Outlet, NavLink } from 'react-router-dom';
import FoodPuns from '../components/FoodPuns';
import { useState } from 'react';

import './Layout.css';

export function Layout() {
	const [activeNavLink, setActiveNavLink] = useState('');
	console.log(activeNavLink);
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
				<NavLink
					to="/"
					// className={({ isActive }) => {
					// 	if (isActive) setActiveNavLink('home');
					// 	return 'Nav-link';
					// }}
					className="Nav-link"
				>
					Home
				</NavLink>
				<NavLink
					to="/list"
					className={({ isActive }) => {
						if (isActive) setActiveNavLink('list');
						return 'Nav-link';
					}}
				>
					List
				</NavLink>
				<NavLink
					to="/add-item"
					className={({ isActive }) => {
						if (isActive) setActiveNavLink('add-item');
						return 'Nav-link';
					}}
				>
					Add Item
				</NavLink>
				<NavLink
					to="/summary"
					className={({ isActive }) => {
						if (isActive) setActiveNavLink('summary');
						return 'Nav-link';
					}}
				>
					Summary
				</NavLink>
				<div className="Nav-link__shadow"></div>
			</nav>
		</div>
	);
}
