import React, {useState, useRef, useCallback,  forwardRef, useImperativeHandle, useEffect, useReducer } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Modal, Button } from 'react-native';
import { useFonts } from 'expo-font'
import TitleBox from './TitleBox';
import DurationBox from './DurationBox'
import ImportanceBox from './ImportanceBox';
import DescriptionBox from './DescriptionBox';
import UseHabitBox from './UseHabitBox';
import RepeatBox from './RepeatBox';
import DueDatePickerBox from './DueDatePickerBox';
import { Trash, XCircle, CheckCircle} from 'phosphor-react-native';
import * as Haptics from "expo-haptics"
// import { ACTIONS, TASK_SETTINGS_MODES } from '../../utils/MyGlobalVars';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import BottomSheet from '../../FormComponents/BottomSheet';
import { ACTIONS, TASK_SETTINGS_MODES } from '../../../utils/Actions_TaskSettingsModal';
import {StyledH1, StyledH2, StyledH3, StyledH4, fontStyles} from '../../text/StyledText';
import Color from '../../../assets/themes/Color'
import { getDateFromDatetime, onlyDatesAreSame } from '../../../utils/DateHelper';
// import { supabase } from '../../../lib/supabase'

// finds the next due date after "initialDate" based on repeatDays
const findHabitNextDueDate = (initialDate, repeatDays, dueTime) => {
  // const todaysDate = new Date()
  var dayIndex = initialDate.getDay()-1
  var daysAfterToday = 0
  if (dayIndex == -1) dayIndex = 6 

  // console.log("dayIndex: "+dayIndex)
  // console.log("repeatDays[dayIndex]: "+dayIndex)

  // find the next day where repeatDays[dayIndex] == true
  if ( repeatDays[dayIndex] == false ) {
    var i = dayIndex+1
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
      // console.log("no repeatDays was selected!")
      return null
    }
  }

  // this isn't working properly. FIX. TODO
  // console.log({daysAfterToday})

  const dueDate = new Date(initialDate.getFullYear(), initialDate.getMonth(), initialDate.getDate()+daysAfterToday, dueTime.getHours(), dueTime.getMinutes(), dueTime.getSeconds())

  // console.log(dueDate.toLocaleString())
  return dueDate

}






const initHabitHistory = (repeatDays, dueTime) => {
  var dueDate = findHabitNextDueDate(new Date(), repeatDays, dueTime)
  if (dueDate == null) return []
  return [{exactDueDate: dueDate, status: "pending",}]
}

