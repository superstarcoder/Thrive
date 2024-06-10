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
import { subscribeToChangesTasksTable, supabaseSyncLocalWithDb } from './TasksPageSupabase';
import TaskMenu from './TasksWrapper/TaskMenu';
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
  const taskMenuRef = useRef();


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


  const syncLocalWithDb = async () => {
    await supabaseSyncLocalWithDb(supabase, session, setTaskItems, setHabitStats, setHabitHistory)    
  }

  useEffect(() => {


    console.info("component has been mounted. attempting to fetch data")
    // Code to execute after component mounts
    const fetchData = async () => {
      await syncLocalWithDb()
    }
    fetchData()
    subscribeToChangesTasksTable(supabase, syncLocalWithDb)
    // console.log(JSON.stringify(habitHistory[42], undefined, 2))


  }, []); // Empty dependency array simulates componentDidMount


  return (<View style={styles.container}>

    <TasksHeader onAddTask={onAddTaskButtonPressed} goToPreviousDay={goToPreviousDay} showDatePicker={showDatePicker} dateText={dateText} goToNextDay={goToNextDay} isDatePickerVisible={isDatePickerVisible} handleConfirm={handleConfirm} hideDatePicker={hideDatePicker} selectedDate={selectedDate} />
    {
      /* display tasks */
    }
    <TasksWrapper taskMenuRef={taskMenuRef} taskSettingsRef={taskSettingsRef} selectedDate={selectedDate} taskItems={taskItems} setTaskItems={setTaskItems} dateText={dateText} habitHistory={habitHistory} setHabitHistory={setHabitHistory} habitStats={habitStats} />

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

    <TaskMenu ref={taskMenuRef} supabase={supabase}/>



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