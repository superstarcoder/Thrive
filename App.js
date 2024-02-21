import 'react-native-url-polyfill/auto'
import React, {useState, useRef, useCallback, useEffect} from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Modal, Button } from 'react-native';
import Task from './components/Task';
import Color from './assets/themes/Color'
import {StyledH1, StyledH2, StyledH3, StyledH4, fontStyles} from './components/text/StyledText';
// import { XCircle } from 'phosphor-react-native';
import { CaretRight, CaretLeft } from 'phosphor-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font'
import * as Haptics from "expo-haptics"
import TaskSettingsModal from './components/TaskSettingsModal';
import { LogBox, Platform } from 'react-native';
import { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import Auth from './components/Auth';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { onlyDatesAreSame } from './components/DateHelper';
// import BackgroundImg from './components/BackgroundImage';

/**
 * alternate method:
 * each history item contains: habit's due date, whether habit is complete/incomplete/pending (values of "status")
 * eg:
 * 
 * 8/8/23 complete
 * 8/9/23 incomplete
 * 8/10/23 (today) pending
 * 
 * on log in / db update, update habit log:
 * 
 * * for all "pending" habits that were due before today, mark their status as: incomplete
 * 
 * * for day "myDay" between last habit log and today:
 * * * if habit "repeatDays" conditions meet AND habit due on myDay has not been added to log:
 * * * add "incomplete" (if myDay is not today) or "pending" (if myDay is today) to log data
 * 
 * on completing habit before due date:
 * * update as "complete" in habit log
 * 
 * Note: "incomplete" habits cannot be completed
 * 
 */


export default function App() {
  const [task, setTask] = useState(null);
  const [session, setSession] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [taskItems, setTaskItems] = useState([]);

  // supabase realtime:

  // supabase
  // .channel('any')
  // .on('postgres_changes', { event: '*', schema: 'public', table: 'Tasks' }, payload => {
  //   syncLocalAndDb()
  // })
  // .subscribe()


  // ----------------------------------------------------------
  // auth stuff
  // ----------------------------------------------------------

  useEffect(() => {

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
}, [])

  // sync local data if logged in
  useEffect(() => {

    if (session && session.user) {
      const fetchData = async () => {
        await syncLocalAndDb()
      }
      fetchData()
    }

  }, [session])


  const signOutUser = async () => {
    if (session.user && session) {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
    }
  }

  // ----------------------------------------------------------
  // database changes
  // ----------------------------------------------------------
  const syncLocalAndDb = async () => {
    const { data, error } = await supabase
    .from('Tasks')
    .select()
    .eq('email', session.user.email)
    .order('created_at', { ascending: true })

    if (error) console.log(error)
    // console.log("here is my data :(: "+data)

    let newTaskItems = []
    for (const task of data) {
      task["dueDate"] = new Date(task["dueDate"])

      // update habit history dates (convert from string to date)
      if (task["habitHistory"] != null) {
        const newhabitHistory = []
        for (const entry of task["habitHistory"]) {
          newhabitHistory.push({...entry, exactDueDate: new Date(entry["exactDueDate"])})
        }
        task["habitHistory"] = newhabitHistory
      }



      newTaskItems = [...newTaskItems, task]
    }

    setTaskItems(newTaskItems)
  }

  const onSave = async (newTaskSettings) => {
    // make data ready for inserting into db
    let taskSettingsCopy = {...newTaskSettings} 
    taskSettingsCopy["dueDate"] = newTaskSettings["dueDate"].toISOString()
    taskSettingsCopy["email"] = session.user.email
    delete taskSettingsCopy["id"]
    // convert habit history dates to ISO string 

    if (taskSettingsCopy["habitHistory"] != null) {
      const newhabitHistory = []
      for (const entry of taskSettingsCopy["habitHistory"]) {
        newhabitHistory.push({...entry, exactDueDate: entry["exactDueDate"].toISOString()})
      }
      taskSettingsCopy["habitHistory"] = newhabitHistory
    }

    // insert into db
    const { data, error } = await supabase
    .from('Tasks')
    .insert(taskSettingsCopy)
    .select()

    if (error) console.log(error)

    await syncLocalAndDb()
  }

  const onEditTaskComplete = async (taskSettingsEdited) => {

    const idToEdit = taskSettingsEdited["id"]

    let taskSettingsCopy = {...taskSettingsEdited} 
    taskSettingsCopy["dueDate"] = taskSettingsEdited["dueDate"].toISOString()
    taskSettingsCopy["email"] = session.user.email
    delete taskSettingsCopy["id"]
    // convert habit history dates to ISO string 
    if (taskSettingsCopy["habitHistory"] != null) {
      const newhabitHistory = []
      for (const entry of taskSettingsCopy["habitHistory"]) {
        newhabitHistory.push({...entry, exactDueDate: entry["exactDueDate"].toISOString()})
      }
      taskSettingsCopy["habitHistory"] = newhabitHistory
    }

    // insert into db
    const { error } = await supabase
    .from('Tasks')
    .update(taskSettingsCopy)
    .eq('id', idToEdit)

    if (error) console.log(error)

    await syncLocalAndDb()

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
      console.log(error)
    }

    await syncLocalAndDb()
  }


  // ----------------------------------------------------------
  // UI stuff
  // ----------------------------------------------------------

  const onEditTask = (taskSettings) => {
    taskSettingsRef?.current?.showEditTaskModal(taskSettings)
  }

  const onAddTask = () => {
    taskSettingsRef?.current?.showAddTaskModal()
  }


  const taskSettingsRef = useRef();

  var [fontsLoaded] = useFonts({
    "MPlusRegular": require("./assets/fonts/mplusRegular.ttf"),
    "MPlusMedium": require("./assets/fonts/mplusMedium.ttf")
  })

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

  if (!fontsLoaded) {
    return null
  }


	const showDatePicker = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
		setDatePickerVisibility(true);
	};

	const hideDatePicker = () => {
		setDatePickerVisibility(false);
	};

  const handleConfirm = (date) => {
    // console.log(date.toLocaleDateString())
    setSelectedDate(date)
		hideDatePicker(); // must be first
	};

  

  // if the date selected is today

  const todaysDate = new Date()
  const dateTomorrow = new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate()+1)
  const dateYesterday  = new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate()-1)
  // console.log(selectedDate.toDateString(), dateTomorrow.toDateString())
  if (selectedDate.toDateString() == (new Date()).toDateString()) {
    dateText = "Today"
  }
  else if (selectedDate.toDateString() == dateTomorrow.toDateString()){
    dateText = "Tomorrow"
  }
  else if (selectedDate.toDateString() == dateYesterday.toDateString()){
    dateText = "Yesterday"
  }
  else {
    dateText = selectedDate.toLocaleDateString()
  }

  const goToNextDay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    const nextDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()+1)
    setSelectedDate(nextDay)
  }

  const goToPreviousDay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    const previousDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()-1)
    setSelectedDate(previousDay)
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



      if (task.isHabit) {
        const found = task.habitHistory.some(entry => onlyDatesAreSame(entry.exactDueDate, selectedDate));
        if (found) count += 1
      }
      // if task
      else {
        var dueDateObj = new Date(task["dueDate"])
        if (endOfDayObj >= dueDateObj && dueDateObj >= startOfDayObj) {
          count += 1 
        }
      }
    }
    // return if there's no tasks to display
    if (count == 0) {
      return
    }

    return (
      <View>
        <StyledH2 style={styles.sectionTitle} text={dateText+"'s Tasks"}/>
        <View style={styles.items}>
        {
          taskItems.map((task, index) => {
            var dueDateObj = new Date(task["dueDate"])
            var habitHistoryEntry = undefined
            if (task.isHabit) {
              var found = false
              habitHistoryEntry = task.habitHistory.find(entry => onlyDatesAreSame(entry.exactDueDate, selectedDate));
              if (habitHistoryEntry != undefined) {
                found = true
              }
              // var found = task.habitHistory.some(myDay => onlyDatesAreSame(myDay, selectedDate));
            }

            if ((task.isHabit && found) || (!task.isHabit && endOfDayObj >= dueDateObj && dueDateObj >= startOfDayObj)) {
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

  return (
    
      <GestureHandlerRootView style={{flex: 1}}>
        {/* <BackgroundImg /> */}
        {session && session.user ? (

        <View style={styles.container}>

          <View style={styles.tasksHeader}>
            <View style={styles.dateSettings}>
              <View style={styles.currentDateContainer}>

                <TouchableOpacity style={styles.caretLeftContainer} onPress={goToPreviousDay}>
                  <CaretLeft size={25} weight="fill" color={Color.Blue} style={styles.caretLeft}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={showDatePicker}>
                  <StyledH2 text={dateText} style={styles.currentDate}/>
                </TouchableOpacity>

                <TouchableOpacity style={styles.caretRightContainer} onPress={goToNextDay}>
                  <CaretRight size={25} weight="fill" color={Color.Blue} style={styles.caretRight}/>
                </TouchableOpacity>

                <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                display='inline'
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                date={selectedDate}
              />

              </View>
            </View>
          </View>

          {/* display tasks */}
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1
            }}
            keyboardShouldPersistTaps='handled'
          >

          <View style={styles.tasksWrapper}>

            <OverdueTasks />
            <TodaysTasks />

            {/* <StyledH2 style={styles.sectionTitle} text={"Due Later"}/> */}

            {/* <View style={styles.items}> */}

            <DueLaterTasks />
              
            {/* </View> */}

          </View>
            
          </ScrollView>

          {/* bottom bar/buttons */}
          <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.writeTaskWrapper}
          >
            <TextInput style={styles.input} placeholder={'Write a task'} onChangeText={text => setTask({text:text, priority: 9, duration: 7})} ref={(myInput) => { this.textInput = myInput }} />

            <TouchableOpacity onPress={onAddTask}>
              <View style={styles.addWrapper}>
                <Text style={styles.addText}>+</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={signOutUser}>
              <View style={styles.addWrapper}>
              </View>
            </TouchableOpacity>

          </KeyboardAvoidingView>

          <TaskSettingsModal ref={taskSettingsRef} onSave={onSave} onEdit={onEditTaskComplete} onDelete={onDelete} />
         
        </View>) : 
        (<Auth />)}

      </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  dateSettings: {
    // backgroundColor: Color.Blue,
    paddingHorizontal: 10,
    bottom: 12,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center"

  },
  caretLeft: {
    marginHorizontal: 14,
    marginLeft: 20,
    marginVertical: 8,
  },
  caretRight: {
    marginHorizontal: 14,
    marginRight: 20,
    marginVertical: 8,
  },
  tasksHeader: {
    top: 0,
    height: 110,
    width: "100%",
    backgroundColor: Color.DarkestBlue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "black",
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  currentDateContainer: {
    flexDirection: "row",
    backgroundColor: "#101326",
    borderRadius: 8,
    paddingHorizontal: 0,
    alignItems: "center"
  },
  container: {
    flex: 1,
    backgroundColor: Color.DarkestBlue,
  },
  text: {
    color: Color.White,
  },
  tasksWrapper: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    marginBottom: 20,
  },
  items: {
    // marginTop: 20,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
});