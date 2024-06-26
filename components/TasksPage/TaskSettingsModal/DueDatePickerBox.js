import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, Button } from 'react-native'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { PencilSimple } from 'phosphor-react-native';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import * as Haptics from 'expo-haptics'
// import CheckBox from '../FormComponents/CheckBox';
// import HighlightSelect from '../FormComponents/HighlightSelect';
import {StyledH1, StyledH2, StyledH3, StyledH4, fontStyles, loadFonts} from '../../text/StyledText';
import { ACTIONS } from '../../../utils/Actions_TaskSettingsModal';
import Color from '../../../assets/themes/Color'

const DueDatePickerBox = ({dispatch, dateTime, includeOnlyTime=false}) => {

	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  // const [selectedDateTime, setSelectedDateTime] = useState(new Date())
  
  // useEffect(() => {
  //   onChange(selectedDateTime, includeOnlyTime)
  // }, [selectedDateTime])

	const showDatePicker = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
		setDatePickerVisibility(true);
	};

	const hideDatePicker = () => {
		setDatePickerVisibility(false);
	};

	const handleConfirm = (date) => {
		hideDatePicker(); // must be first
    // setSelectedDateTime(new Date(date))
    dispatch({type: ACTIONS.UPDATE_DUE_DATE_TIME, payload: {dueDate: new Date(date)}})
	};

  return (
    <View style={styles.inputBox}>
      <StyledH2 text={"Due Date / Time"} style={styles.inputTitle}/>

      <View style={styles.dateRow}>

        <TouchableOpacity onPress={showDatePicker}>
          <View style={styles.currentDateContainer}>
            <StyledH3 text={dateTime.toLocaleDateString()} style={styles.currentDate}/>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={showDatePicker}>
          <View style={styles.currentTimeContainer}>
            <StyledH3 text={dateTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} style={styles.currentDate}/>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={showDatePicker}>
          <View style={styles.changeDateButton}>
            <PencilSimple size={25} weight="bold" color={"black"} style={styles.buttonIcon} />
          </View>
        </TouchableOpacity>

      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        display='inline'
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={dateTime}
      />
    </View>
  )
}

export default DueDatePickerBox

const styles = StyleSheet.create({
  inputBox: {
    backgroundColor: Color.DarkestBlue,
    borderRadius: 12,
    paddingHorizontal: 27,
    paddingVertical: 20,
    flexDirection: "column",
    marginBottom: 22,
	  justifyContent: "center"
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentDateContainer: {
    backgroundColor: "hsl(0, 0%, 24%)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    padding: 2,
  },
  currentTimeContainer: {
    backgroundColor: "hsl(0, 0%, 24%)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    padding: 2,
  },
  currentDate: {
    color: "white",
    // color: "hsla(114, 100%, 50%, 1)"
  },
  inputTitle: {
	  marginBottom: 8,
  },
  changeDateButton: {
    backgroundColor: Color.Blue,
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    marginRight: 20,
    alignItems: 'center',
  }
})