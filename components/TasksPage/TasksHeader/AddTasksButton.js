import React from "react";
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { CaretRight, CaretLeft } from 'phosphor-react-native';
import {StyledH1, StyledH2, StyledH3, StyledH4, fontStyles} from '../../text/StyledText';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Color from '../../../assets/themes/Color'
import { LinearGradient } from 'expo-linear-gradient';



const AddTasksButton = ({onAddTaskPress}) => {
  return (
  <View>
	<TouchableOpacity onPress={onAddTaskPress} >

	<LinearGradient
        // Button Linear Gradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.addTasksButton}>
		<StyledH2 text={"Add Task"} />
      </LinearGradient>

	</TouchableOpacity>
</View>
  )
}

const styles = StyleSheet.create({ 
	addTasksButton: {
		height: 50,
		width: 270,
		// backgroundColor: "white",
		alignSelf: "center",
		borderWidth: 5,
		borderColor: "#100028",
		backgroundColor: "#252F68",
		marginTop: 10,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
	}

})

export default AddTasksButton;