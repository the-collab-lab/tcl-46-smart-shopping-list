import {
	ICalendar,
	GoogleCalendar,
	OutlookCalendar,
	YahooCalendar,
} from 'datebook';

export function Calendar({ listOfShoppingListItems }) {
	const handleCalendarDownload = (evt) => {
		const defaultStartTime = new Date(Date());
		const dt = new Date();
		dt.setHours(dt.getHours() + 1);
		const defaultEndTime = dt;
		const eventConfig = {
			title: 'Shopping trip',
			description: listOfShoppingListItems.join('\n'),
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
		<>
			<p>Want to add a shopping trip to your calendar? </p>
			<button type="button" onClick={handleCalendarDownload} name="ical">
				iCalendar
			</button>
			<button type="button" onClick={handleCalendarDownload} name="google">
				Google Calendar
			</button>
			<button type="button" onClick={handleCalendarDownload} name="outlook">
				Outlook Calendar
			</button>
			<button type="button" onClick={handleCalendarDownload} name="yahoo">
				Yahoo Calendar
			</button>
		</>
	);
}
