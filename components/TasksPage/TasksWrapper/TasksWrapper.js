import React from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView, } from 'react-native';
import Task from './Task';
import {StyledH2, fontStyles} from '../../text/StyledText';
import { useFonts } from 'expo-font'
import { supabase } from '../../../lib/supabase'
import { onlyDatesAreSame } from '../../../utils/DateHelper';
import TaskMenu from './TaskMenu';
import { supabaseUpdateTaskSettings, supabaseUpdateHabitHistoryEntry } from '../TasksPageSupabase';


const TasksWrapper = ({session, taskMenuRef, taskSettingsRef, selectedDate, taskItems, setTaskItems, dateText, habitHistory, setHabitHistory, habitStats, setHabitStats}) => {

const onCheckBoxPressed = async (taskId, isHabit, habitHistoryEntry, status) => {

  console.log(status)

  if (!isHabit) {

    await supabaseUpdateTaskSettings(session, {"status" : status}, taskId, setTaskItems, taskItems, setHabitStats, habitHistory);

    // // local changes
    // const taskItemsCopy = [...taskItems]
    // const indexToChange = taskItemsCopy.findIndex(x => x.id === taskId);
    // console.log("old state: "+taskItemsCopy[indexToChange]["status"])
    // taskItemsCopy[indexToChange]["status"] = status
    // console.log("new state: "+status)
    // setTaskItems(taskItemsCopy)

    // // db changes
    // const { error } = await supabase
    // .from('Tasks')
    // .update({status: status})
    // .eq('id', taskId)

    // if (error) console.log(error)
  }
  else {
    await supabaseUpdateHabitHistoryEntry({"status" : status}, taskId, habitHistory, setHabitHistory, habitHistoryEntry.habit_due_date, setHabitStats)
      // TODO: CALL SUPABSE FUNCTION TO UPDATE HABIT HISTORY ENTRY

      // // local changes
      // const habitHistoryCopy = {...habitHistory}
      // for (const entry of habitHistoryCopy[taskId]) {
      //   if (onlyDatesAreSame(entry.habit_due_date, habitHistoryEntry.habit_due_date)) {
      //     entry["status"] = status
      //   } 
      // }
      // setHabitHistory(habitHistoryCopy)

      // // db changes
      // const { error } = await supabase
      // .from('HabitHistory')
      // .update({status: status})
      // .eq('id', taskId)
      // .eq('habit_due_date', habitHistoryEntry.habit_due_date)

      // if (error) console.warn(error)

  } 

}

const onEditTask = (taskSettings) => {
  taskSettingsRef?.current?.showEditTaskModal(taskSettings)
}

const onTaskClicked = (taskSettings, habitHistoryEntry) => {
  console.log("task clicked")
  taskMenuRef?.current?.showTaskMenuModal(taskSettings, habitHistoryEntry, onEditTask, onCheckBoxPressed)
}

function SelectedDayTasks() {
    /**
     * todays tasks includes tasks that are due between the start and end of the selected date
     */

    var endOfDayObj = new Date(selectedDate.getFullYear(),selectedDate.getMonth(),selectedDate.getDate(),23,59,59);
    var startOfDayObj = new Date(selectedDate.getFullYear(),selectedDate.getMonth(),selectedDate.getDate(),0,0,0);

    let count = 0

    let entryFound = false
    // code to count how many tasks/habits to display (that meet the conditions)
    for (const task of taskItems) {

      if (!task.isHabit){
        var dueDateObj = new Date(task["dueDate"])
        if (endOfDayObj >= dueDateObj && dueDateObj >= startOfDayObj) {
          count += 1 
        }
      }
      // }
    }
    // return if there's no tasks to display
    if (count == 0) {
      return
    }


    return (
      <View>
        {/* <StyledH2 style={styles.sectionTitle} text={"Tasks"}/> */}
        {/* <StyledH2 style={styles.sectionTitle} text={dateText+"'s Tasks"}/> */}
        <View style={styles.items}>
        {
          taskItems.map((task, index) => {
            var dueDateObj = new Date(task.dueDate)
            var habitHistoryEntry = undefined
            let habitEntryFound = false
            // let isSelected = task.complete

            if (!task.isHabit && endOfDayObj >= dueDateObj && dueDateObj >= startOfDayObj) {
              return (
                <TouchableOpacity key={index}  onPress={() => {onTaskClicked(task, undefined)}}>
                  <Task 
                  habitStatsEntry={habitStats[task.id]}
                  selectedDate={selectedDate}
                  habitHistoryEntry={habitHistoryEntry}
                  habitHistory={task.habitHistory}
                  habitInitDate={task.habitInitDate}
                  isHabit={task.isHabit}
                  repeatDays={task.repeatDays}
                  dueDate={task.dueDate}
                  showDueTime={true}
                  taskId={task.id}
                  onChange={onCheckBoxPressed}
                  // isSelected={isSelected}
                  text={task.title}
                  priority={task.importance}
                  duration={task.duration}
                  description={task.description}
                  status={task.status}
                  points={parseFloat(task.importance)+parseFloat(task.duration)}/> 
                </TouchableOpacity>
              )
            }
          })
        }
      </View>
    </View>
    )
  }


  function SelectedDayHabits() {
    /**
     * todays tasks includes tasks that are due between the start and end of the selected date
     */

    var endOfDayObj = new Date(selectedDate.getFullYear() ,selectedDate.getMonth() ,selectedDate.getDate(),23,59,59);
    var startOfDayObj = new Date(selectedDate.getFullYear(),selectedDate.getMonth(),selectedDate.getDate(),0,0,0);
    let count = 0

    let entryFound = false
    // code to count how many tasks/habits to display (that meet the conditions)
    for (const task of taskItems) {

      if (task.isHabit && habitHistory[task.id] != undefined) {
        for (const entry of habitHistory[task.id]) {
          if (onlyDatesAreSame(new Date(entry.habit_due_date), endOfDayObj )) {
            count += 1
          }
        }
      }
      // }
    }
    // return if there's no habits to display
    if (count == 0) {
      return
    }


    return (
      <View>
        <StyledH2 style={styles.sectionTitle} text={"Habits"}/>
        {/* <StyledH2 style={styles.sectionTitle} text={dateText+"'s Tasks"}/> */}
        <View style={styles.items}>
        {
          taskItems.map((task, index) => {
            var dueDateObj = new Date(task.dueDate)
            var habitHistoryEntry = undefined
            let habitEntryFound = false
            // let isSelected = task.complete

            if (task.isHabit && habitHistory[task.id] != undefined) {
              for (const entry of habitHistory[task.id]) {
                if (onlyDatesAreSame(new Date(entry.habit_due_date), endOfDayObj )) {
                  habitEntryFound = true
                  count += 1
                  habitHistoryEntry = entry
                  // if (entry.status == "complete") {
                  //   isSelected = true
                  // } else {
                  //   isSelected = false
                  // }
                  break
                }
              }
            }


            if (task.isHabit && habitEntryFound) {
              return (
                <TouchableOpacity key={index}  onPress={() => {onTaskClicked(task, habitHistoryEntry)}}>
                  <Task 
                  habitStatsEntry={habitStats[task.id]}
                  selectedDate={selectedDate}
                  habitHistoryEntry={habitHistoryEntry}
                  habitHistory={task.habitHistory}
                  habitInitDate={task.habitInitDate}
                  isHabit={task.isHabit}
                  repeatDays={task.repeatDays}
                  dueDate={task.dueDate}
                  showDueTime={true}
                  taskId={task.id}
                  onChange={onCheckBoxPressed}
                  // isSelected={isSelected}
                  text={task.title}
                  priority={task.importance}
                  duration={task.duration}
                  description={task.description}
                  status={habitHistoryEntry.status} // habitHistoryEntry.status instead of task.status because task is of type habit!!!
                  points={parseFloat(task.importance)+parseFloat(task.duration)}/> 
                </TouchableOpacity>
              )
            }
          })
        }
      </View>
    </View>
    )
  }

  // NOTE: this does not render any habits
  function DueLaterTasks() {
    /**
     * Due later tasks include tasks that are incomplete and are due after the end of the selected date
     * displays ONLY if selected date is today
     */

    // if selected date is not today, return nothing
    var todaysDate = new Date()
    if (selectedDate.toDateString() != todaysDate.toDateString()) {
      return <View></View>
    }

    var endOfDayObj = new Date(selectedDate.getFullYear()
    ,selectedDate.getMonth()
    ,selectedDate.getDate()
    ,23,59,59);




    // code to count how many tasks to display (that meet the conditions)
    let count = 0
    for (const task of taskItems) {
      var dueDateObj = new Date(task["dueDate"])
      if (endOfDayObj < dueDateObj && task.complete == false) {
        count += 1 
      }
    }
    // return if there's no tasks to display
    if (count == 0) {
      return
    }

    return (
      <View>
        <StyledH2 style={styles.sectionTitle} text={"Due Later"}/>
        <View style={styles.items}>
        {
          taskItems.map((task, index) => {

          var dueDateObj = new Date(task["dueDate"])

          // due after end of day
          if (endOfDayObj < dueDateObj && task.complete == false && task.isHabit == false) {
            return (
              <TouchableOpacity key={index}  onPress={() => {onTaskClicked(task, undefined)}}>
                <Task
                selectedDate={selectedDate}
                habitHistory={task.habitHistory}
                habitInitDate={task.habitInitDate}
                dueDate={task.dueDate}
                repeatDays={task.repeatDays}
                showDueDate={true}
                taskId={task.id}
                onChange={onCheckBoxPressed}
                complete={task.complete}
                text={task.title}
                priority={task.importance}
                duration={task.duration}
                description={task.description}
                status={task.status}
                points={parseFloat(task.importance)+parseFloat(task.duration)}/> 
              </TouchableOpacity>
            )
          }
        })}
        </View>
      </View>
  )}


  // NOTE: this does not render any habits
  function OverdueTasks() {
    /**
     * Due later tasks include tasks that are:
     * 1. incomplete
     * 2. are due after the end of the selected date
     * 3. are not habits
     * displays ONLY if selected date is today
     */

    // if selected date is not today, return nothing
    var todaysDate = new Date()
    if (selectedDate.toDateString() != todaysDate.toDateString()) {
      return <View></View>
    }

    var startOfDayObj = new Date(selectedDate.getFullYear()
    ,selectedDate.getMonth()
    ,selectedDate.getDate()
    ,0,0,0);


    // code to count how many tasks to display (that meet the conditions)
    let count = 0
    for (const task of taskItems) {
      var dueDateObj = new Date(task["dueDate"])
      if (startOfDayObj > dueDateObj && task.status == "incomplete" && task.isHabit == false) {
        count += 1 
      }
    }
    // return if there's no tasks to display
    if (count == 0) {
      return
    }

    return (
      <View>
        {/* <StyledH2 style={styles.sectionTitle} text={"Overdue"}/> */}
        <View style={styles.items}>
        {
          taskItems.map((task, index) => {

          var dueDateObj = new Date(task["dueDate"])

          // due before the start of selected date and incomplete
          if (startOfDayObj > dueDateObj && task.status == "incomplete" && task.isHabit == false) {
            return (
              <TouchableOpacity key={index}  onPress={() => {onTaskClicked(task, undefined)}}>
                <Task
                isOverdue={true}
                selectedDate={selectedDate}
                habitHistory={task.habitHistory}
                habitInitDate={task.habitInitDate}
                dueDate={task.dueDate}
                repeatDays={task.repeatDays}
                showDueDate={true}
                taskId={task.id}
                onChange={onCheckBoxPressed}
                complete={task.complete}
                text={task.title}
                priority={task.importance}
                duration={task.duration}
                description={task.description}
                status={task.status}
                points={parseFloat(task.importance)+parseFloat(task.duration)}/> 
              </TouchableOpacity>
            )
          }
        })}
        </View>
      </View>
  )}






// TASKS WRAPPER


  var [fontsLoaded] = useFonts({
    "MPlusRegular": require("./../../../assets/fonts/mplusRegular.ttf"),
    "MPlusMedium": require("./../../../assets/fonts/mplusMedium.ttf")
  })


  if (!fontsLoaded) {
    return null
  }



  return (

	<ScrollView
	contentContainerStyle={{
	  flexGrow: 1,
    paddingBottom: 20,
	}}
	keyboardShouldPersistTaps='handled'
   style={styles.taskWrapperContainer}>

  <View style={styles.tasksWrapper}>
	<SelectedDayTasks />
	<OverdueTasks />
  <SelectedDayHabits />
	<DueLaterTasks />
  </View>

	
  </ScrollView>
  )
}

export default TasksWrapper

const styles = StyleSheet.create({
	tasksWrapper: {
		paddingHorizontal: 20,
	  },
    sectionTitle: {
      marginVertical: 5,
    }
})