function reducer(taskSettings, action) {
  switch (action.type) {
    case "update_title":
      // console.log(action.payload.title)
      return {...taskSettings, title: action.payload.title}
    case "update_duration":
      // console.log("update_duration: "+action.payload.duration)
      // console.log("update_duration payload: "+JSON.stringify(action.payload))
      return {...taskSettings, duration: action.payload.duration}
    case "update_importance":
      // console.log(action.payload.importance)
      return {...taskSettings, importance: action.payload.importance}
    case "update_description":
      // console.log(action.payload.description)
      return {...taskSettings, description: action.payload.description}
    case "update_isHabit":
      // console.log(action.payload.isHabit)
      if (action.payload.isHabit == true) {
        var habitHistory = initHabitHistory(action.payload.repeatDays, action.payload.dueDate)
        // console.log("=============================")
        // console.log("habitHistory: "+JSON.stringify(habitHistory))
        // console.log("=============================")
      }
      return {...taskSettings, isHabit: action.payload.isHabit, habitHistory: habitHistory, habitInitDate : new Date()}
    // case "update_repeatDays":
    //   // console.log(action.payload.repeatDays)
    //   if (action.payload.isHabit == true) {
    //     var habitHistory = updateHistoryWithRepeatDays(action.payload.repeatDays, action.payload.habitHistory)
    //     console.log("=============================")
    //     console.log("habitHistory: "+JSON.stringify(habitHistory))
    //     console.log("=============================")
    //   }
      
    //   return {...taskSettings, repeatDays: action.payload.repeatDays}
    case "single_update_repeatDays":
      // console.log(action.payload.dayInt, action.payload.selected)
      const newRepeatDays = taskSettings.repeatDays
      newRepeatDays[action.payload.dayInt] = action.payload.selected

      //  TODO: IMPLEMENT FUNCTION
      if (action.payload.isHabit == true) {
        var habitHistory = updateHistoryWithRepeatDays(action.payload.repeatDays, action.payload.dueDate)
        // console.log("=============================")
        // console.log("habitHistory: "+JSON.stringify(habitHistory))
        // console.log("=============================")
      }

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

const TaskSettingsModal = forwardRef (({session, syncLocalWithDb, supabase}, ref) => {

  useImperativeHandle(ref, () => ({

    showAddTaskModal () {
      const todaysDate = new Date();
      var endOfDayObj = new Date(todaysDate.getFullYear()
      ,todaysDate.getMonth()
      ,todaysDate.getDate()
      ,23,59,59);

      bottomSheetRef?.current?.scrollTo(1)
      const initSettings = {created_at: new Date(), title: "", habitHistory: null, habitInitDate: null, duration: 0.5, importance: 5, description: "", isHabit: false, repeatDays: initRepeatDays, dueDate: endOfDayObj, includeOnlyTime: false, id: uuidv4()}
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
      onSaveTask(settingsCopy)
    }
    else if (settingsMode == TASK_SETTINGS_MODES.EDIT_TASK) {
      settingsCopy = {...taskSettings}
      settingsCopy.description = settingsCopy.description.replace(/^\s+|\s+$/g, '');
      settingsCopy.title = settingsCopy.title.replace(/^\s+|\s+$/g, '');
      dispatch({type: ACTIONS.UPDATE_ALL, payload: {newTaskSettings: settingsCopy}})
      onEditTaskComplete(settingsCopy)
    }


	  }
  const onCancelPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    bottomSheetRef?.current?.scrollTo(0)
    // console.log("hiii")
  }
  const onDeletePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    bottomSheetRef?.current?.scrollTo(0)
    onDelete(taskSettings)
  }


  // returns entry where due date matches
  const findEntryWithDate = (habitHistoryEntries, myDate) => {
    for (let entry of habitHistoryEntries) {
      // found a match, return entry
      if (onlyDatesAreSame( new Date(entry["habit_due_date"]), myDate)) {
        return entry;
      }
    }
    // No match found
    return -1;

  }


  // call this function when: habit is added and when page loads
  const updateHabitHistoryAll = async () => {
    const { data, error } = await supabase
    .from('Tasks')
    .select()
    .eq('isHabit', true)
    .order('created_at', { ascending: true })

    for (var habitSettings of data) {
      updateHistoryForSingleHabit(habitSettings, habitSettings["id"])
    }
    // }
  }


  // basic logic

  // habit added on 1/1/24 and is valid for wednesday and thursday. assume 1/1/24 is a monday
  // assume today is wednesday

  // updateHistoryForSingleHabit(habitSettings):

  // from supabase, get habit histories for a particular habit

  // loop between habit creation date and today's date:
  //     if day is valid:  
  //         if entry does not exist already for this date:
  //             add entry ("pending" if it is today's date and "incomplete" if it is old date)
  //         if entry does exist for this date & is "pending" & selected date is today & habit_due_date != today:
  //             change from "pending" to "incomplete"

  
  const updateHistoryForSingleHabit = async (habitSettings, habitId) => {
    console.log("===============================")

    // get list of entries for specific habit
    const { data, error } = await supabase
      .from('HabitHistory')
      .select()
      .eq('id', habitId)
      .order('created_at', { ascending: true })
    
    const habitHistoryEntries = data

    // create a list of dates between habit's creation date and today that are all valid dates for the habit
    const now = getDateFromDatetime(new Date())
    var dayAfterNow = new Date(now)
    dayAfterNow.setDate(dayAfterNow.getDate() + 1)

    var daysToCheck = [];
    const start_date = getDateFromDatetime(new Date(habitSettings["created_at"]))
    for (var d = start_date; d < dayAfterNow; d.setDate(d.getDate() + 1)) {
      if (habitSettings["repeatDays"][(d.getDay() + 6) % 7] == true) daysToCheck.push(new Date(d));
    }
    console.log({daysToCheck, "id" : habitSettings["id"]})



    for (var i = 0; i < daysToCheck.length; i += 1) {
      const selectedDate = daysToCheck[i]
      const selectedEntry = findEntryWithDate(habitHistoryEntries, selectedDate)


      // if entry with selected date does not exist, add entry
      if (selectedEntry == -1) {
        var status
        if (onlyDatesAreSame(selectedDate, now)) {
          status = "pending"
        } else {
          status = "incomplete"
        }

        const other = new Date(habitSettings["dueDate"])
        const habit_due_date =  new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(),
        other.getHours(), other.getMinutes(), other.getSeconds(), other.getMilliseconds())

        const newEntry = {
          "habit_due_date" : habit_due_date,
          "status" : status,
          "is_streak" : false, // not sure if an is_streak column is even needed!
          "id" : habitId,
        }

        const { error } = await supabase
        .from('HabitHistory')
        .insert(newEntry)
        if (error) {
          console.warn("error during insertion: ")
          console.warn(error)
          console.log({selectedDate, "id" : habitSettings["id"]})
        }
      }

      // if entry does exist for this date (given bcuz else if)
      else if (selectedEntry["status"] == "pending" // & is "pending"
        && !(onlyDatesAreSame(new Date(selectedEntry["habit_due_date"]), now)) // & habit_due_date != today:
        ){

        // update entry

        const { error } = await supabase
        .from('HabitHistory')
        .update({status : "incomplete"})
        .match({id: selectedEntry["id"], habit_due_date: selectedEntry["habit_due_date"]})

        if (error) {
          consolee.warn("error during update: ")
          console.log({selectedDate, "id" : habitSettings["id"]})
        }
      
      }
    // console.log(onlyDatesAreSame(now, selectedEntry["created_at"]))

      // if entry with selected date exists but is valid
      // do nothing
    }


    // console.log({daysToCheck})
    console.log("===============================")
  }

  const onSaveTask = async (newTaskSettings) => {
    // console.log("onSaveTask!!!")
    // make data ready for inserting into db
    let taskSettingsCopy = {...newTaskSettings} 
    taskSettingsCopy["dueDate"] = newTaskSettings["dueDate"].toISOString()
    taskSettingsCopy["email"] = session.user.email
    const taskId = taskSettingsCopy["id"]
    delete taskSettingsCopy["id"]
  
    // convert habit history dates to ISO string 
  
    if (taskSettingsCopy["habitHistory"] != null) {
      const newhabitHistory = []
      for (const entry of taskSettingsCopy["habitHistory"]) {
        newhabitHistory.push({...entry, exactDueDate: entry["exactDueDate"].toISOString()})
      }
      taskSettingsCopy["habitHistory"] = newhabitHistory
    }




    // console.log((await supabase.auth.getUser()).data.user.email)
  
    // console.log("sheeeeeeeeesh")
    // insert into db
    const { data, error } = await supabase
    .from('Tasks')
    .insert(taskSettingsCopy)
    .select().single()


    if (taskSettingsCopy["isHabit"]) {


      //  && taskSettingsCopy["repeatDays"][now.getDay()]
      // check if habit is valid for current day

      // const habitHistoryEntry = {
      //   "habit_due_date" : taskSettingsCopy["dueDate"],
      // } 
      

      // const { data, error } = await supabase
      // .from('HabitHistory')
      // .insert(habitHistoryEntry)
      // .select()

      // console.log({"yooo" : taskSettingsCopy})      

      // updateHabitHistoryEntry(newTaskSettings, data["id"])

      await updateHabitHistoryAll();
    }

    // console.log("done inserting task brooo")
  
    if (error) console.log(error)
  
    // console.log("await syncLocalWithDb()")
    await syncLocalWithDb()
  }
  
  const onEditTaskComplete = async (taskSettingsEdited) => {
  
    const idToEdit = taskSettingsEdited["id"]
  
    let taskSettingsCopy = {...taskSettingsEdited} 
    taskSettingsCopy["dueDate"] = taskSettingsEdited["dueDate"].toISOString()
    taskSettingsCopy["email"] = session.user.email
    delete taskSettingsCopy["id"]


    // console.log(taskSettingsCopy["isHabit"])
    if (taskSettingsCopy["isHabit"]) {

      // if task is a habit, then add an entry in habit history:
      // created_at
      // habit_due_date
      // status
      // is_streak
    }

    // convert habit history dates to ISO string 
    if (taskSettingsCopy["habitHistory"] != null) {
      const newhabitHistory = []
      for (const entry of taskSettingsCopy["habitHistory"]) {
        newhabitHistory.push({...entry, exactDueDate: entry["exactDueDate"].toISOString()})
      }
      taskSettingsCopy["habitHistory"] = newhabitHistory
    }
  
    // update into db
    const { error } = await supabase
    .from('Tasks')
    .update(taskSettingsCopy)
    .eq('id', idToEdit)
  
    if (error) console.warn(error)
  
    await syncLocalWithDb()
  
    // const oldTask = taskItems.find(x => x.id == taskSettingsEdited.id)
  
    // let taskItemsCopy = [...taskItems]
    // const index = taskItemsCopy.indexOf(oldTask)
    // if (index == -1) {
    //   console.error("App.js: onEditTaskComplete: unable to edit task since task is not found in array state")
    // }
    // taskItemsCopy[index] = taskSettingsEdited //replace 1st occurance of this task
    // setTaskItems(taskItemsCopy)
    // console.log("edited")
  }
  
  const onDelete = async (taskSettingsToDelete) => {
  
    const { error } = await supabase
    .from('Tasks')
    .delete()
    .eq('id', taskSettingsToDelete.id)
  
    if (error) {
      console.warn(error)
    }
  
    await syncLocalWithDb()
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
		  <UseHabitBox dispatch={dispatch} selected={taskSettings.isHabit} repeatDays={taskSettings.repeatDays} dueDate={taskSettings.dueDate}/>
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
    marginBottom: 95,
    zIndex: 20,
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