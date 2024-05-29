import React from "react";
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { CaretRight, CaretLeft } from 'phosphor-react-native';
import {StyledH1, StyledH2, StyledH3, StyledH4, fontStyles} from '../../text/StyledText';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Color from '../../../assets/themes/Color'
import { LinearGradient } from 'expo-linear-gradient';



const AddTasksButton = ({onPress}) => {
  return (
  <View>
	<TouchableOpacity onPress={onPress} style={styles.addTasksButton}>

	{/* <LinearGradient
	x1='0%'
	y1='0%'
	x2='0%'
	y2='100%'
        // Button Linear Gradient
        colors={['#3848a0', '#252F68', '#030a2a']}
        > */}
			
		<StyledH2 text={"Add Task"} weight="regular"/>
      {/* </LinearGradient> */}

	</TouchableOpacity>
</View>
  )
}

const styles = StyleSheet.create({ 
	addTasksButton: {
		height: 45,
		width: 270,
		// backgroundColor: "white",
		alignSelf: "center",
			// borderWidth: 5,
		backgroundColor: "#252F68",
		marginVertical: 10,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
	}

})

export default AddTasksButton;