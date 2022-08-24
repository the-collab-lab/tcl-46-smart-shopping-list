import { useState, useEffect } from 'react';
import { getUserListsArr } from '../utils';

export function CopyToken({ listToken, userList }) {
	const [copied, setCopied] = useState('');

	// this echoes List but is not a shared context
	const [selectedListToken, setSelectedListToken] = useState(listToken);
	const updateSelectedList = (e) => {
		setSelectedListToken(e.target.value);
	};

	const copyToken = () => {
		navigator.clipboard
			.writeText(selectedListToken)
			.then(() => setCopied('Copied!'))
			.catch(() => setCopied('Not Copied.'));
	};

	useEffect(() => {
		if (copied) setTimeout(() => setCopied(''), 2000);
	}, [copied]);

	return (
		<div>
			<label htmlFor="userList">
				Select list to share:
				<select
					value={selectedListToken}
					onChange={updateSelectedList}
					id="userList"
				>
					{getUserListsArr(userList).map(([name, token]) => (
						<option key={token} value={token}>
							{name}
						</option>
					))}
				</select>
			</label>
			<p>
				Copy token to share your list with others:
				<button onClick={copyToken} id="token">
					{copied ? copied : selectedListToken}
				</button>
			</p>
		</div>
	);
}
