import { useState } from 'react';
import { useStateWithStorage } from '../utils';

import { isEmpty } from '../utils/validateStrings';

export function Goals() {
	const [goals, setGoals] = useStateWithStorage(
		'Set a goal for your shopping habits!',
		'tcl-shopping-list-goals',
	);

	const [isDisabled, setIsDisabled] = useState(true);

	const editGoals = (e) => {
		e.preventDefault();
		setIsDisabled(!isDisabled);
	};

	return (
		<>
			<form className="Goals__form" onSubmit={editGoals}>
				<textarea
					readOnly={isDisabled}
					className={`Goals__text ${isDisabled ? 'disabled' : ''}`}
					onChange={(e) => setGoals(e.target.value)}
					value={goals}
				/>
				<button type="submit" disabled={isEmpty(goals)}>
					{isDisabled ? 'Update' : 'Save'}
				</button>
			</form>
		</>
	);
}
