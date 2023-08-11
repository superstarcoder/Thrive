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
import { ACTIONS, TASK_SETTINGS_MODES } from './MyGlobalVars';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

function reducer(taskSettings, action) {
  switch (action.type) {
    case "update_title":
      console.log(action.payload.title)
      return {...taskSettings, title: action.payload.title}
    case "update_duration":
      console.log("update_duration: "+action.payload.duration)
      console.log("update_duration payload: "+JSON.stringify(action.payload))
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
      console.log(action.payload.dayInt, action.payload.selected)
      const newRepeatDays = taskSettings.repeatDays
      newRepeatDays[action.payload.dayInt] = action.payload.selected
      return {...taskSettings, repeatDays: newRepeatDays}
    case "update_due_date_time":
      console.log(action.payload.dueDate)
      return {...taskSettings, dueDate: action.payload.dueDate}
    case "update_all":
      // console.log("updated duration: "+action.payload.newTaskSettings.duration)
      return action.payload.newTaskSettings
    default:
      return taskSettings
  }
}

const TaskSettingsModal = forwardRef (({onSave, onEdit, onDelete}, ref) => {

  useImperativeHandle(ref, () => ({

    showAddTaskModal () {
      const todaysDate = new Date();
      var endOfDayObj = new Date(todaysDate.getFullYear()
      ,todaysDate.getMonth()
      ,todaysDate.getDate()
      ,23,59,59);

      bottomSheetRef?.current?.scrollTo(1)
      const initSettings = {title: "", duration: 0.5, importance: 5, description: "", isHabit: false, repeatDays: initRepeatDays, dueDate: endOfDayObj, includeOnlyTime: false, id: uuidv4()}
      dispatch({type: ACTIONS.UPDATE_ALL, payload: {newTaskSettings: initSettings}})
      durationBoxRef?.current?.setDuration(initSettings.duration)
      importanceBoxRef?.current?.setImportance(initSettings.importance)
      setSettingsMode(TASK_SETTINGS_MODES.ADD_TASK)
    },
    showEditTaskModal (myTaskSettings) {

      bottomSheetRef?.current?.scrollTo(1)
      dispatch({type: ACTIONS.UPDATE_ALL, payload: {newTaskSettings: myTaskSettings}})
      durationBoxRef?.current?.setDuration(myTaskSettings.duration)
      importanceBoxRef?.current?.setImportance(myTaskSettings.importance)
      setSettingsMode(TASK_SETTINGS_MODES.EDIT_TASK)
    }
  }));

	const bottomSheetRef = useRef(null)
  const durationBoxRef = useRef(null)
  const importanceBoxRef = useRef(null)
  const [settingsMode, setSettingsMode] = useState(TASK_SETTINGS_MODES.INACTIVE)

	const onSavePress = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
		bottomSheetRef?.current?.scrollTo(0)

    if (settingsMode == TASK_SETTINGS_MODES.ADD_TASK) {
      settingsCopy = {...taskSettings}
      settingsCopy.description = settingsCopy.description.replace(/^\s+|\s+$/g, '');
      settingsCopy.title = settingsCopy.title.replace(/^\s+|\s+$/g, '');
      dispatch({type: ACTIONS.UPDATE_ALL, payload: {newTaskSettings: settingsCopy}})
      onSave(settingsCopy)
    }
    else if (settingsMode == TASK_SETTINGS_MODES.EDIT_TASK) {
      settingsCopy = {...taskSettings}
      settingsCopy.description = settingsCopy.description.replace(/^\s+|\s+$/g, '');
      settingsCopy.title = settingsCopy.title.replace(/^\s+|\s+$/g, '');
      dispatch({type: ACTIONS.UPDATE_ALL, payload: {newTaskSettings: settingsCopy}})
      onEdit(settingsCopy)
    }


	  }
  const onCancelPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    bottomSheetRef?.current?.scrollTo(0)
  }
  const onDeletePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    bottomSheetRef?.current?.scrollTo(0)
    onDelete(taskSettings)
  }

  let initRepeatDays =  Array(7).fill(false)

  const [taskSettings, dispatch] = useReducer(reducer, {title: "", duration: 0, importance: 0, description: "", isHabit: false, repeatDays: initRepeatDays, dueDate: new Date(), includeOnlyTime: false, id: uuidv4()})

	return (
	<BottomSheet ref={bottomSheetRef} test="yo i am a prop" customStyle={styles.addTaskModal} clamps={[0, 0.5, 1]} scrollingEnabled={false}>

		<ScrollView style={[styles.addTaskModalSettings]}>
		  <TitleBox title={taskSettings.title} dispatch={dispatch}/>
		  <DurationBox duration={taskSettings.duration} dispatch={dispatch} ref={durationBoxRef}/>
		  <ImportanceBox importance={taskSettings.importance} dispatch={dispatch} ref={importanceBoxRef}/>
		  <DescriptionBox description={taskSettings.description} dispatch={dispatch}/>
		  <StyledH1 style={styles.settingsTitle} text={"Habit Settings"}/>
		  <UseHabitBox dispatch={dispatch} selected={taskSettings.isHabit}/>
		  <RepeatBox dispatch={dispatch} repeatDays={taskSettings.repeatDays}/>
		  <StyledH1 style={styles.settingsTitle} text={"Advanced"}/>
		  <DueDatePickerBox dispatch={dispatch} dateTime={taskSettings.dueDate} includeOnlyTime={taskSettings.includeOnlyTime}/>
		</ScrollView>

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

      {settingsMode != TASK_SETTINGS_MODES.ADD_TASK && 
        <TouchableOpacity onPress={onDeletePress}>
          <View style={styles.deleteTaskButton}>
            <Trash size={30} weight="bold" color={"black"} style={styles.buttonIcon} />
          </View>
        </TouchableOpacity>
      }
		
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