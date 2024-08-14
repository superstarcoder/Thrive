import React, { useState, useRef, useCallback, forwardRef, useImperativeHandle, useEffect, useReducer } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Modal, Button, Alert } from 'react-native';
import { useFonts } from 'expo-font'
import TitleBox from './TitleBox';
import DurationBox from './DurationBox'
import ImportanceBox from './ImportanceBox';
import DescriptionBox from './DescriptionBox';
import UseHabitBox from './UseHabitBox';
import RepeatBox from './RepeatBox';
import DueDatePickerBox from './DueDatePickerBox';
import { Trash, XCircle, CheckCircle, CheckFat } from 'phosphor-react-native';
import * as Haptics from "expo-haptics"
// import { ACTIONS, TASK_SETTINGS_MODES } from '../../utils/MyGlobalVars';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import BottomSheet from '../../FormComponents/BottomSheet';
import { ACTIONS, TASK_SETTINGS_MODES } from '../../../utils/Actions_TaskSettingsModal';
import { StyledH1, StyledH2, StyledH3, StyledH4, fontStyles } from '../../text/StyledText';
import { getDateFromDatetime, getEndOfDay, onlyDatesAreSame } from '../../../utils/DateHelper';
import { supabaseDeleteTask, supabaseInsertTask, supabaseUpdateTaskSettings } from '../TasksPageSupabase';
import { useColorsStateContext } from '../../ColorContext';


// finds the next due date after "initialDate" based on repeatDays
const findHabitNextDueDate = (initialDate, repeatDays, dueTime) => {
  // const todaysDate = new Date()
  var dayIndex = initialDate.getDay() - 1
  var daysAfterToday = 0
  if (dayIndex == -1) dayIndex = 6

  // find the next day where repeatDays[dayIndex] == true
  if (repeatDays[dayIndex] == false) {
    var i = dayIndex + 1
    if (i == 7) i = 0
    daysAfterToday = 1
    var dayFound = false

    while (i != dayIndex) {

      if (repeatDays[i] == false) {
        i += 1
        daysAfterToday += 1
      }
      else {
        dayFound = true
        break
      }

      if (i == 7) i = 0
    }

    if (dayFound) {
      dayIndex = i
    }
    else {
      return null
    }
  }

  const dueDate = new Date(initialDate.getFullYear(), initialDate.getMonth(), initialDate.getDate() + daysAfterToday, dueTime.getHours(), dueTime.getMinutes(), dueTime.getSeconds())

  return dueDate

}

const initHabitHistory = (repeatDays, dueTime) => {
  var dueDate = findHabitNextDueDate(new Date(), repeatDays, dueTime)
  if (dueDate == null) return []
  return [{ exactDueDate: dueDate, status: "pending", }]
}

function reducer(taskSettings, action) {
  switch (action.type) {
    case "update_title":
      return { ...taskSettings, title: action.payload.title }
    case "update_duration":
      return { ...taskSettings, duration: action.payload.duration }
    case "update_importance":
      return { ...taskSettings, importance: action.payload.importance }
    case "update_description":
      return { ...taskSettings, description: action.payload.description }
    case "update_isHabit":
      if (action.payload.isHabit == true) {
        var habitHistory = initHabitHistory(action.payload.repeatDays, action.payload.dueDate)
      }
      return { ...taskSettings, isHabit: action.payload.isHabit, habitHistory: habitHistory, habitInitDate: new Date() }
    case "single_update_repeatDays":
      const newRepeatDays = taskSettings.repeatDays
      newRepeatDays[action.payload.dayInt] = action.payload.selected
      if (action.payload.isHabit == true) {
        let today = new Date();
        return { ...taskSettings, repeatDays: newRepeatDays, repeat_days_edited_date: new Date() }
      }

      return { ...taskSettings, repeatDays: newRepeatDays }
    case "update_due_date_time":
      return { ...taskSettings, dueDate: action.payload.dueDate }
    case "update_all":
      return action.payload.newTaskSettings
    default:
      return taskSettings
  }
}

