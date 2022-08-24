import { useState, useEffect } from 'react';
import { getUserListsArr } from '../utils';

export function CopyToken({ listToken, /*setListToken,*/ userList }) {
	const [copied, setCopied] = useState('');

	// this echoes List but is not a shared context
	const [selectedListToken, setSelectedListToken] = useState(listToken);
	const updateSelectedList = (e) => {
		setSelectedListToken(e.target.value);
		//FOR REVIEW/FEEDBACK:
		/*The following line syncs the list selection on the List page as well, but also redirects to the List page once a change is made, which can be abrupt.

		setListToken(e.target.value); //synchronize list shown on List page? this also redirects people to the main list page, however.
		And may need a note like "if you change your list selection here, you will need to reapply any filters for your calendar export."
		*/
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
