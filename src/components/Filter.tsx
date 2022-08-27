import { faHouseMedicalCircleCheck } from '@fortawesome/free-solid-svg-icons';
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

	const mediaChecker = window.matchMedia('only screen and (max-width: 588px)');

	const [isMobile, setIsMobile] = useState(false);
	const checkIfMobile = () => {
		if (mediaChecker.matches) setIsMobile(true);
		else setIsMobile(false);
	};

	useEffect(() => {
		mediaChecker.addEventListener('change', checkIfMobile);
		return () => mediaChecker.removeEventListener('change', checkIfMobile);
	}, [mediaChecker]);

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

	return isMobile ? (
		<details className="Filter">
			<summary className="Filter__heading">
				Search &amp; Filter
				<div className="container__btn__clearAll">
					<button
						className="btn__clearAll"
						type="button"
						onClick={clearAllFilters}
						aria-live="polite"
					>
						Clear All Filters
					</button>
				</div>
			</summary>
			<label className="search__container">
				<p>Search by Name:</p>
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
			</label>
			<fieldset>
				<legend>Search by Date Range:</legend>
				<label className="customSearch__label">
					<p>Start:</p>
					<input
						type="date"
						className="search__input"
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
						className="search__input"
						value={custom.endDate}
						name="endDate"
						min={custom.startDate}
						onChange={updateRange}
					/>
				</label>
			</fieldset>
			<label htmlFor="urgency" className="urgency__label">
				Filter by Urgency:
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
			</label>
		</details>
	) : (
		<div className="Filter wide">
			<h3 className="Filter__heading">Search &amp; Filter</h3>
			<label className="search__container">
				<p>Search by Name:</p>
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
			</label>
			<fieldset>
				<legend>Search by Date Range:</legend>
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
				</label>
			</fieldset>
			<label htmlFor="urgency" className="urgency__label">
				Filter by Urgency:
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
			</label>
			<div className="container__btn__clearAll">
				<button
					className="btn__clearAll"
					type="button"
					onClick={clearAllFilters}
					aria-live="polite"
				>
					Clear All Filters
				</button>
			</div>
		</div>
	);
};

export default Filter;
