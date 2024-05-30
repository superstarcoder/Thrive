// import { TasksPage } from './components/TasksPage/TasksPage';
import TasksHeader from './TasksHeader/TasksHeader';
import React, { useState, useRef, useCallback, useEffect, useReducer, forwardRef, useImperativeHandle } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Modal, Button } from 'react-native';
import Color from '../../assets/themes/Color'
// import { XCircle } from 'phosphor-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font'
import * as Haptics from "expo-haptics"
import TaskSettingsModal from './TaskSettingsModal/TaskSettingsModal';
import { LogBox, Platform } from 'react-native';
// import { onlyDatesAreSame } from './utils/DateHelper';
import TasksWrapper from './TasksWrapper/TasksWrapper';
// import BackgroundImg from './components/BackgroundImage';


const TasksPage = forwardRef(({
  signOutUser,
  session, supabase}, ref) => {


  var [fontsLoaded] = useFonts({
    "MPlusRegular": require("../../assets/fonts/mplusRegular.ttf"),
    "MPlusMedium": require("../../assets/fonts/mplusMedium.ttf")
  })


  if (!fontsLoaded) {
    return null
  }



  useImperativeHandle(ref, () => ({
    syncLocalWithDb: syncLocalWithDb

  }));



  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [taskItems, setTaskItems] = useState([]);
  const [habitHistory, setHabitHistory] = useState({})
  const [habitStats, setHabitStats] = useState({})
  // const [taskSettings, dispatch] = useReducer(reducer, {})
  


  const taskSettingsRef = useRef();


  const goToPreviousDay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    const previousDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 1)
    setSelectedDate(previousDay)
  }

  const showDatePicker = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setDatePickerVisibility(true);
  };


  const goToNextDay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    const nextDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1)
    setSelectedDate(nextDay)
  }

  const handleConfirm = (date) => {
    // console.log(date.toLocaleDateString())
    setSelectedDate(date)
    hideDatePicker(); // must be first
  };



  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const onAddTaskButtonPressed = () => {
    taskSettingsRef?.current?.showAddTaskModal()
  }




  // if the date selected is today

  const todaysDate = new Date()
  const dateTomorrow = new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate() + 1)
  const dateYesterday = new Date(todaysDate.getFullYear(), todaysDate.getMonth(), todaysDate.getDate() - 1)

  var dateText;
  switch (selectedDate.toDateString()) {
    case (new Date()).toDateString():
      dateText = "Today";
      break;
    case dateTomorrow.toDateString():
      dateText = "Tomorrow";
      break;
    case dateYesterday.toDateString():
      dateText = "Yesterday";
      break;
    default:
      dateText = selectedDate.toLocaleDateString();
  }


  const getAllTasks = async () => {
    const { data, error } = await supabase
    .from('Tasks')
    .select()
    .eq('email', session.user.email)
    .order('created_at', { ascending: true })

    if (error) console.warn(error)
    return data
  }

  // updates the habitHistory state with all the habit histories that are associated with ALL the habits that have been loaded into the app 
  // format of habitHistory state:
    // dictionary in which:
    // key = habit's id
    // value = list of habit history entries associated with that id 
    // NOTE: habit histories are sorted in descending order
  
  const getAllHabitHistories = async (taskItems) => {

    let newHabitHistory = {}

    for (const task of taskItems) {
      if (task.isHabit) {
        const { data, error } = await supabase
        .from('HabitHistory')
        .select()
        .eq('id', task.id)
        .order('created_at', { ascending: false })
        if (error) console.warn(error)
        newHabitHistory[task.id] = data
      }
    }
    setHabitHistory(newHabitHistory)

    return newHabitHistory

    // console.log(JSON.stringify(newHabitHistory, undefined, 2))

  }
  

  const getHabitStats = async (newHabitHistory) => {

    let newHabitStats = {}

    for (const [habitId, habitEntriesArray] of Object.entries(newHabitHistory)) {

      let streak = 0
      let history = []

      // get latest streak count
      for (const historyEntry of habitEntriesArray) {
        if (historyEntry.status == "incomplete") break;
        else if (historyEntry.status == "complete") streak += 1;
      }

      // update history array
      for (const historyEntry of habitEntriesArray) {
        if (historyEntry.status == "incomplete") history.push(0);
        else if (historyEntry.status == "complete") history.push(1);
        else if (historyEntry.status == "exempt") history.push(-1);
      }

      // update streak count
      newHabitStats[habitId] = {"streak" : streak, "history" :history}
    }

    console.log(JSON.stringify(newHabitStats, undefined, 2))

    setHabitStats(newHabitStats)
    return newHabitStats

  }


  const syncLocalWithDb = async () => {

    const data = await getAllTasks()

    // code to update taskItems state

    console.log("NOTE: syncing local states with db")

    // console.log("here is my data :(: "+data)

    let newTaskItems = []
    for (const task of data) {
      task.dueDate = new Date(task.dueDate)

      // update habit history dates (convert from string to date)
      if (task.habitHistory != null) {
        const newhabitHistory = []
        for (const entry of task["habitHistory"]) {
          newhabitHistory.push({ ...entry, exactDueDate: new Date(entry.exactDueDate) })
        }
        task.habitHistory = newhabitHistory
        // console.log({"updating created_at" : task["created_at"]})
      }

      task.repeat_days_edited_date = new Date(task.repeat_days_edited_date)

      newTaskItems = [...newTaskItems, task]
    }

    setTaskItems(newTaskItems)


    // update HabitHistory state
    var newHabitHistory = await getAllHabitHistories(newTaskItems)

    // update habit stats state
    getHabitStats(newHabitHistory)
    
  }

  useEffect(() => {


    console.info("component has been mounted. attempting to fetch data")
    // Code to execute after component mounts
    const fetchData = async () => {
      await syncLocalWithDb()
    }
    fetchData()
    // console.log(JSON.stringify(habitHistory[42], undefined, 2))


  }, []); // Empty dependency array simulates componentDidMount






  return (<View style={styles.container}>

    <TasksHeader onAddTask={onAddTaskButtonPressed} goToPreviousDay={goToPreviousDay} showDatePicker={showDatePicker} dateText={dateText} goToNextDay={goToNextDay} isDatePickerVisible={isDatePickerVisible} handleConfirm={handleConfirm} hideDatePicker={hideDatePicker} selectedDate={selectedDate} />
    {
      /* display tasks */
    }
    <TasksWrapper taskSettingsRef={taskSettingsRef} selectedDate={selectedDate} taskItems={taskItems} setTaskItems={setTaskItems} dateText={dateText} habitHistory={habitHistory} setHabitHistory={setHabitHistory} />

    {
      /* bottom bar/buttons */
    }
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.writeTaskWrapper}>

      {/* <TouchableOpacity>
        <View style={styles.addWrapper}>
          <Text style={styles.addText}>+</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={signOutUser}>
        <View style={styles.addWrapper}>
        </View>
      </TouchableOpacity> */}

    </KeyboardAvoidingView>

    <TaskSettingsModal session={session} ref={taskSettingsRef} syncLocalWithDb={syncLocalWithDb} supabase={supabase} />

  </View>);
});

export default TasksPage;

const styles = StyleSheet.create({
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