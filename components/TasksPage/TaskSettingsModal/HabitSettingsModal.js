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
import { Trash, XCircle, CheckCircle, Plant } from 'phosphor-react-native';
import * as Haptics from "expo-haptics"
// import { ACTIONS, TASK_SETTINGS_MODES } from '../../utils/MyGlobalVars';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import BottomSheet from '../../FormComponents/BottomSheet';
import { ACTIONS, TASK_SETTINGS_MODES } from '../../../utils/Actions_TaskSettingsModal';
import { StyledH1, StyledH2, StyledH3, StyledH4, fontStyles } from '../../text/StyledText';
import Color from '../../../assets/themes/Color'
import { getDateFromDatetime, onlyDatesAreSame, getEndOfDay } from '../../../utils/DateHelper';
import { supabaseDeleteTask, supabaseInsertTask, supabaseUpdateTaskSettings, supabaseUpdateHabitHistoryEntry, editSelectedHabitOn_ConfirmEdit, editSelectedAndUpcoming_OnConfirmEdit, editAll_OnConfirmEdit } from '../TasksPageSupabase';

// finds the next due date after "initialDate" based on repeatDays
const findHabitNextDueDate = (initialDate, repeatDays, dueTime) => {
  // const todaysDate = new Date()
  var dayIndex = initialDate.getDay() - 1
  var daysAfterToday = 0
  if (dayIndex == -1) dayIndex = 6

  // console.log("dayIndex: "+dayIndex)
  // console.log("repeatDays[dayIndex]: "+dayIndex)

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
      // console.log({i, dayIndex})
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

const HabitSettingsModal = forwardRef(({ session, syncLocalWithDb, supabase, taskItems, setTaskItems, habitHistory, setHabitHistory, habitStats, setHabitStats, habitApplyModalRef }, ref) => {

  const bottomSheetRef = useRef(null)
  const durationBoxRef = useRef(null)
  const importanceBoxRef = useRef(null)
  const [settingsMode, setSettingsMode] = useState(TASK_SETTINGS_MODES.INACTIVE)
  const [initialHabitHistoryEntry, setInitialHabitHistoryEntry] = useState()
  const [initialHabitSettings, setInitialHabitSettings] = useState()

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
      isHabit: true,
      repeatDays: initRepeatDays,
      dueDate: endOfDayObj,
      includeOnlyTime: true,
      status: "incomplete",
      repeat_days_edited_date: new Date()
    }
  }

  useImperativeHandle(ref, () => ({

    showAddHabitModal(selectedDate = new Date()) {
      bottomSheetRef?.current?.scrollTo(1)

      const initSettings = getInitSettings(selectedDate)

      dispatch({ type: ACTIONS.UPDATE_ALL, payload: { newTaskSettings: initSettings } })
      durationBoxRef?.current?.setDuration(initSettings.duration)
      importanceBoxRef?.current?.setImportance(initSettings.importance)
      setSettingsMode(TASK_SETTINGS_MODES.ADD_TASK)
    },
    showEditHabitModal(myHabitSettings, habitHistoryEntry) {
      // console.log("habitHistoryEntry")
      // console.log(JSON.stringify(habitHistoryEntry))
      bottomSheetRef?.current?.scrollTo(1)
      scrollViewRef?.current?.scrollTo({
        y: 0,
      })
      dispatch({ type: ACTIONS.UPDATE_ALL, payload: { newTaskSettings: myHabitSettings } })
      durationBoxRef?.current?.setDuration(myHabitSettings.duration)
      importanceBoxRef?.current?.setImportance(myHabitSettings.importance)
      setSettingsMode(TASK_SETTINGS_MODES.EDIT_TASK)

      setInitialHabitSettings(myHabitSettings)
      setInitialHabitHistoryEntry(habitHistoryEntry)
    }
  }));


  useEffect(() => {
    bottomSheetRef?.current?.scrollTo(0)
  }, [])


  const isSevenFalses = (list) => {
    return list.length === 7 && list.every(value => value === false);
  };

  // returns false if there was no error & true if there was
  const validateFields = () => {

    if (habitSettings.title == "") {
      Alert.alert("Title cannot be left blank")
      return true
    }


    if (habitSettings.isHabit && isSevenFalses(habitSettings.repeatDays)) {
      Alert.alert("A repeat day must be selected for habits!")
      return true
    }
  }


  const onConfirmEditsComplete = async (habitSettingsEdited, optionSelected) => {


    console.log(optionSelected)
    // console.log(JSON.stringify(taskSettingsEdited, null, 2 ))

    // 3 functions to make



    // edit habit settings in Tasks table

    // edit ALL habitHistory entries (based on habitId) with correct settings


    // edit specific habitHistory entry (based on id and habit_due_date) with correct settings
    if (optionSelected == "edit_selected_habit") {

      // initialHabitSettings, habitSettingsEdited, initialHabitHistoryEntry, setHabitStats, setHabitHistory, habitHistory
      await editSelectedHabitOn_ConfirmEdit({
        initialHabitSettings, habitSettingsEdited, initialHabitHistoryEntry, setHabitStats,
        setHabitHistory, habitHistory
      })

      // edit habit history entries (with habitId) between current habit_due_date and today's date
      // edit entry in Tasks table (affects future tasks)
    } else if (optionSelected == "edit_selected_and_upcoming") {
      await editSelectedAndUpcoming_OnConfirmEdit({
        session, initialHabitSettings, habitSettingsEdited, initialHabitHistoryEntry, setHabitStats, setHabitHistory,
        habitHistory, setTaskItems, taskItems
      })

      // 1, edit all habitHistory entries with habitId
      // 2. edit correct habit settings in Tasks table
    } else if (optionSelected == "edit_all") {
      await editAll_OnConfirmEdit({
        session, initialHabitSettings, habitSettingsEdited, initialHabitHistoryEntry, setHabitStats, setHabitHistory,
        habitHistory, setTaskItems, taskItems
      })

    } else {
      console.warn("invalid option selected for confirming edits")
    }
  }

  const onSavePress = async () => {

    let error = validateFields()
    if (error) return

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    bottomSheetRef?.current?.scrollTo(0)

    var habitSettingsEdited
    if (settingsMode == TASK_SETTINGS_MODES.ADD_TASK) {

      habitSettingsEdited = { ...habitSettings }
      habitSettingsEdited.description = habitSettingsEdited.description.replace(/^\s+|\s+$/g, '');
      habitSettingsEdited.title = habitSettingsEdited.title.replace(/^\s+|\s+$/g, '');
      dispatch({ type: ACTIONS.UPDATE_ALL, payload: { newTaskSettings: habitSettingsEdited } })
      await onSaveTask(habitSettingsEdited)
    }
    else if (settingsMode == TASK_SETTINGS_MODES.EDIT_TASK) {
      habitSettingsEdited = { ...habitSettings }
      habitSettingsEdited.description = habitSettingsEdited.description.replace(/^\s+|\s+$/g, '');
      habitSettingsEdited.title = habitSettingsEdited.title.replace(/^\s+|\s+$/g, '');
      dispatch({ type: ACTIONS.UPDATE_ALL, payload: { newTaskSettings: habitSettingsEdited } })

      habitApplyModalRef?.current?.showHabitApplyModal(onConfirmEditsComplete, habitSettingsEdited)
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
    await onDelete(habitSettings)
  }

  const onSaveTask = async (newTaskSettings) => {
    await supabaseInsertTask(session, newTaskSettings, setTaskItems, taskItems, habitHistory, setHabitHistory, habitStats, setHabitStats)
  }

  // const onEditTaskComplete = async (taskSettingsEdited) => {
  //   // commented for now
  // }



  const onDelete = async (taskSettingsToDelete) => {
    await supabaseDeleteTask(taskSettingsToDelete.id, taskSettingsToDelete.isHabit, setTaskItems, taskItems, habitHistory, setHabitHistory, setHabitStats)
  }

  let initRepeatDays = Array(7).fill(true)

  const [habitSettings, dispatch] = useReducer(reducer, getInitSettings())
  const scrollViewRef = useRef()

  return (
    <BottomSheet ref={bottomSheetRef} customStyle={styles.addTaskModal} clamps={[0, 0.5, 1]} scrollingEnabled={false}>

      <View style={styles.headingBox}>
        <StyledH2 style={styles.infoText} text={"Habit Settings"} />
        <Plant size={25} weight={"fill"} color={"green"} style={styles.buttonIcon} />
      </View>
      <ScrollView style={[styles.addTaskModalSettings]} ref={scrollViewRef}>
        <TitleBox title={habitSettings.title} dispatch={dispatch} />
        <DurationBox duration={habitSettings.duration} dispatch={dispatch} ref={durationBoxRef} />
        <ImportanceBox importance={habitSettings.importance} dispatch={dispatch} ref={importanceBoxRef} />
        {/* <UseHabitBox dispatch={dispatch} selected={taskSettings.isHabit} repeatDays={taskSettings.repeatDays} dueDate={taskSettings.dueDate} /> */}
        <RepeatBox dispatch={dispatch} repeatDays={habitSettings.repeatDays} isHabit={habitSettings.isHabit} showNote={settingsMode==TASK_SETTINGS_MODES.EDIT_TASK} />
        <DueDatePickerBox dispatch={dispatch} dateTime={habitSettings.dueDate} isHabit={habitSettings.isHabit} />
        <DescriptionBox description={habitSettings.description} dispatch={dispatch} />
      </ScrollView>

      <View style={styles.addTaskModalButtons}>
        <TouchableOpacity onPress={onSavePress}>
          <View style={styles.saveTaskButton}>
            <Text style={[fontStyles.styledH1, styles.buttonText]}>Save</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={onCancelPress}>
          <View style={styles.cancelTaskButton}>
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

export default HabitSettingsModal

const styles = StyleSheet.create({
  headingBox: {
    display: "flex",
    backgroundColor: Color.DarkestBlue,
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
    color: "white",
    alignSelf: "center",
  },
  buttonText: {
    color: "#000"
  },
  saveButtonIcon: {
    marginLeft: 5,
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
    backgroundColor: Color.GrayBlue,
    // paddingHorizontal: 30,
  },

})