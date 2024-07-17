import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Color from '../../assets/themes/Color'
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { StyledH1, StyledH2, StyledH3 } from '../text/StyledText';
import StreaksCalendar from './StreaksCalendar';
import { v4 as uuidv4 } from 'uuid';
import { toYMDFormat } from '../../utils/DateHelper';
import { updateHabitStats } from '../TasksPage/TasksPageSupabase';

const StatsPage = ({ habitStats, taskItems, habitHistory, setHabitStats }) => {

	// console.log(JSON.stringify(habitStats, null, 4))



	var allMarkedDates = {}

	for (const [habitId, myStat] of Object.entries(habitStats)) {
		let markedDates = {}
		const allHistories = Object.keys(myStat.history);

		let prevStatus = null
		let prevDueDate = null
		let historyLength = Object.keys(myStat.history).length

		if (historyLength == 0) {
			continue;
		}

		for (let i = 0; i < historyLength; i++) {
			let dueDateRaw = allHistories[historyLength - i - 1]
			let status = myStat.history[dueDateRaw]
			let dueDate = toYMDFormat(dueDateRaw)
			// console.log(dueDate)

			if (status == "incomplete") {
				markedDates[dueDate] = { selected: true, color: Color.RedAccent, textColor: "black" }
			}
			else if (status == "exempt" || status == "pending") {
				markedDates[dueDate] = { selected: true, color: Color.BlueAccent, textColor: "black" }

			} else if (status == "complete") {
				markedDates[dueDate] = { selected: true, color: Color.GreenAccent, textColor: "black" }
			} else {
				console.warn("uncrecognized status: " + status)
			}

			// console.log({markedDates})

			// console.log({ prevStatus, status })
			if (prevStatus == null) {
				markedDates[dueDate]["startingDay"] = true
			}
			if (i == Object.keys(myStat.history).length - 1) {
				markedDates[dueDate]["endingDay"] = true
			}
			if (prevStatus != null & prevStatus != status) {
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
		if (currentTask == undefined) {
			console.log("Unresolvable issue: task that is linked to habit stat was not found")
		} else {
			allMarkedDates[habitId] = { markedDates: markedDates, title: currentTask.title, id: uuidv4() }
		}

	}

	const allCalendars = []


	for (const [date, properties] of Object.entries(allMarkedDates)) {
		allCalendars.push(
			<StreaksCalendar markedDates={properties.markedDates} key={uuidv4()} title={properties.title} />
		);
	}

	useEffect(() => {
		// update habit stats when page is loaded
		updateHabitStats(setHabitStats, habitHistory)
	}, [])

	console.log(allCalendars)
	return (
		<View style={styles.container}>
			<ScrollView style={styles.scrollView}>
				<View style={styles.scrollViewContainer}>
					<StyledH1 text={"Habits This Past Month"} style={styles.sectionHeading} />
					{allCalendars.length == 0 &&
						<>
							<View style={styles.infoBox}>
								<StyledH3 text={"No habit data to display"} style={styles.infoText} />
							</View>

						</>
					}


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
	infoBox: {
		display: "flex",
		backgroundColor: Color.GrayBlue,
		alignSelf: "center",
		paddingHorizontal: 10,
		paddingVertical: 10,
		borderRadius: 20,
	},
	infoText: {
		alignSelf: "center",
		color: Color.BlueAccent
	},
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