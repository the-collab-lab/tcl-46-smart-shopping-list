import { useState, useEffect } from 'react';

export function Copytoken({ data, user, listToken }) {
	const [userToken, setUserToken] = user; //for dropdown later
	const [copied, setCopied] = useState('');

	// need listName to add dropdown to update listToken for sharing. listName is currently provided only within List component
	// ref AddItem for listName

	const copyToken = () => {
		navigator.clipboard
			.writeText(listToken)
			.then(() => setCopied('Copied!'))
			.catch(() => setCopied('Not Copied.'));
	};

	useEffect(() => {
		if (copied) setTimeout(() => setCopied(''), 2000);
	}, [copied]);

	return (
		<div>
			<p>
				Copy token to allow others join your list:
				<button onClick={copyToken} id="token">
					{copied ? copied : listToken}
				</button>
			</p>
		</div>
	);
}
