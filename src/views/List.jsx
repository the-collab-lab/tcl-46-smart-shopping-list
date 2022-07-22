import { useState } from 'react';

import { ListItem } from '../components';

export function List({ data }) {
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
			<p>
				Hello from the <code>/list</code> page!
			</p>
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

			<ul>
				{filterList(data).map(({ name, id }) => (
					<ListItem name={name} key={id} />
				))}
			</ul>
		</>
	);
}
