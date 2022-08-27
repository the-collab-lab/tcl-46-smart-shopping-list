/* eslint-disable react-hooks/exhaustive-deps */
import puns from '../utils/puns';
import { useState, useEffect } from 'react';
import './FoodPuns.css';

const getPun = () => puns[Math.floor(Math.random() * puns.length)];

function FoodPuns() {
	const [pun, setPun] = useState(getPun);
	const [hidden, setHidden] = useState(false);
	useEffect(() => {
		handleSetPun();
	}, [window.location.pathname]);

	function handleSetPun() {
		setPun(getPun);
	}

	return (
		<div
			className="foodpuns"
			onClick={handleSetPun}
			onKeyPress={handleSetPun}
			role="button"
			tabIndex={0}
		>
			{hidden ? (
				''
			) : (
				<div>
					<p className="foodpuns__content">{pun}</p>
					<svg
						className="svg__icon"
						viewBox="0 0 39 54"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M20.3811 0C20.3811 0 -23.7781 47.9066 17.9049 50.3019C59.588 52.6972 20.3811 0 20.3811 0Z"
							fill="#CECF8F"
						/>
						<path d="M25.7856 49.9014L26.6904 53.5" stroke="#545047" />
						<path d="M25.7856 49.9014L26.6904 53.5" stroke="#545047" />
						<path d="M25.7856 49.9014L26.6904 53.5" stroke="#545047" />
						<ellipse
							cx="18.3212"
							cy="35.5069"
							rx="8.36905"
							ry="10.0762"
							fill="#A48364"
						/>
						<path
							d="M10.8569 19.4326C11.3847 20.8721 13.0284 22.8873 15.3807 19.4326"
							stroke="#545047"
						/>
						<path
							d="M10.8569 19.4326C11.3847 20.8721 13.0284 22.8873 15.3807 19.4326"
							stroke="#545047"
						/>
						<path
							d="M10.8569 19.4326C11.3847 20.8721 13.0284 22.8873 15.3807 19.4326"
							stroke="#545047"
						/>
						<path
							d="M21.7144 19.1929C22.2421 20.6323 23.8858 22.6476 26.2382 19.1929"
							stroke="#545047"
						/>
						<path
							d="M21.7144 19.1929C22.2421 20.6323 23.8858 22.6476 26.2382 19.1929"
							stroke="#545047"
						/>
						<path
							d="M21.7144 19.1929C22.2421 20.6323 23.8858 22.6476 26.2382 19.1929"
							stroke="#545047"
						/>
						<ellipse
							cx="18.3216"
							cy="22.3115"
							rx="1.58333"
							ry="0.719731"
							fill="#E77812"
						/>
						<path d="M9.49984 48.9419L7.9165 53.2603" stroke="#545047" />
						<path d="M9.49984 48.9419L7.9165 53.2603" stroke="#545047" />
						<path d="M9.49984 48.9419L7.9165 53.2603" stroke="#545047" />
						<path d="M0.452148 21.5918L3.61882 23.9909" stroke="#545047" />
						<path d="M0.452148 21.5918L3.61882 23.9909" stroke="#545047" />
						<path d="M0.452148 21.5918L3.61882 23.9909" stroke="#545047" />
						<path d="M33.7021 24.7108L37.9998 22.7915" stroke="#545047" />
						<path d="M33.7021 24.7108L37.9998 22.7915" stroke="#545047" />
						<path d="M33.7021 24.7108L37.9998 22.7915" stroke="#545047" />
					</svg>
					<button className="hide" onClick={() => setHidden(!hidden)}>
						X
					</button>
				</div>
			)}
		</div>
	);
}

export default FoodPuns;
