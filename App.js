import TasksHeader from './components/TasksHeader';
import 'react-native-url-polyfill/auto'
import React, {useState, useRef, useCallback, useEffect} from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Modal, Button } from 'react-native';
import Task from './components/TasksWrapper/Task';
import Color from './assets/themes/Color'
// import { XCircle } from 'phosphor-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font'
import * as Haptics from "expo-haptics"
import TaskSettingsModal from './components/TaskSettingsModal/TaskSettingsModal';
import { LogBox, Platform } from 'react-native';
import { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import Auth from './components/Auth';
// import { onlyDatesAreSame } from './utils/DateHelper';
import TasksWrapper from './components/TasksWrapper/TasksWrapper';
// import BackgroundImg from './components/BackgroundImage';


// TODO: use supabase in a more scalable way, move syncLocalDb to a place that makes sense
// TODO: setTaskItems is not defined. figure out where to put supabase/state code


// when do we need to sync local states with 

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


/**
 * simple solution:
 * 
 * habit entry:
 * 
 * Displaying habits on a page:
 * 
 * DISPLAY HABITS AFTER INIT (filter: habitInitDate <= selectedDate)
 * if habit_DAY == selected_DAY, then display (eg: "monday" == "monday")
 * 
 * EACH TIME A HABIT IS MARKED COMPLETE:
 *    add/modify entry into habitHistory as status:"complete" with "exactDueDate"
 * 
 * for all:
 * if there is an entry in habit's habitHistory where exactDueDate == selected_date:
 *      then display habit as complete
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


  // =================================================================================
  // =================================================================================
  // =================================================================================
  // authenticate the user
  // =================================================================================
  // =================================================================================
  // =================================================================================

  // authorize user into session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    // ignoring logs since it's giving a dumb warning with probably no solution
    // LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
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

  // =================================================================================
  // =================================================================================
  // database changes
  // =================================================================================
  // =================================================================================

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

  // ----------------------------------------------------------
  // UI stuff
  // ----------------------------------------------------------


  const onAddTask = () => {
    taskSettingsRef?.current?.showAddTaskModal()
  }


  const taskSettingsRef = useRef();

  var [fontsLoaded] = useFonts({
    "MPlusRegular": require("./assets/fonts/mplusRegular.ttf"),
    "MPlusMedium": require("./assets/fonts/mplusMedium.ttf")
  })


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




  return (
    
      <GestureHandlerRootView style={{flex: 1}}>
        {/* <BackgroundImg /> */}
        {session && session.user ? (

        <View style={styles.container}>

        <TasksHeader   goToPreviousDay={goToPreviousDay} showDatePicker={showDatePicker} dateText={dateText} goToNextDay={goToNextDay} isDatePickerVisible={isDatePickerVisible} handleConfirm={handleConfirm} hideDatePicker={hideDatePicker} selectedDate={selectedDate}  />
          {/* display tasks */}
          <TasksWrapper taskSettingsRef={taskSettingsRef} selectedDate={selectedDate} taskItems={taskItems} setTaskItems={setTaskItems}/>

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

          <TaskSettingsModal session={session} ref={taskSettingsRef} syncLocalAndDb={syncLocalAndDb}/>
         
        </View>) : 
        (<Auth />)}

      </GestureHandlerRootView>
  );
}

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