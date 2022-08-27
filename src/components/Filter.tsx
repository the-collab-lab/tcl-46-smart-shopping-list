import { useContext, useEffect, useMemo, useState } from 'react';
import { MyContext } from '../App';
import { comparePurchaseUrgency, getUrgency } from '../utils';
import { customDateRange } from '../utils/filter';
import './Filter.css';

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

	// const undoUrgency = () => setUrgencyTerm('ALL');
	// const clearSearchTerm = () => setSearchTerm('');
	// const clearDateRange = () => setCustom(defaultDates)

	const clearAllFilters = () => {
		setUrgencyTerm('ALL');
		setSearchTerm('');
		setCustom(defaultDates);
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

	return (
		<details>
			<summary>Filter And Search</summary>
			<label className="search__container">
				<p>Find an item</p>
				<input
					type="text"
					placeholder="Start typing here..."
					id="filter"
					name="filter"
					className="search__input"
					value={searchTerm}
					onChange={(e) => {
						setSearchTerm(e.target.value);
					}}
				/>
				<button
					type="button"
					className="search__button"
					style={{ margin: 'auto' }}
					onClick={clearSearchTerm}
					aria-live="polite"
				>
					Clear
				</button>
			</label>
			<fieldset>
				<legend>Search by custom purchase-by date range</legend>
				<label className="customSearch__label">
					<p>Start:</p>
					<input
						type="date"
						value={custom.startDate}
						name="startDate"
						max={custom.endDate}
						onChange={updateRange}
					/>
				</label>
				<label className="customSearch__label">
					<p>End:</p>
					<input
						type="date"
						value={custom.endDate}
						name="endDate"
						min={custom.startDate}
						onChange={updateRange}
					/>
					<button
						type="button"
						onClick={() => setCustom(defaultDates)}
						aria-live="polite"
					>
						Clear
					</button>
				</label>
			</fieldset>
			<label htmlFor="urgency" className="urgency__label">
				Filter by urgency
				<select
					value={urgencyTerm}
					onChange={(e) => setUrgencyTerm(e.target.value)}
					name="urgency"
					id="urgency"
				>
					<option value={'ALL'}>Choose urgency</option>
					<option value={'SOON'}>Soon</option>
					<option value={'KIND_OF_SOON'}>Kind Of Soon</option>
					<option value={'NOT_SOON'}>Not Soon</option>
					<option value={'OVERDUE'}>Overdue</option>
					<option value={'INACTIVE'}>Inactive</option>
				</select>
				<button
					className="urgency__button"
					type="button"
					onClick={undoUrgency}
					aria-live="polite"
				>
					Clear
				</button>
			</label>
		</details>
	);
};

export default Filter;
