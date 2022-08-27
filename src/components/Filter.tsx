import { useContext, useEffect, useMemo, useState } from 'react';
import { MyContext } from '../App';
import { UrgencyStatus } from '../types';
import { comparePurchaseUrgency, getUrgency } from '../utils';
import { customDateRange } from '../utils/filter';

const defaultDates = { startDate: '', endDate: '' };

const Filter = ({ searchTerm, setSearchTerm, setAdjustedData }) => {
	const [urgencyTerm, setUrgencyTerm] = useState('ALL');
	const [custom, setCustom] = useState(defaultDates);
	const [data] = useContext(MyContext).dataCtx;

	const sortedFullList = useMemo(() => comparePurchaseUrgency(data), [data]);

	useEffect(() => {
		setAdjustedData(
			filterList(sortedFullList)
				.filter((item) => item.name !== '')
				.filter(getUrgency(urgencyTerm))
				.filter(customDateRange(custom.startDate, custom.endDate)),
		);
	}, [urgencyTerm, sortedFullList, custom, searchTerm]);

	const undoUrgency = () => {
		setUrgencyTerm('ALL');
	};

	const filterList = (list) => {
		const cleanup = (inputString) => {
			return inputString.toLowerCase().trim().replace(/\s+/g, ' ');
		};
		return list.filter(({ name }) =>
			cleanup(name).includes(cleanup(searchTerm)),
		);
	};

	const updateRange = (e) => {
		if (e.target.name !== 'startDate' && e.target.name !== 'endDate') return;
		const newDates = { ...custom, [e.target.name]: e.target.value };
		setCustom(newDates);
	};

	const clearSearchTerm = () => {
		setSearchTerm('');
	};

	return (
		<div>
			<label>
				Find an item
				<input
					type="text"
					placeholder="start typing here..."
					id="filter"
					name="filter"
					value={searchTerm}
					onChange={(e) => {
						setSearchTerm(e.target.value);
					}}
				/>
			</label>
			<button type="button" onClick={clearSearchTerm} aria-live="polite">
				clear
			</button>
			<fieldset>
				<legend>Search by custom purchase-by date range</legend>
				<label>
					Start date:
					<input
						type="date"
						value={custom.startDate}
						name="startDate"
						max={custom.endDate}
						onChange={updateRange}
					/>
				</label>
				<label>
					End date:
					<input
						type="date"
						value={custom.endDate}
						name="endDate"
						min={custom.startDate}
						onChange={updateRange}
					/>
				</label>
				<button
					type="button"
					onClick={() => setCustom(defaultDates)}
					aria-live="polite"
				>
					Clear custom range
				</button>
			</fieldset>
			<div>
				<label>
					Show by urgency
					<select
						value={urgencyTerm}
						onChange={(e) => setUrgencyTerm(e.target.value)}
						name="urgency"
					>
						<option value={'ALL'}>Choose urgency</option>
						<option value={'SOON'}>Soon</option>
						<option value={'KIND_OF_SOON'}>Kind Of Soon</option>
						<option value={'NOT_SOON'}>Not Soon</option>
						<option value={'OVERDUE'}>Overdue</option>
						<option value={'INACTIVE'}>Inactive</option>
					</select>
				</label>
				<button type="button" onClick={undoUrgency} aria-live="polite">
					Clear urgency selection
				</button>
			</div>
		</div>
	);
};

export default Filter;
