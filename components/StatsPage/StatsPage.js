import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Color from '../../assets/themes/Color'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { StyledH1, StyledH2 } from '../text/StyledText';
import StreaksCalendar from './StreaksCalendar';
import { v4 as uuidv4 } from 'uuid';

const StatsPage = ({ habitStats, taskItems }) => {

	var allMarkedDates = {}
	// for (const [habitId, myStat] of Object.entries(habitStats)) {
	// 	let markedDates = {}
	// 	const allHistories = Object.keys(myStat.history);
	// 	for (let i = 0; i < Object.keys(myStat.history).length; i++) {
	// 		let dueDate = allHistories[i]
	// 		let status = myStat.history[dueDate]
	// 		console.log({dueDate, status})

	// 		let editedDueDate = new Date(dueDate)
	// 		editedDueDate = editedDueDate.toLocaleDateString()

	// 		if (status == "incomplete") {
	// 			markedDates[dueDate] = { selected: true, selectedColor: 'red' }
	// 		}
	// 		else if (status == "exempt") {
	// 			markedDates[dueDate] = { selected: true, selectedColor: 'blue' }

	// 		} else if (status == "complete") {
	// 			markedDates[dueDate] = { selected: true, selectedColor: 'green' }
	// 		}
	// 	}
	// 	allMarkedDates.push(markedDates)
	// }


	for (const [habitId, myStat] of Object.entries(habitStats)) {
		let markedDates = {}
		const allHistories = Object.keys(myStat.history);

		let prevStatus = null
		let prevDueDate = null
		let historyLength = Object.keys(myStat.history).length
		for (let i = 0; i < historyLength; i++) {
			let dueDateRaw = allHistories[historyLength - i - 1]
			let status = myStat.history[dueDateRaw]
			// console.log({ dueDate, status })

			let dueDate = dueDateRaw
			// let dueDate = new Date(dueDateRaw)
			// dueDate = dueDate.toLocaleDateString()

			if (status == "incomplete") {
				markedDates[dueDate] = { selected: true, color: 'red' }
			}
			else if (status == "exempt" || status == "pending") {
				markedDates[dueDate] = { selected: true, color: 'blue' }

			} else if (status == "complete") {
				markedDates[dueDate] = { selected: true, color: 'green' }
			} else {
				console.warn("uhoh")
				console.warn({status})
			}

			// console.log({markedDates})

			console.log({ prevStatus, status })
			if (prevStatus == null) {
				markedDates[dueDate]["startingDay"] = true
			} else if (i == Object.keys(myStat.history).length - 1) {
				markedDates[dueDate]["endingDay"] = true
			} else if (prevStatus != status) {
				// prev date is ending the period
				// console.log({prevDueDate})
				markedDates[prevDueDate]["endingDay"] = true
				// current date is starting a new period
				markedDates[dueDate]["startingDay"] = true
			}
			prevDueDate = dueDate
			prevStatus = status
		}

		// habitId
		const currentTask = taskItems.find(x => x.id == habitId)

		allMarkedDates[habitId] = { markedDates: markedDates, title: currentTask.title, id: uuidv4()}
	}



	// console.log(JSON.stringify(allMarkedDates, null, 2))

	const markedDatesTemp = {
		'2024-06-06': { textColor: 'green' },
		'2024-06-07': { startingDay: true, color: 'green' },
		'2012-06-08': { selected: true, endingDay: true, color: 'green', textColor: 'gray' },
		'2012-06-09': { disabled: true, startingDay: true, color: 'green', endingDay: true }
	}


	const allCalendars = []


	for (const [date, properties] of Object.entries(allMarkedDates)) {
		allCalendars.push(
			<StreaksCalendar markedDates={properties.markedDates} />
		);
	}
	return (
		<View style={styles.container}>
			<ScrollView style={styles.scrollView}>
				<View style={styles.scrollViewContainer}>
					<StyledH1 text={"Habits This Past Month"} style={styles.sectionHeading} />
					{/* <StreaksCalendar markedDates={allMarkedDates[231].markedDates} />
					<StreaksCalendar markedDates={markedDatesTemp} /> */}
					{allCalendars}

				</View>
			</ScrollView>
		</View>
	)
}

export default StatsPage


const styles = StyleSheet.create({
	scrollView: {
		display: "flex",
		paddingTop: 100,
		flexDirection: "column",
	},
	container: {
		flexGrow: 1,

	},
	scrollViewContainer: {
		display: "flex",
		gap: 20,
		padding: 12,
		paddingBottom: 200,
	},
	sectionHeading: {
		alignSelf: "center"
	},
	container: {
		flex: 1,
		backgroundColor: Color.DarkestBlue,
	},
	text: {
		color: Color.White,
	},
	tasksWrapper: {
		marginTop: 20,
		paddingHorizontal: 20,
	},
	sectionTitle: {
		marginBottom: 20,
	},
	items: {
		// marginTop: 20,
	},
	writeTaskWrapper: {
		position: 'absolute',
		bottom: 60,
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	input: {
		paddingVertical: 15,
		paddingHorizontal: 15,
		backgroundColor: '#FFF',
		borderRadius: 60,
		borderColor: '#C0C0C0',
		borderWidth: 1,
		width: 250,
	},
	addWrapper: {
		width: 60,
		height: 60,
		backgroundColor: '#FFF',
		borderRadius: 60,
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: '#C0C0C0',
		borderWidth: 1,
	},
	myCalendar: {
		display: "flex",
		borderWidth: 1,
		borderColor: 'gray',
		borderRadius: 5,
		margin: 12,
		elevation: 5,
		borderWidth: 4,
		borderColor: 'rgba(100, 100, 100, 0.2)'
	}

});