import React from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView, } from 'react-native';
import Task from './Task';
import {StyledH2, fontStyles} from '../../text/StyledText';
import { useFonts } from 'expo-font'
import { supabase } from '../../../lib/supabase'
import { getEndOfDay, onlyDatesAreSame } from '../../../utils/DateHelper';
import TaskMenu from './TaskMenu';
import { supabaseUpdateTaskSettings, supabaseUpdateHabitHistoryEntry } from '../TasksPageSupabase';


const TasksWrapper = ({session, taskMenuRef, taskSettingsRef, habitSettingsRef, selectedDate, taskItems, setTaskItems, dateText, habitHistory, setHabitHistory, habitStats, setHabitStats}) => {

const onCheckBoxPressed = async (taskId, isHabit, habitHistoryEntry, status) => {
  if (!isHabit) {
    await supabaseUpdateTaskSettings(session, {"status" : status}, taskId, setTaskItems, taskItems, setHabitStats, habitHistory);
  }
  else {
    await supabaseUpdateHabitHistoryEntry({"status" : status}, taskId, habitHistory, setHabitHistory, habitHistoryEntry.habit_due_date, setHabitStats)
  } 
}

const onEditTask = (taskSettings, habitHistoryEntry=undefined) => {
  if (taskSettings.isHabit) {
    habitSettingsRef?.current?.showEditHabitModal(taskSettings, habitHistoryEntry)
  } else {
    taskSettingsRef?.current?.showEditTaskModal(taskSettings)
  }
}

const onTaskClicked = (taskSettings, habitHistoryEntry) => {
  // console.log("task clicked")
  console.log("==================================")
  console.log(taskSettings.id)
  console.log("importance: "+taskSettings.importance)
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
                  break
                }
              }
            }



            if (task.isHabit && habitEntryFound) {
            // this is simply to ensure backward compatibility (for habit entires that have not been updated to the new format)


            // copy task properties to habit variable, but override columns where title, importance,
            // duration, or description are null
            // pass habit variable into respective functions
            let habit = {...task}
            if (habitHistoryEntry.title != null) habit.title = habitHistoryEntry.title
            if (habitHistoryEntry.importance != null) habit.importance = habitHistoryEntry.importance
            if (habitHistoryEntry.duration != null) habit.duration = habitHistoryEntry.duration
            if (habitHistoryEntry.description != null) habit.description = habitHistoryEntry.description

              return (
                <TouchableOpacity key={index}  onPress={() => {onTaskClicked(habit, habitHistoryEntry)}}>
                  <Task 
                  habitStatsEntry={habitStats[habit.id]}
                  selectedDate={selectedDate}
                  habitHistory={habit.habitHistory} // note that this is outdated and should be removed later
                  habitInitDate={habit.habitInitDate} // 
                  isHabit={habit.isHabit}
                  repeatDays={habit.repeatDays}
                  dueDate={habit.dueDate}
                  showDueTime={true}
                  taskId={habit.id}
                  onChange={onCheckBoxPressed}
                  // work in progress:
                  points={parseFloat(habit.importance)+parseFloat(habit.duration)}
                  // note that the following depend on habitHistoryEntry, NOT the original task that is created
                  text={habit.title}
                  priority={habit.importance}
                  duration={habit.duration}
                  description={habit.description}
                  status={habitHistoryEntry.status}
                  dueTimeOverride={habitHistoryEntry.dueTimeOverride}
                  habitHistoryEntry={habitHistoryEntry}
                  /> 
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
    // console.log(selectedDate.toDateString()+"; "+todaysDate.toDateString())
    if (selectedDate.toDateString() != todaysDate.toDateString()) {
      return <View></View>
    }
    // else {
    //   console.log("yay")
    // }

    var endOfDayObj = getEndOfDay(selectedDate)




    // code to count how many tasks to display (that meet the conditions)
    let count = 0
    for (const task of taskItems) {
      var dueDateObj = new Date(task["dueDate"])
      if (endOfDayObj < dueDateObj && task.isHabit == false) {
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

          var dueDateObj = new Date(task.dueDate)
          var habitHistoryEntry = undefined
          let habitEntryFound = false

          // due after end of day
          if (endOfDayObj < dueDateObj && task.isHabit == false) {
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
                  showDueDate={true}
                  taskId={task.id}
                  onChange={onCheckBoxPressed}
                  // isSelected={isSelected}
                  text={task.title}
                  priority={task.importance}
                  duration={task.duration}
                  description={task.description}
                  status={task.status}
                  points={parseFloat(task.importance)+parseFloat(task.duration)}/>                 


                {/* <Task
                selectedDate={selectedDate}
                habitHistory={task.habitHistory}
                habitInitDate={task.habitInitDate}
                dueDate={task.dueDate}
                repeatDays={task.repeatDays}
                showDueDate={true}
                taskId={task.id}
                onChange={onCheckBoxPressed}
                // complete={task.complete}
                text={task.title}
                priority={task.importance}
                duration={task.duration}
                description={task.description}
                status={task.status}
                points={parseFloat(task.importance)+parseFloat(task.duration)}/>  */}
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
                // complete={task.complete}
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