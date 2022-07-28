import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListItem } from '../components';

export function List({ data }) {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState('');

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

	return (
		<>
			{data.length ? (
				<div>
					<form onSubmit={(e) => e.preventDefault()}>
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
					</form>
					<button type="button" onClick={clearSearchTerm}>
						clear
					</button>
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
				{filterList(data).map(({ name, id }) => (
					<ListItem name={name} key={id} />
				))}
			</ul>
		</>
	);
}
