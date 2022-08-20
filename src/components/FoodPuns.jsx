import puns from '../utils/puns';

function FoodPuns() {
	let pun = puns[Math.floor(Math.random() * puns.length)];
	return (
		<div className="foodpuns">
			<p className="foodpuns__content">{pun}</p>
		</div>
	);
}

export default FoodPuns;
