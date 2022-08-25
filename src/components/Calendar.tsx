import { useState } from 'react';
import {
	ICalendar,
	GoogleCalendar,
	OutlookCalendar,
	YahooCalendar,
} from 'datebook';

export function Calendar({ listOfShoppingListItems }) {
	const [exclude, setExclude] = useState(false);
	const excludeChecked = (array) => {
		return array.filter((item) => !item.isChecked);
	};
	const listOfItemNames = [];

	!exclude
		? listOfShoppingListItems.forEach((item) => {
				listOfItemNames.push(item.name);
		  })
		: excludeChecked(listOfShoppingListItems).forEach((item) => {
				listOfItemNames.push(item.name);
		  });

	const handleCalendarDownload = (evt) => {
		const defaultStartTime = new Date(Date());
		const dt = new Date();
		dt.setHours(dt.getHours() + 1);
		const defaultEndTime = dt;
		const eventConfig = {
			title: 'Shopping trip',
			description: listOfItemNames.join('\n'),
			start: defaultStartTime,
			end: defaultEndTime,
		};
		if (evt.target.name === 'ical') {
			const ical = new ICalendar(eventConfig);
			ical.download();
		} else if (evt.target.name === 'google') {
			const googleCalendar = new GoogleCalendar(eventConfig);
			window.open(googleCalendar.render());
		} else if (evt.target.name === 'outlook') {
			const outlookCalendar = new OutlookCalendar(eventConfig);
			window.open(outlookCalendar.render());
		} else {
			const yahooCalendar = new YahooCalendar(eventConfig);
			window.open(yahooCalendar.render());
		}
	};

	return (
		<div className="calendar">
			<h2 className="calendar__heading">Schedule a Shopping Trip 🛍</h2>
			<div className="calendar__exclude-container">
				<p className="calendar__subheading">
					You have {listOfItemNames.length} items in your current shopping cart.
				</p>
				<button
					type="button"
					id="excludeCheckedItems"
					aria-pressed={exclude}
					onClick={() => setExclude(!exclude)}
					className="calendar__exclude-button"
				>
					{exclude ? `Include Checked Items` : `Exclude Checked Items`}
				</button>
			</div>

			<div className="calendar__container">
				<button
					className="calendar__option"
					type="button"
					onClick={handleCalendarDownload}
					name="ical"
				>
					iCalendar
				</button>
				<button
					className="calendar__option"
					type="button"
					onClick={handleCalendarDownload}
					name="google"
				>
					Google Calendar
				</button>
				<button
					className="calendar__option"
					type="button"
					onClick={handleCalendarDownload}
					name="outlook"
				>
					Outlook Calendar
				</button>
				<button
					className="calendar__option"
					type="button"
					onClick={handleCalendarDownload}
					name="yahoo"
				>
					Yahoo Calendar
				</button>
			</div>
		</div>
	);
}
