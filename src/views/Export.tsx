import { useState, useEffect } from 'react';
import { Copytoken } from '../components/Copytoken';

export function Export({ data, user, listToken }) {
	const [userToken, setUserToken] = user;
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
			<Copytoken data={data} user={user} listToken={listToken} />
			<p>Add to calendar.</p>
		</div>
	);
}