const TaskSettingsModal = forwardRef(({ session, syncLocalWithDb, supabase, taskItems, setTaskItems, habitHistory, setHabitHistory, habitStats, setHabitStats }, ref) => {


  const getInitSettings = (selectedDate = new Date()) => {
    var endOfDayObj = getEndOfDay(selectedDate)
    return {
      created_at: new Date(),
      title: "",
      habitHistory: null,
      habitInitDate: null,
      duration: 0.5,
      importance: 5,
      description: "",
      isHabit: false,
      repeatDays: initRepeatDays,
      dueDate: endOfDayObj,
      includeOnlyTime: true,
      status: "incomplete",
      repeat_days_edited_date: new Date()
    }
  }

  useImperativeHandle(ref, () => ({

    showAddTaskModal(selectedDate = new Date()) {
      const today = new Date();
      bottomSheetRef?.current?.scrollTo(1)

      const initSettings = getInitSettings(selectedDate)

      dispatch({ type: ACTIONS.UPDATE_ALL, payload: { newTaskSettings: initSettings } })
      durationBoxRef?.current?.setDuration(initSettings.duration)
      importanceBoxRef?.current?.setImportance(initSettings.importance)
      setSettingsMode(TASK_SETTINGS_MODES.ADD_TASK)
    },
    showEditTaskModal(myTaskSettings) {
      bottomSheetRef?.current?.scrollTo(1)
      scrollViewRef?.current?.scrollTo({
        y: 0,
      })
      dispatch({ type: ACTIONS.UPDATE_ALL, payload: { newTaskSettings: myTaskSettings } })
      durationBoxRef?.current?.setDuration(myTaskSettings.duration)
      importanceBoxRef?.current?.setImportance(myTaskSettings.importance)
      setSettingsMode(TASK_SETTINGS_MODES.EDIT_TASK)
    }
  }));

  const bottomSheetRef = useRef(null)
  const durationBoxRef = useRef(null)
  const importanceBoxRef = useRef(null)
  const [settingsMode, setSettingsMode] = useState(TASK_SETTINGS_MODES.INACTIVE)
  const { ColorState, setColorState } = useColorsStateContext();
  const styles = getDynamicStyles(ColorState)


  useEffect(() => {
    bottomSheetRef?.current?.scrollTo(0)
  }, [])


  const isSevenFalses = (list) => {
    return list.length === 7 && list.every(value => value === false);
  };

  // returns false if there was no error & true if there was
  const validateFields = () => {

    // console.log(taskSettings.isHabit)
    // console.log(taskSettings.repeatDays)

    if (taskSettings.title == "") {
      Alert.alert("Title cannot be left blank")
      return true
    }


    if (taskSettings.isHabit && isSevenFalses(taskSettings.repeatDays)) {
      Alert.alert("A repeat day must be selected for habits!")
      return true
    }
  }

  const onSavePress = async () => {

    let error = validateFields()
    if (error) return

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    bottomSheetRef?.current?.scrollTo(0)

    if (settingsMode == TASK_SETTINGS_MODES.ADD_TASK) {

      settingsCopy = { ...taskSettings }
      settingsCopy.description = settingsCopy.description.replace(/^\s+|\s+$/g, '');
      settingsCopy.title = settingsCopy.title.replace(/^\s+|\s+$/g, '');
      dispatch({ type: ACTIONS.UPDATE_ALL, payload: { newTaskSettings: settingsCopy } })
      await onSaveTask(settingsCopy)
    }
    else if (settingsMode == TASK_SETTINGS_MODES.EDIT_TASK) {
      settingsCopy = { ...taskSettings }
      settingsCopy.description = settingsCopy.description.replace(/^\s+|\s+$/g, '');
      settingsCopy.title = settingsCopy.title.replace(/^\s+|\s+$/g, '');
      dispatch({ type: ACTIONS.UPDATE_ALL, payload: { newTaskSettings: settingsCopy } })
      await onEditTaskComplete(settingsCopy)
    }
  }
  const onCancelPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    bottomSheetRef?.current?.scrollTo(0)
    // console.log("hiii")
  }
  const onDeletePress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    bottomSheetRef?.current?.scrollTo(0)
    await onDelete(taskSettings)
  }

  const onSaveTask = async (newTaskSettings) => {
    await supabaseInsertTask(session, newTaskSettings, setTaskItems, taskItems, habitHistory, setHabitHistory, habitStats, setHabitStats)
  }

  const onEditTaskComplete = async (taskSettingsEdited) => {
    await supabaseUpdateTaskSettings(session, taskSettingsEdited, taskSettingsEdited.id, setTaskItems, taskItems, setHabitStats, habitHistory);
  }

  const onDelete = async (taskSettingsToDelete) => {
    await supabaseDeleteTask(taskSettingsToDelete.id, taskSettingsToDelete.isHabit, setTaskItems, taskItems, habitHistory, setHabitHistory, setHabitStats)
  }

  let initRepeatDays = Array(7).fill(false)

  const [taskSettings, dispatch] = useReducer(reducer, getInitSettings())
  const scrollViewRef = useRef()

  const handleScroll = (event) => {
    // console.log(event.nativeEvent.contentOffset.y);
  }



  return (
    <BottomSheet ref={bottomSheetRef} customStyle={styles.addTaskModal} clamps={[0, 0.5, 1]} scrollingEnabled={false}>
      <View style={styles.headingBox}>
        <StyledH2 style={styles.infoText} text={"Task Settings"} />
        <CheckFat size={25} weight={"fill"} color={"green"} style={styles.buttonIcon} />
      </View>


      <ScrollView onScroll={handleScroll} style={[styles.addTaskModalSettings]} ref={scrollViewRef}>
        {/* <KeyboardAvoidingView style={{ flex: 1, justifyContent: 'center', }} behavior="padding" enabled keyboardVerticalOffset={100}> */}
        <TitleBox title={taskSettings.title} dispatch={dispatch} />
        <DescriptionBox bottomSheetRef={bottomSheetRef} description={taskSettings.description} dispatch={dispatch} />
        <DurationBox duration={taskSettings.duration} dispatch={dispatch} ref={durationBoxRef} />
        <ImportanceBox importance={taskSettings.importance} dispatch={dispatch} ref={importanceBoxRef} />
        <DueDatePickerBox dispatch={dispatch} dateTime={taskSettings.dueDate} includeOnlyTime={taskSettings.includeOnlyTime} />
        {/* <StyledH1 style={styles.settingsTitle} text={"Habit Settings"} />
        <UseHabitBox dispatch={dispatch} selected={taskSettings.isHabit} repeatDays={taskSettings.repeatDays} dueDate={taskSettings.dueDate} />
        <RepeatBox dispatch={dispatch} repeatDays={taskSettings.repeatDays} isHabit={taskSettings.isHabit} /> */}
        {/* <StyledH1 style={styles.settingsTitle} text={"Advanced"} /> */}
        {/* </KeyboardAvoidingView> */}
      </ScrollView>



      <View style={styles.addTaskModalButtons}>
        <TouchableOpacity onPress={onSavePress}>
          <View style={styles.saveTaskButton}>
            <Text style={[fontStyles.styledH1, styles.buttonText]}>Save</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={onCancelPress}>
          <View style={styles.cancelTaskButton}>
            <XCircle size={30} weight="bold" color={ColorState?.IconColor} style={styles.buttonIcon} />
          </View>
        </TouchableOpacity>

        {settingsMode != TASK_SETTINGS_MODES.ADD_TASK &&
          <TouchableOpacity onPress={onDeletePress}>
            <View style={styles.deleteTaskButton}>
              <Trash size={30} weight="bold" color={ColorState?.IconColor} style={styles.buttonIcon} />
            </View>
          </TouchableOpacity>
        }

      </View>
    </BottomSheet>
  );
});

export default TaskSettingsModal

const getDynamicStyles = (ColorState) => ({
  headingBox: {
    display: "flex",
    backgroundColor: ColorState?.DarkestBlue,
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 20,
    flexDirection: "row",
    gap: 10,
  },
  infoText: {
    alignSelf: "center",
    color: ColorState?.TextColorOnBg,
    alignSelf: "center",
  },

  buttonText: {
    color: ColorState?.IconColor
  },
  saveButtonIcon: {
    marginLeft: 5,
  },
  settingsTitle: {
    alignSelf: "center",
    marginBottom: 25,
  },
  saveTaskButton: {
    backgroundColor: ColorState?.GreenAccent,
    width: 100,
    height: 45,
    borderRadius: 12,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: "row",
  },
  cancelTaskButton: {
    backgroundColor: ColorState?.CancelButton,
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    marginRight: 20,
    alignItems: 'center',
  },
  deleteTaskButton: {
    backgroundColor: ColorState?.RedAccent,
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTaskModalButtons: {
    backgroundColor: ColorState?.GrayBlue,
    height: 90,
    marginBottom: 95,
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
    backgroundColor: ColorState?.GrayBlue,
    // paddingHorizontal: 30,
  },

});