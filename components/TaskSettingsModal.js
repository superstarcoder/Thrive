import React, {useState, useRef, useCallback,  forwardRef, useImperativeHandle, useEffect, useReducer } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Modal, Button } from 'react-native';
import Color from '../assets/themes/Color'
import {StyledH1, StyledH2, StyledH3, StyledH4, fontStyles} from './text/StyledText';
import { useFonts } from 'expo-font'
import BottomSheet from './BottomSheet';
import TitleBox from './TitleBox';
import DurationBox from './DurationBox'
import ImportanceBox from './ImportanceBox';
import DescriptionBox from './DescriptionBox';
import UseHabitBox from './UseHabitBox';
import RepeatBox from './RepeatBox';
import DueDatePickerBox from './DueDatePickerBox';
import { Trash, XCircle, CheckCircle} from 'phosphor-react-native';
import * as Haptics from "expo-haptics"

export const ACTIONS = {
  UPDATE_TITLE: "update_title",
  UPDATE_DURATION: "update_duration",
  UPDATE_IMPORTANCE: "update_importance",
  UPDATE_DESCRIPTION: "update_description",
  UPDATE_IS_HABIT: "update_isHabit",
  UPDATE_REPEAT_DAYS: "update_repeatDays",
  SINGLE_UPDATE_REPEAT_DAYS: "single_update_repeatDays",
  UPDATE_DUE_DATE_TIME: "update_due_date_time",
  UPDATE_ALL: "update_all"
}

function reducer(taskSettings, action) {
  switch (action.type) {
    case "update_title":
      console.log(action.payload.title)
      return {...taskSettings, title: action.payload.title}
    case "update_duration":
      console.log(action.payload.duration)
      return {...taskSettings, duration: action.payload.duration}
    case "update_importance":
      console.log(action.payload.importance)
      return {...taskSettings, importance: action.payload.importance}
    case "update_description":
      console.log(action.payload.description)
      return {...taskSettings, description: action.payload.description}
    case "update_isHabit":
      console.log(action.payload.isHabit)
      return {...taskSettings, isHabit: action.payload.isHabit}
    case "update_repeatDays":
      console.log(action.payload.repeatDays)
      return {...taskSettings, repeatDays: action.payload.repeatDays}
    case "single_update_repeatDays":
      console.log(action.payload.day, action.payload.selected)
      const newRepeatDays = taskSettings.repeatDays
      newRepeatDays[action.payload.day] = action.payload.selected
      return {...taskSettings, repeatDays: newRepeatDays}
    case "update_due_date_time":
      console.log(action.payload.dueDate)
      return {...taskSettings, dueDate: action.payload.dueDate}
    case "update_all":
      return action.payload.newTaskSettings
    default:
      return taskSettings
  }
}

