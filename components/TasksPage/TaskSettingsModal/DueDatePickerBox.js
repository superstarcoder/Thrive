import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, Button } from 'react-native'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Calendar, CalendarCheck, Pencil, PencilSimple } from 'phosphor-react-native';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as Haptics from 'expo-haptics'
// import CheckBox from '../FormComponents/CheckBox';
// import HighlightSelect from '../FormComponents/HighlightSelect';
import { StyledH1, StyledH2, StyledH3, StyledH4, fontStyles, loadFonts } from '../../text/StyledText';
import { ACTIONS } from '../../../utils/Actions_TaskSettingsModal';
import { useColorsStateContext } from '../../ColorContext';


const DueDatePickerBox = ({ dispatch, dateTime, isHabit }) => {

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isDateTimePickerVisible, setDateTimePickerVisibility] = useState(false);

  const { ColorState, setColorState } = useColorsStateContext();
  const styles = getDynamicStyles(ColorState)
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


  const showTimePicker = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const showDateTimePicker = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setDateTimePickerVisibility(true);
  };

  const hideDateTimePicker = () => {
    setDateTimePickerVisibility(false);
  };

  const handleDateTimeConfirm = (new_datetime) => {
    // console.log(new_datetime)
    hideDateTimePicker(); // must be first
    // setSelectedDateTime(new Date(date))
    dispatch({ type: ACTIONS.UPDATE_DUE_DATE_TIME, payload: { dueDate: new Date(new_datetime) } })
  };

  const handleTimeConfirm = (new_time) => {
    // console.log({"new": new_time.toLocaleString(), "old": dateTime.toLocaleString()})
    hideTimePicker(); // must be first
    // setSelectedDateTime(new Date(date))
    dispatch({ type: ACTIONS.UPDATE_DUE_DATE_TIME, payload: { dueDate: new Date(new_time) } })
  };


  const handleDateConfirm = (new_date) => {
    // console.log({"new": new_date.toLocaleString(), "old": dateTime.toLocaleString()})
    hideDatePicker(); // must be first
    // setSelectedDateTime(new Date(date))
    dispatch({ type: ACTIONS.UPDATE_DUE_DATE_TIME, payload: { dueDate: new Date(new_date) } })
  };

  var boxTitle
  if (isHabit) {
    boxTitle = "Due Time"
  } else {
    boxTitle = "Due Date / Time"
  }

  return (
    <View style={styles.inputBox}>
      <StyledH2 text={boxTitle} style={styles.inputTitle} />

      <View style={styles.dateRow}>

        {!isHabit &&
          <TouchableOpacity onPress={showDatePicker}>
            <View style={styles.currentDateContainer}>
              <StyledH3 text={dateTime.toLocaleDateString()} style={styles.currentDate} />
            </View>
          </TouchableOpacity>
        }


        <TouchableOpacity onPress={showTimePicker}>
          <View style={styles.currentTimeContainer}>
            <StyledH3 text={dateTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} style={styles.currentDate} />
          </View>
        </TouchableOpacity>

        {!isHabit &&
          <TouchableOpacity onPress={showDateTimePicker}>
            <View style={styles.changeDateButton}>
              <CalendarCheck size={25} weight="regular" color={"black"} style={styles.buttonIcon} />
            </View>
          </TouchableOpacity>
        }

        {isHabit &&
          <TouchableOpacity onPress={showTimePicker}>
            <View style={styles.changeTimeButton}>
              <Pencil size={25} weight="regular" color={"black"} style={styles.buttonIcon} />
            </View>
          </TouchableOpacity>
        }

      </View>
      <DateTimePickerModal
        isVisible={isDateTimePickerVisible}
        mode="datetime"
        display='inline'
        onConfirm={handleDateTimeConfirm}
        onCancel={hideDateTimePicker}
        date={dateTime}
      />

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
        date={dateTime}
      />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
        date={dateTime}
      />

    </View>
  )
}

export default DueDatePickerBox

const getDynamicStyles = (ColorState) => ({
  inputBox: {
    backgroundColor: ColorState?.DarkestBlue,
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
    backgroundColor: ColorState?.DarkBlue,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    padding: 2,
  },
  currentTimeContainer: {
    backgroundColor: ColorState?.DarkBlue,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    padding: 2,
  },
  currentDate: {
    color: ColorState?.TextColor,
    // color: "hsla(114, 100%, 50%, 1)"
  },
  inputTitle: {
    color: ColorState?.TextColorOnBg,
    marginBottom: 8,
  },
  changeDateButton: {
    backgroundColor: ColorState?.Blue,
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    marginRight: 20,
    alignItems: 'center',
  },
  changeTimeButton: {
    backgroundColor: ColorState?.Blue,
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    marginRight: 20,
    alignItems: 'center',
  }
});