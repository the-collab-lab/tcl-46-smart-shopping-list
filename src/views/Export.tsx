import { useState, useEffect } from 'react';
import { Copytoken } from '../components/Copytoken';

// switchList, rmListUpdate are declared in List
export function Export({ data, user, listToken, setListToken }) {
	return (
		<>
			<div>
				<Copytoken data={data} user={user} listToken={listToken} />
				<p>Add calendar module here</p>
			</div>
		</>
	);
}
