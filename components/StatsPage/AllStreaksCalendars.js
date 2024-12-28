import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
// import Color from '../../assets/themes/Color'
import { StyledH1, StyledH2, StyledH3 } from '../text/StyledText';
import StreaksCalendar from './StreaksCalendar';
import { v4 as uuidv4 } from 'uuid';
import { toYMDFormat } from '../../utils/DateHelper';
import { updateHabitStats } from '../TasksPage/TasksPageSupabase';
import { useColorsStateContext } from '../ColorContext';



const AllStreaksCalendars = ({ habitStats, taskItems, habitHistory, setHabitStats }) => {

	const [allCalendars, setAllCalendars] = useState([])

	const { ColorState, setColorState } = useColorsStateContext();
	const styles = getDynamicStyles(ColorState)

	const generateCalendars = () => {
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

			for (let i = historyLength - 1; i >= 0; i--) {
				let dueDateRaw = allHistories[historyLength - i - 1]
				let status = myStat.history[dueDateRaw]
				let dueDate = toYMDFormat(dueDateRaw)
				// console.log(dueDate)

				if (status == "incomplete") {
					markedDates[dueDate] = { selected: true, color: ColorState?.RedAccent, textColor: "black" }
				}
				else if (status == "exempt" || status == "pending") {
					markedDates[dueDate] = { selected: true, color: ColorState?.BlueAccent, textColor: "black" }

				} else if (status == "complete") {
					markedDates[dueDate] = { selected: true, color: ColorState?.GreenAccent, textColor: "black" }
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
		const allCalendarsNew = []
		for (const [date, properties] of Object.entries(allMarkedDates)) {
			allCalendarsNew.push(
				<StreaksCalendar markedDates={properties.markedDates} key={uuidv4()} title={properties.title} style={styles.streaksCalendar} />
			);
		}
		setAllCalendars(allCalendarsNew)
	}

	useEffect(() => {
		// update habit stats when page is loaded
		updateHabitStats(setHabitStats, habitHistory)
		generateCalendars()
	}, [])

	useEffect(() => {
		// console.log("updating calendar")
		// update habit stats when page is loaded
		updateHabitStats(setHabitStats, habitHistory)
		generateCalendars()
	}, [habitHistory])



	return (
		<View style={styles.habitsCalendarView}>
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
	)
}

export default AllStreaksCalendars

const getDynamicStyles = (ColorState) => ({
	habitsCalendarView: {
		display: "flex",
		gap: 20,
		padding: 12,
		paddingBottom: 200,
	},
	sectionHeading: {
		alignSelf: "center",
		color: ColorState?.TextColorOnBg
	},
	infoBox: {
		display: "flex",
		backgroundColor: ColorState?.GrayBlue,
		alignSelf: "center",
		paddingHorizontal: 10,
		paddingVertical: 10,
		borderRadius: 20,
	},
});