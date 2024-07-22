import React from "react";
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { CaretRight, CaretLeft } from 'phosphor-react-native';
import { StyledH1, StyledH2, StyledH3, StyledH4, fontStyles } from '../../text/StyledText';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Color from '../../../assets/themes/Color'
import AddTasksButton from "./AddTasksButton";


const TaskHeader = ({
	onAddTask,
	onAddHabit,
	goToPreviousDay,
	showDatePicker,
	dateText,
	goToNextDay,
	isDatePickerVisible,
	handleConfirm,
	hideDatePicker,
	selectedDate,
}) => {
	return (

		<View style={{ marginVertical: 0 }}>


			<View style={styles.datePicker}>
				<View style={styles.dateSettings}>
					<View style={styles.currentDateContainer}>

						<TouchableOpacity style={styles.caretLeftContainer} onPress={goToPreviousDay}>
							<CaretLeft size={25} weight="fill" color={Color.Blue} style={styles.caretLeft} />
						</TouchableOpacity>

						<TouchableOpacity onPress={showDatePicker}>
							<StyledH2 text={dateText} style={styles.currentDate} />
						</TouchableOpacity>

						<TouchableOpacity style={styles.caretRightContainer} onPress={goToNextDay}>
							<CaretRight size={25} weight="fill" color={Color.Blue} style={styles.caretRight} />
						</TouchableOpacity>

						<DateTimePickerModal isVisible={isDatePickerVisible} mode="date" display='inline' onConfirm={handleConfirm} onCancel={hideDatePicker} date={selectedDate} />

					</View>
				</View>
			</View>
			<View style={styles.addButtons}>
				<TouchableOpacity onPress={onAddTask} style={styles.addButton}>
					<StyledH3 text={"+ Add Task"} weight="regular" />
				</TouchableOpacity>

				<TouchableOpacity onPress={onAddHabit} style={styles.addButton}>
					<StyledH3 text={"+ Add Habit"} weight="regular" />
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
  addButton: {
		alignSelf: "center",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#252F68",
		borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 25,

	},
  addButtons: {
		flexDirection: "row",
    gap: 20,
    alignSelf: "center",
		marginVertical: 10,
	},
	dateSettings: {
		// backgroundColor: Color.Blue,
		paddingHorizontal: 10,
		bottom: 12,
		alignSelf: "flex-end",
		alignItems: "center",
		justifyContent: "center"

	},

	caretLeft: {
		marginHorizontal: 14,
		marginLeft: 20,
		marginVertical: 8,
	},
	caretRight: {
		marginHorizontal: 14,
		marginRight: 20,
		marginVertical: 8,
	},
	datePicker: {
		top: 0,
		// height: 110,
		width: "100%",
		backgroundColor: Color.DarkestBlue,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "black",
		shadowOpacity: 1,
		shadowRadius: 8,
	},
	currentDateContainer: {
		marginTop: 70,
		flexDirection: "row",
		backgroundColor: "#101326",
		borderRadius: 8,
		paddingHorizontal: 0,
		alignItems: "center"
	},

})

export default TaskHeader;