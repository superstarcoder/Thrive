export function onlyDatesAreSame (date1, date2) {
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