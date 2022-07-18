import { useState } from 'react';

import { ListItem } from '../components';

export function List({ data }) {
	const [searchTerm, setSearchTerm] = useState('');

	const clearSearchTerm = () => {
		setSearchTerm('');
	};

	return (
		<>
			<p>
				Hello from the <code>/list</code> page!
			</p>

			<form>
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
			<button onClick={clearSearchTerm}>clear</button>

			<ul>
				{data
					.filter(({ name }) =>
						name.toLowerCase().includes(searchTerm.toLowerCase()),
					)
					.map(({ name, id }) => (
						<ListItem name={name} key={id} />
					))}
			</ul>
		</>
	);
}
