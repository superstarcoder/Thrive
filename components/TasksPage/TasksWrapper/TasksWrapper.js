import React from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, FlatList, } from 'react-native';
import Task from './Task';
import { StyledH1, StyledH2, StyledH4, fontStyles } from '../../text/StyledText';
import { useFonts } from 'expo-font'
import { supabase } from '../../../lib/supabase'
import { getEndOfDay, getStartOfDay, getTimeFromDatetime, onlyDatesAreSame, toDateOnly } from '../../../utils/DateHelper';
import TaskMenu from './TaskMenu';
import { supabaseUpdateTaskSettings, supabaseUpdateHabitHistoryEntry } from '../TasksPageSupabase';
import Color from '../../../assets/themes/Color';


const TasksWrapper = ({
  session,
  taskMenuRef,
  taskSettingsRef,
  habitSettingsRef,
  selectedDate,
  taskItems,
  setTaskItems,
  dateText,
  habitHistory,
  setHabitHistory,
  habitStats,
  setHabitStats,
  viewMode,
  sortModeJournalView,
  sortModeAllTasksView
}) => {

  const onCheckBoxPressed = async (taskId, isHabit, habitHistoryEntry, status) => {
    console.log(habitHistoryEntry)
    if (!isHabit) {
      await supabaseUpdateTaskSettings(session, { "status": status }, taskId, setTaskItems, taskItems, setHabitStats, habitHistory);
    }
    else {
      await supabaseUpdateHabitHistoryEntry({ "status": status }, taskId, habitHistory, setHabitHistory, habitHistoryEntry.habit_due_date, setHabitStats)
    }
  }

  const onEditTask = (taskSettings, habitHistoryEntry = undefined) => {
    if (taskSettings.isHabit) {
      habitSettingsRef?.current?.showEditHabitModal(taskSettings, habitHistoryEntry)
    } else {
      taskSettingsRef?.current?.showEditTaskModal(taskSettings)
    }
  }

  const onTaskClicked = (taskSettings, habitHistoryEntry) => {
    console.log(taskSettings.id)
    taskMenuRef?.current?.showTaskMenuModal(taskSettings, habitHistoryEntry, onEditTask, onCheckBoxPressed)
  }

  /**
   * 
   * @param {taskItems} tasksToDisplay a susbset of taskItems that we would like to sort and display 
   * @param {sortMode} sortMode the current sortMode, which is a list, where
   * index 0 => option selected and index 1 => isAscending (true/false)
   * @param {boolean} compareOnlyTime is set to true only if we want to compare the times of dueDate, rather than the dates (example for Tasks table)
   */
  const sortTasks = (tasksToDisplay, sortMode, compareOnlyTime = false) => {

    // sorts in place in ascending order
    if (sortMode[0] == "Importance") {
      tasksToDisplay.sort((a, b) => a.importance - b.importance);
    } else if (sortMode[0] == "Duration") {
      tasksToDisplay.sort((a, b) => a.duration - b.duration);
    } else if (sortMode[0] == "Due Date/Time") {
      tasksToDisplay.sort((a, b) => {
        if (!compareOnlyTime) {
          const aDueTime = new Date(a.habitHistoryEntry?.dueTimeOverride || a.dueDate)
          const bDueTime = new Date(b.habitHistoryEntry?.dueTimeOverride || b.dueDate)
          return aDueTime - bDueTime;
        } else {
          const aDueTime =  getTimeFromDatetime(a.dueDate)
          const bDueTime = getTimeFromDatetime(b.dueDate)
          return aDueTime - bDueTime;
        }
      });

    }

    // if mode is descending (not ascending), then we reverse the list
    if (viewMode == "Journal View (Default)" && sortModeJournalView[1] == false) {
      tasksToDisplay.reverse()
      return
    }

    if (viewMode == "All Tasks View" && sortModeAllTasksView[1] == false) {
      tasksToDisplay.reverse()
    }
  }

  function SelectedDayTasks() {
    /**
     * todays tasks includes tasks that are due between the start and end of the selected date
     */
    var endOfDayObj = getEndOfDay(selectedDate);
    var startOfDayObj = getStartOfDay(selectedDate);

    // code to count how many tasks/habits to display (that meet the conditions)
    const tasksToDisplay = []
    for (const task of taskItems) {

      var dueDateObj = new Date(task["dueDate"])
      if (!task.isHabit && endOfDayObj >= dueDateObj && dueDateObj >= startOfDayObj) {
        tasksToDisplay.push(task)
      }
    }
    // return if there's no tasks to display
    if (tasksToDisplay.length == 0) {
      return
    }

    sortTasks(tasksToDisplay, sortModeJournalView)

    return (
      <View>
        <View style={styles.items}>
          {
            tasksToDisplay.map((task, index) => {
              var dueDateObj = new Date(task.dueDate)
              var habitHistoryEntry = undefined

              if (!task.isHabit && endOfDayObj >= dueDateObj && dueDateObj >= startOfDayObj) {
                return (
                  <TouchableOpacity key={index} onPress={() => { onTaskClicked(task, undefined) }}>
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
                      points={parseFloat(task.importance) + parseFloat(task.duration)} />
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

    var endOfDayObj = getEndOfDay(selectedDate);
    // var startOfDayObj = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0);
    let count = 0

    const tasksToDisplay = []
    // code to count how many tasks/habits to display (that meet the conditions)
    for (const task of taskItems) {
      if (task.isHabit && habitHistory[task.id] != undefined) {
        for (const habitHistoryEntry of habitHistory[task.id]) {
          // if habitHistoryEntry found with a matching date, then let's add the habit to the display list!
          if (onlyDatesAreSame(new Date(habitHistoryEntry.habit_due_date), endOfDayObj)) {

            let habit = { ...task }

            // this is simply to ensure backward compatibility (for habit entires that have not been updated to the new format)
            // copy task properties to habit variable, but override columns where title, importance,
            // duration, or description are null
            if (habitHistoryEntry.title != null) habit.title = habitHistoryEntry.title
            if (habitHistoryEntry.importance != null) habit.importance = habitHistoryEntry.importance
            if (habitHistoryEntry.duration != null) habit.duration = habitHistoryEntry.duration
            if (habitHistoryEntry.description != null) habit.description = habitHistoryEntry.description

            habit.habitHistoryEntry = habitHistoryEntry
            tasksToDisplay.push(habit)
          }
        }
      }
    }
    // return if there's no habits to display
    if (tasksToDisplay.length == 0) {
      return
    }

    sortTasks(tasksToDisplay, sortModeJournalView)

    // console.log(JSON.stringify(tasksToDisplay, null, 2))

    return (
      <View>
        <StyledH2 style={styles.sectionTitle} text={"Habits"} />
        <View style={styles.items}>
          {
            tasksToDisplay.map((habit, index) => {
              return (
                <TouchableOpacity key={index} onPress={() => { onTaskClicked(habit, habit.habitHistoryEntry) }}>
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
                    points={parseFloat(habit.importance) + parseFloat(habit.duration)}
                    // note that the following depend on habitHistoryEntry, NOT the original task that is created
                    text={habit.title}
                    priority={habit.importance}
                    duration={habit.duration}
                    description={habit.description}
                    status={habit.habitHistoryEntry.status}
                    dueTimeOverride={habit.habitHistoryEntry.dueTimeOverride}
                    habitHistoryEntry={habit.habitHistoryEntry}
                  />
                </TouchableOpacity>
              )
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

    var endOfDayObj = getEndOfDay(selectedDate)

    // code to count how many tasks to display (that meet the conditions)
    const tasksToDisplay = []
    for (const task of taskItems) {
      var dueDateObj = new Date(task["dueDate"])
      if (endOfDayObj < dueDateObj && !task.isHabit) {
        tasksToDisplay.push(task)
      }
    }
    // return if there's no tasks to display
    if (tasksToDisplay.length == 0) {
      return
    }

    sortTasks(tasksToDisplay, sortModeJournalView)

    return (
      <View>
        <StyledH2 style={styles.sectionTitle} text={"Due Later"} />
        <View style={styles.items}>
          {
            tasksToDisplay.map((task, index) => {
              const habitHistoryEntry = undefined
              // due after end of day
              return (
                <TouchableOpacity key={index} onPress={() => { onTaskClicked(task, undefined) }}>
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
                    text={task.title}
                    priority={task.importance}
                    duration={task.duration}
                    description={task.description}
                    status={task.status}
                    points={parseFloat(task.importance) + parseFloat(task.duration)} />
                </TouchableOpacity>
              )
            })}
        </View>
      </View>
    )
  }

  /**
   * Is displayed only if selectedDate is > Today
   * Displays all habits that are UPCOMING (but not in the HabitHistory table yet), but in a disabled format (not clickable/editable)
   * @returns None
   */
  function UpcomingHabits() {
    var today = new Date()

    if (toDateOnly(today) >= toDateOnly(selectedDate)) {
      return <View></View>
    }

    let tasksToDisplay = []
    // code to count how many habits to display such that "repeatDays" condition is met
    for (const task of taskItems) {
      if (task.isHabit && task["repeatDays"][(selectedDate.getDay() + 6) % 7] == true) {
        tasksToDisplay.push(task)
      }
    }

    // return if there's no tasks to display
    if (tasksToDisplay.length == 0) {
      return
    }

    sortTasks(tasksToDisplay, sortModeJournalView, compareOnlyTime=true)

    return (
      <View>
        <View style={styles.sectionTitle}>
          <StyledH2 text={"Upcoming Habits"} />
          <StyledH4 text={"(View Only)"} style={styles.subtitle} />
        </View>
        <View style={styles.items}>
          {
            tasksToDisplay.map((task, index) => {
              // if task is a habit and repeatDays condition is met, then we display the habit
              if (task.isHabit && task["repeatDays"][(selectedDate.getDay() + 6) % 7] == true) {
                return (
                  <TouchableOpacity key={index} disabled={true} style={{ opacity: 0.5 }} onPress={() => { }}>
                    <Task
                      disabled={true}
                      showDueTime={true}
                      habitStatsEntry={habitStats[task.id]}
                      selectedDate={selectedDate}
                      habitHistoryEntry={undefined}
                      habitHistory={task.habitHistory}
                      habitInitDate={task.habitInitDate}
                      isHabit={task.isHabit}
                      repeatDays={task.repeatDays}
                      dueDate={task.dueDate}
                      taskId={task.id}
                      onChange={onCheckBoxPressed}
                      text={task.title}
                      priority={task.importance}
                      duration={task.duration}
                      description={task.description}
                      status={task.status}
                      points={parseFloat(task.importance) + parseFloat(task.duration)} />
                  </TouchableOpacity>
                )
              }
            })}
        </View>
      </View>
    )
  }


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

    var startOfDayObj = getStartOfDay(selectedDate)

    let tasksToDisplay = []

    // code to count how many tasks to display (that meet the conditions)
    for (const task of taskItems) {
      var dueDateObj = new Date(task.dueDate)
      if (startOfDayObj > dueDateObj && task.status == "incomplete" && task.isHabit == false) {
        tasksToDisplay.push(task)
      }
    }
    // return if there's no tasks to display
    if (tasksToDisplay.length == 0) {
      return
    }

    sortTasks(tasksToDisplay, sortModeJournalView)

    return (
      <View>
        <View style={styles.items}>
          {
            tasksToDisplay.map((task, index) => {
              // due before the start of selected date and incomplete
              return (
                <TouchableOpacity key={index} onPress={() => { onTaskClicked(task, undefined) }}>
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
                    points={parseFloat(task.importance) + parseFloat(task.duration)} />
                </TouchableOpacity>
              )
            })}
        </View>
      </View>
    )
  }


  // NOTE: this does not render any habits
  function AllTasks() {

    let tasksToDisplay = []
    for (const task of taskItems) {
      if (task.isHabit == true) continue
      tasksToDisplay.push(task)
    }

    sortTasks(tasksToDisplay, sortModeAllTasksView)

    return (
      <>
        <StyledH2 style={styles.sectionTitle} text={"All Tasks"} />

        <View style={styles.items}>

          <FlatList
            scrollIndicatorInsets={styles.scrollIndicatorStyle}
            contentContainerStyle={styles.flatListContainerStyle}
            data={tasksToDisplay}
            renderItem={({ item, index }) => {

              return (
                <TouchableOpacity key={index} onPress={() => { onTaskClicked(item, undefined) }} styles={styles.taskContainer}>
                  <Task
                    habitStatsEntry={habitStats[item.id]}
                    selectedDate={selectedDate}
                    habitHistoryEntry={undefined}
                    habitHistory={item.habitHistory}
                    habitInitDate={item.habitInitDate}
                    isHabit={item.isHabit}
                    repeatDays={item.repeatDays}
                    dueDate={item.dueDate}
                    showDueDate={true}
                    taskId={item.id}
                    onChange={onCheckBoxPressed}
                    text={item.title}
                    priority={item.importance}
                    duration={item.duration}
                    description={item.description}
                    status={item.status}
                    points={parseFloat(item.importance) + parseFloat(item.duration)} />
                </TouchableOpacity>
              )

            }}
            keyExtractor={task => task.id}
          />
        </View>
      </>
    )
  }





  // TASKS WRAPPER


  var [fontsLoaded] = useFonts({
    "MPlusRegular": require("./../../../assets/fonts/mplusRegular.ttf"),
    "MPlusMedium": require("./../../../assets/fonts/mplusMedium.ttf")
  })


  if (!fontsLoaded) {
    return null
  }



  return (

    <>
      {viewMode == "Journal View (Default)" &&
        <>
          <ScrollView contentContainerStyle={{
            flexGrow: 1, paddingBottom: 20,
          }} keyboardShouldPersistTaps='handled'>

            <View style={styles.tasksWrapper}>
              <>
                <SelectedDayTasks />
                <OverdueTasks />
                <SelectedDayHabits />
                <UpcomingHabits />
                <DueLaterTasks />
              </>
            </View>

          </ScrollView>
        </>
      }
      {viewMode == "All Tasks View" &&
        <>
          <View style={styles.tasksWrapperContainer}>
            <View style={styles.tasksWrapper} >
              <AllTasks />
            </View>
          </View>
        </>

      }
    </>
  )
}

export default TasksWrapper

const styles = StyleSheet.create({
  subtitle: {
    color: Color.LightBlue
  },
  tasksWrapper: {
    paddingHorizontal: 20,
  },
  tasksWrapperContainer: {
    flex: 1,
  },
  sectionTitle: {
    marginVertical: 5,
  },
  flatListContainerStyle: {
    flexGrow: 1,
    paddingBottom: 200,
  },
  items: {
    flexGrow: 1,
  },
  scrollIndicatorStyle: {
  },
  taskContainer: {

  }
})