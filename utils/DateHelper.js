export function onlyDatesAreSame(date1, date2) {
	// console.log(typeof date1, typeof date2)
	date1 = new Date(date1)
	date2 = new Date(date2)

	// console.log(date1.getFullYear(), date2.getFullYear())
	// console.log(date1.getMonth(), date2.getMonth())
	// console.log(date1.getDate(), date2.getDate())

	if (date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	) {
		return true
	}
	return false
	// return (
	// 	date1.getFullYear() === date2.getFullYear() &&
	// 	date1.getMonth() === date2.getMonth() &&
	// 	date1.getDate() === date2.getDate()
	//   );

}



export function getDateFromDatetime(datetime) {
	return new Date(datetime.getFullYear(), datetime.getMonth(), datetime.getDate())
}

export const toDateOnly = getDateFromDatetime // alias for getDateFromDatetime

// convert a datetime object that is in the UTC timezone into YYYY-MM-DD format

export function toYMDFormat(utcDateTime) {

	const localDate = new Date(utcDateTime);

	const localYear = localDate.getFullYear();
	const localMonth = String(localDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
	const localDay = String(localDate.getDate()).padStart(2, '0');

	const formattedDate = `${localYear}-${localMonth}-${localDay}`;
	return formattedDate
}

// edits the time of datetime to 11:59
export function getEndOfDay(datetime) {
	return new Date(datetime.getFullYear()
	, datetime.getMonth()
	, datetime.getDate()
	, 23, 59, 59);
}