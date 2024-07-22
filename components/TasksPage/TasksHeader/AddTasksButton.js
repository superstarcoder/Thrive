import React from "react";
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import {StyledH1, StyledH2, StyledH3, StyledH4, fontStyles} from '../../text/StyledText';

const AddTasksButton = ({onPress, text="Add Task / Habit"}) => {
  return (
  <View>
	<TouchableOpacity onPress={onPress} style={styles.bigButton}>
		<StyledH2 text={text} weight="regular"/>
	</TouchableOpacity>
</View>
  )
}

const styles = StyleSheet.create({ 
	bigButton: {
		height: 45,
		width: 270,
		alignSelf: "center",
		backgroundColor: "#252F68",
		marginVertical: 10,
		borderRadius: 20,
		alignItems: "center",
		justifyContent: "center",
	}

})

export default AddTasksButton;