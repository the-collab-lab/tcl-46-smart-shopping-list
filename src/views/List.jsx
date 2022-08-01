import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListItem } from '../components';

export function List({ data, listToken }) {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState('');
	const [copied, setCopied] = useState('');

	useEffect(() => {
		if (copied) setTimeout(() => setCopied(''), 2000);
	}, [copied]);

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

	return (
		<>
			{data.length ? (
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
				</div>
			) : (
				<div>
					<h2>Welcome to your smart shopping list!</h2>
					<p>
						This app will learn from your purchasing habits and help you
						prioritize and plan your shopping list. You must add at least one
						item to start sharing your list with others.
					</p>
					<button type="button" onClick={() => navigate('/add-item')}>
						Start adding items
					</button>
				</div>
			)}

			<ul>
				{filterList(data).map(
					({
						name,
						id,
						isChecked,
						dateLastPurchased,
						dateNextPurchased,
						totalPurchases,
					}) => (
						<ListItem
							name={name}
							key={id}
							itemId={id}
							listToken={listToken}
							isChecked={isChecked}
							dateLastPurchased={dateLastPurchased}
							dateNextPurchased={dateNextPurchased}
							totalPurchases={totalPurchases}
							// refactor spread syntax?
						/>
					),
				)}
			</ul>
		</>
	);
}
