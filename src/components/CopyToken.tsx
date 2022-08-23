import { useState, useEffect } from 'react';

export function Copytoken({ listToken }) {
	//for dropdown later
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
				Copy token to share your list with others:
				<button onClick={copyToken} id="token">
					{copied ? copied : listToken}
				</button>
			</p>
		</div>
	);
}
