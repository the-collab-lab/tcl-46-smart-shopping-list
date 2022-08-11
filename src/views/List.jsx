import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteItem } from '../api';
import { ListItem } from '../components';
import NoToken from '../components/NoToken';

export function List({ data, listToken, setListToken }) {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState('');
	const [copied, setCopied] = useState('');
	const [currentListToken, setCurrentListToken] = useState(listToken);

	useEffect(() => {
		if (copied) setTimeout(() => setCopied(''), 2000);
	}, [copied]);

	useEffect(() => {
		console.log(currentListToken);
	}, [currentListToken]);
	const filterList = (list) => {
		const cleanup = (inputString) => {
			return inputString.toLowerCase().trim().replace(/\s+/g, ' ');
		};
		return list.filter(({ name }) =>
			cleanup(name).includes(cleanup(searchTerm)),
		);
	};

	const clearSearchTerm = () => {
		setSearchTerm('');
	};

	const copyToken = () => {
		navigator.clipboard
			.writeText(listToken)
			.then(() => setCopied('Copied!'))
			.catch(() => setCopied('Not Copied.'));
	};

	const deleteList = () => {
		if (
			window.confirm(
				'Are you sure you want to delete your shopping list? This cannot be undone.',
			)
		) {
			const itemsToBeDeleted = [];
			data.forEach((item) => {
				itemsToBeDeleted.push(deleteItem(listToken, item.id));
			});
			Promise.all(itemsToBeDeleted)
				.then(() => {
					console.log('success');
					setListToken(null, 'tcl-shopping-list-token');
					setCurrentListToken(null);

					navigate('/');
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};
	return (
		<>
			{currentListToken ? (
				data.length > 1 ? (
					<div>
						<label>
							Filter Items
							<input
								type="text"
								placeholder="start typing here..."
								id="filter"
								name="filter"
								value={searchTerm}
								onChange={(e) => {
									setSearchTerm(e.target.value);
								}}
							/>
						</label>
						<button type="button" onClick={clearSearchTerm} aria-live="polite">
							clear
						</button>
						<div>
							<p>
								Copy token to allow others join your list:
								<button onClick={copyToken} id="token">
									{copied ? copied : listToken}
								</button>
							</p>
						</div>
						<ul>
							{filterList(data)
								.filter((item) => item.name !== '')
								.map((item) => (
									<ListItem
										{...item}
										listToken={listToken}
										key={item.id}
										itemId={item.id}
									/>
								))}
						</ul>
						<button onClick={deleteList}>Delete List</button>
					</div>
				) : (
					<div>
						<h2>Welcome to your smart shopping list!</h2>
						<p>
							This app will learn from your purchasing habits and help you
							prioritize and plan your shopping list.
						</p>
						Copy token to share your list with others:
						<button onClick={copyToken} id="token">
							{copied ? copied : listToken}
						</button>
						<button type="button" onClick={() => navigate('/add-item')}>
							Start adding items
						</button>
						<button onClick={deleteList}>Delete List</button>
					</div>
				)
			) : (
				<NoToken />
			)}
		</>
	);
}
