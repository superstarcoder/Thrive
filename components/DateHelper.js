export function onlyDatesAreSame (date1, date2) {
	// console.log(typeof date1, typeof date2)
	date1 = new Date(date1)
	date2 = new Date(date2)

	console.log("log entry: "+date1.toLocaleString())
	console.log("selectedDate: "+date2.toLocaleString())
	// console.log(date1.getFullYear(), date2.getFullYear())
	// console.log(date1.getMonth(), date2.getMonth())
	// console.log(date1.getDate(), date2.getDate())

	if (date1.getFullYear() === date2.getFullYear() &&
	date1.getMonth() === date2.getMonth() &&
	date1.getDate() === date2.getDate()
	) {
		console.log("yeah they the same!!")
		return true
	}
	console.log("nah they diff")
	return false
	// return (
	// 	date1.getFullYear() === date2.getFullYear() &&
	// 	date1.getMonth() === date2.getMonth() &&
	// 	date1.getDate() === date2.getDate()
	//   );

}