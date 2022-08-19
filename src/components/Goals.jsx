import { useState } from 'react';
import { isEmpty } from '../utils/validateStrings';

export function Goals({ updateGoals, goals, isDisabled, editGoals }) {
	return (
		// componentize here and multList?
		// also consider building out into array so that multiple goals can be formatted nicely in list.
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
					onChange={updateGoals}
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
