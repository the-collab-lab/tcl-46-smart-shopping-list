import { useMemo, useContext } from 'react';
import { MyContext } from '../App';
import { getDaysBetweenDates } from '../utils';
import { comparePurchaseUrgency } from '../utils/item';
import { Goals } from '../components/Goals';

export function Summary() {
	const [data] = useContext(MyContext).dataCtx;

	//memoize below?
	const getPurchased = (array) =>
		array.filter((item) => item.dateLastPurchased); //purchased at least once, not null value
	const getOldest = (array) => {
		const refTimesOnly = array.map((item) => item.refTime);
		return array.filter((item) => item.refTime === Math.min(...refTimesOnly)); //there may be more than one, so not using find()
	};
	const getFiveMost = (array, metric) => {
		const arr = [...array].sort((a, b) => b[metric] - a[metric]); //when passing in date in MS, larger is also more recent
		arr.length = 5;
		return arr;
	};

	const removePlaceholder = (array) => {
		return array.filter((item) => item.name !== '');
	};

	// duplicated fr List - not set up when data is passed to this component.
	// but unlike List's similar variable, the placeholder is removed at this time
	const sortedFullList = useMemo(
		() => removePlaceholder(comparePurchaseUrgency(data)),
		[data],
	);

	const currentTime = new Date().getTime();
	const purchased = getPurchased(sortedFullList);
	const fiveMostRecentPurchases = getFiveMost(purchased, 'refTime'); //descending order of most recently purchased items
	const fiveMostPurchased = getFiveMost(purchased, 'totalPurchases');
	const mostNeglectedItem = getOldest(
		sortedFullList.filter((item) => !item.dateLastPurchased),
	); //oldest never purchased item

	return (
		<div className="Summary">
			<h2 className="Summary__heading main">Summary</h2>
			{purchased.length ? (
				<div>
					<h2 className="Summary__heading">Your purchase history to date</h2>
					<h3 className="Summary__heading sub">
						Top 5 purchases by frequency:
					</h3>
					<ol>
						{fiveMostPurchased.map((item) => (
							<li key={item.id}>
								{item.name}: bought{' '}
								{item.totalPurchases === 1 ? (
									<span>{item.totalPurchases} time</span>
								) : (
									<span>{item.totalPurchases} times</span>
								)}
							</li>
						))}
					</ol>

					<h3 className="Summary__heading sub">5 most recent purchases:</h3>
					<ol>
						{fiveMostRecentPurchases.map((item) => (
							<li key={item.id}>
								{item.name}: bought on{' '}
								{item.dateLastPurchased.toDate().toLocaleDateString('en-us', {
									weekday: 'long',
									year: 'numeric',
									month: 'short',
									day: 'numeric',
								})}
							</li>
						))}
					</ol>

					{mostNeglectedItem.length ? (
						<>
							<h3 className="Summary__heading sub">
								Did you forget about these?
							</h3>

							{mostNeglectedItem.map((item) => (
								<div key={item.id}>
									<p>
										The item "{item.name}" is{' '}
										{getDaysBetweenDates(item.refTime, currentTime)} days old
										and was never purchased.
									</p>
								</div>
							))}
						</>
					) : (
						<h3 className="Summary__heading sub">
							You have bought everything on your list at least once. Good job!
						</h3>
					)}
				</div>
			) : (
				<p>No purchase history found.</p>
			)}

			<h3 className="Summary__heading sub">Personal Goals</h3>
			<Goals />
		</div>
	);
}