const TaskSettingsModal = forwardRef (({onSave, initialSettings}, ref) => {

  // const titleBoxRef = useRef()

  useImperativeHandle(ref, () => ({

    showTaskSettings () {
      const isActive = bottomSheetRef?.current?.isActive()
      bottomSheetRef?.current?.scrollTo(1)
      // titleBoxRef?.current?.setValue("initial")
    }
  }));

	const bottomSheetRef = useRef(null)

	const onSavePress = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
		bottomSheetRef?.current?.scrollTo(0)

    settingsCopy = {...taskSettings}
    settingsCopy.description = settingsCopy.description.replace(/^\s+|\s+$/g, '');
    settingsCopy.title = settingsCopy.title.replace(/^\s+|\s+$/g, '');
    dispatch({type: ACTIONS.UPDATE_ALL, payload: {newTaskSettings: settingsCopy}})
    onSave(settingsCopy)

	  }
  const onCancelPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    bottomSheetRef?.current?.scrollTo(0)
  }
  const onDeletePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    bottomSheetRef?.current?.scrollTo(0)
  }


  // task structure:
  // const initialSettings = {title: "", duration: 0, importance: 0, description: "", isHabit: false, repeatDays: {}, dueDate: new Date(), includeOnlyTime: false}
  // const [currentSettings, setCurrentSettings] = useState(initialSettings)

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  let initRepeatDays = {} 
  for (day of daysOfWeek) {
    initRepeatDays[day] = false
  }
  const [taskSettings, dispatch] = useReducer(reducer, {title: "", duration: 0, importance: 0, description: "", isHabit: false, repeatDays: initRepeatDays, dueDate: new Date(), includeOnlyTime: false})

	return (
	<BottomSheet ref={bottomSheetRef} test="yo i am a prop" customStyle={styles.addTaskModal} clamps={[0, 0.5, 1]} scrollingEnabled={false}>

	{/* <KeyboardAvoidingView behavior="padding" enabled> */}
		<ScrollView style={[styles.addTaskModalSettings]}>
		  <TitleBox title={taskSettings.title} dispatch={dispatch}/>
		  <DurationBox duration={taskSettings.duration} dispatch={dispatch}/>
		  <ImportanceBox importance={taskSettings.importance} dispatch={dispatch}/>
		  <DescriptionBox description={taskSettings.description} dispatch={dispatch}/>
		  <StyledH1 style={styles.settingsTitle} text={"Habit Settings"}/>
		  <UseHabitBox dispatch={dispatch} selected={taskSettings.isHabit}/>
		  <RepeatBox dispatch={dispatch} repeatDays={taskSettings.repeatDays}/>
		  <StyledH1 style={styles.settingsTitle} text={"Advanced"}/>
		  <DueDatePickerBox dispatch={dispatch} dateTime={taskSettings.dueDate} includeOnlyTime={taskSettings.includeOnlyTime}/>
		</ScrollView>

	  {/* </ KeyboardAvoidingView > */}
	  <View style={styles.addTaskModalButtons}>
		  <TouchableOpacity onPress={onSavePress}>
        <View style={styles.saveTaskButton}>
          <Text style={[fontStyles.styledH1, styles.buttonText]}>Save</Text>
          {/* <CheckCircle size={30} weight="bold" color={"black"} style={styles.saveButtonIcon} /> */}
        </View>
		  </TouchableOpacity>

		  <TouchableOpacity onPress={onCancelPress}>
        <View style={styles.cancelTaskButton}>
          {/* <Text style={[fontStyles.styledH1, styles.buttonText]}>Cancel</Text> */}
          <XCircle size={30} weight="bold" color={"black"} style={styles.buttonIcon} />
        </View>
		  </TouchableOpacity>

		  <TouchableOpacity onPress={onDeletePress}>
        <View style={styles.deleteTaskButton}>
          <Trash size={30} weight="bold" color={"black"} style={styles.buttonIcon} />
        </View>
		  </TouchableOpacity>
		
		</View>
	</BottomSheet>
	);
});

export default TaskSettingsModal

const styles = StyleSheet.create({

  buttonText: {
    color: "#000"
  },
  saveButtonIcon: {
    marginLeft: 5,
  },
  settingsTitle: {
    alignSelf: "center",
    marginBottom: 25,
  },
  saveTaskButton: {
    backgroundColor: "hsla(114, 100%, 36%, 1)",
    width: 100,
    height: 45,
    borderRadius: 12,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: "row",
  },
  cancelTaskButton: {
    backgroundColor: Color.Blue,
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    marginRight: 20,
    alignItems: 'center',
  },
  deleteTaskButton: {
    backgroundColor: "hsl(0, 81%, 50%)",
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTaskModalButtons: {
    backgroundColor: Color.GrayBlue,
    height: 90,
    marginBottom: 25,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    // position: "absolute",
    alignSelf: "center",
    bottom: 25,
    width: "100%",
    marginTop: 25,
    shadowColor: "black",
    shadowOpacity: 0.2,
    paddingBottom: 10,
  },
  addTaskModalSettings: {
    flexDirection: "column",
    // backgroundColor: Color.Gray,
    paddingHorizontal: 30,
  },
  addTaskModal: {
		backgroundColor: Color.GrayBlue,
    // paddingHorizontal: 30,
  },

})