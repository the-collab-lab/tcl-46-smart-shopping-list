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
			<form onSubmit={editGoals}>
				<input
					readOnly={isDisabled}
					style={
						isDisabled
							? {
									outline: 'none',
									borderWidth: 0,
									width: '100%',
									backgroundColor: 'transparent',
									marginBottom: '1rem',
							  }
							: {
									backgroundColor: 'white',
									borderWidth: '1px',
									width: '100%',
									marginBottom: '1rem',
							  }
					}
					onChange={(e) => setGoals(e.target.value)}
					value={goals}
				/>
				<button
					type="submit"
					disabled={isEmpty(goals)} //prevent exit without content
				>
					{isDisabled ? 'Update' : 'Save'}
				</button>
			</form>
		</>
	);
}
