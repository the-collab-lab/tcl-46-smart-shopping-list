import { ListItem } from '../components';

export function List({ data, listToken }) {
	return (
		<>
			<p>
				Hello from the <code>/list</code> page!
			</p>
			<ul>
				{data.map(({ name, id }) => (
					<ListItem name={name} key={id} listToken={listToken} />
				))}
			</ul>
		</>
	);
}
