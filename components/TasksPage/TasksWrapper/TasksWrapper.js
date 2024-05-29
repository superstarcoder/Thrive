import React from 'react';
import {StyleSheet, View, TouchableOpacity, ScrollView, } from 'react-native';
import Task from './Task';
import {StyledH2, fontStyles} from '../../text/StyledText';
import { useFonts } from 'expo-font'
import { supabase } from '../../../lib/supabase'
import { onlyDatesAreSame } from '../../../utils/DateHelper';


const TasksWrapper = ({taskSettingsRef, selectedDate, taskItems, setTaskItems, dateText, habitHistory, setHabitHistory}) => {

const onComplete = async (newComplete, taskId) => {

  // local changes
  const taskItemsCopy = [...taskItems]
  const indexToChange = taskItemsCopy.findIndex(x => x.id === taskId);
  taskItemsCopy[indexToChange]["complete"] = newComplete
  setTaskItems(taskItemsCopy)

  // db changes
  const { error } = await supabase
  .from('Tasks')
  .update({complete: newComplete})
  .eq('id', taskId)

  if (error) console.log(error)

}

const onEditTask = (taskSettings) => {
  taskSettingsRef?.current?.showEditTaskModal(taskSettings)
}

function TodaysTasks() {
    /**
     * todays tasks includes tasks that are due between the start and end of the selected date
     */

    var endOfDayObj = new Date(selectedDate.getFullYear()
    ,selectedDate.getMonth()
    ,selectedDate.getDate()
    ,23,59,59);

    var startOfDayObj = new Date(selectedDate.getFullYear()
    ,selectedDate.getMonth()
    ,selectedDate.getDate()
    ,0,0,0);

    let count = 0






    // code to count how many tasks/habits to display (that meet the conditions)
    for (const task of taskItems) {

      if (task.isHabit && habitHistory[task.id] != undefined) {
        for (const entry of habitHistory[task.id]) {
          if (onlyDatesAreSame(new Date(entry.habit_due_date), endOfDayObj )) {
            habitEntryFound = true
            count += 1
          }
        }
      } else if (!task.isHabit){
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
        {/* <StyledH2 style={styles.sectionTitle} text={dateText+"'s Tasks"}/> */}
        <View style={styles.items}>
        {
          taskItems.map((task, index) => {
            var dueDateObj = new Date(task.dueDate)
            var habitHistoryEntry = undefined
            // var found = endOfDayObj >= dueDateObj && dueDateObj >= startOfDayObj
            let habitEntryFound = false

            if (task.isHabit && habitHistory[task.id] != undefined) {
              for (const entry of habitHistory[task.id]) {
                if (onlyDatesAreSame(new Date(entry.habit_due_date), endOfDayObj )) {
                  habitEntryFound = true
                  count += 1
                }
              }
            }




            if ((task.isHabit && habitEntryFound) || (!task.isHabit && endOfDayObj >= dueDateObj && dueDateObj >= startOfDayObj)) {
              return (
                <TouchableOpacity key={index}  onPress={() => {onEditTask(task)}}>
                  <Task selectedDate={selectedDate} habitHistoryEntry={habitHistoryEntry} habitHistory={task.habitHistory} habitInitDate={task.habitInitDate} isHabit={task.isHabit} repeatDays={task.repeatDays} dueDate={task.dueDate} showDueTime={true} taskId={task.id} onComplete={onComplete} complete={task.complete} text={task.title} priority={task.importance} duration={task.duration} description={task.description} points={parseFloat(task.importance)+parseFloat(task.duration)}/> 
                </TouchableOpacity>
              )
            }
          })
        }
      </View>
    </View>
    )
  }

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
              <TouchableOpacity key={index}  onPress={() => {onEditTask(task)}}>
                <Task selectedDate={selectedDate} habitHistory={task.habitHistory} habitInitDate={task.habitInitDate} dueDate={task.dueDate} repeatDays={task.repeatDays} showDueDate={true} taskId={task.id} onComplete={onComplete} complete={task.complete} text={task.title} priority={task.importance} duration={task.duration} description={task.description} points={parseFloat(task.importance)+parseFloat(task.duration)}/> 
              </TouchableOpacity>
            )
          }
        })}
        </View>
      </View>
  )}


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
      if (startOfDayObj > dueDateObj && task.complete == false && task.isHabit == false) {
        count += 1 
      }
    }
    // return if there's no tasks to display
    if (count == 0) {
      return
    }

    return (
      <View>
        <StyledH2 style={styles.sectionTitle} text={"Overdue"}/>
        <View style={styles.items}>
        {
          taskItems.map((task, index) => {

          var dueDateObj = new Date(task["dueDate"])

          // due before the start of selected date and incomplete
          if (startOfDayObj > dueDateObj && task.complete == false && task.isHabit == false) {
            return (
              <TouchableOpacity key={index}  onPress={() => {onEditTask(task)}}>
                <Task selectedDate={selectedDate} habitHistory={task.habitHistory} habitInitDate={task.habitInitDate} dueDate={task.dueDate} repeatDays={task.repeatDays} showDueDate={true} taskId={task.id} onComplete={onComplete} complete={task.complete} text={task.title} priority={task.importance} duration={task.duration} description={task.description} points={parseFloat(task.importance)+parseFloat(task.duration)}/> 
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
	<OverdueTasks />
	<TodaysTasks />
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
      

    }
})