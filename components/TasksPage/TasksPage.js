// import { TasksPage } from './components/TasksPage/TasksPage';
import TasksHeader from './TasksHeader/TasksHeader';
import React, { useState, useRef, useCallback, useEffect, useReducer, forwardRef, useImperativeHandle } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Modal, Button } from 'react-native';
// import { XCircle } from 'phosphor-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font'
import * as Haptics from "expo-haptics"
import TaskSettingsModal from './TaskSettingsModal/TaskSettingsModal';
import HabitSettingsModal from './TaskSettingsModal/HabitSettingsModal';
import { LogBox, Platform } from 'react-native';
// import { onlyDatesAreSame } from './utils/DateHelper';
import TasksWrapper from './TasksWrapper/TasksWrapper';
import { subscribeToChangesTasksTable, supabaseSyncLocalWithDb } from './TasksPageSupabase';
import TaskMenu from './TasksWrapper/TaskMenu';
import HabitApplyModal from './TasksWrapper/HabitApplyModal';
import TaskRecommendationsModal from './TasksWrapper/TaskRecommendationsModal';
import { TASKS_PAGE_SORT_MODES, TASKS_PAGE_VIEW_MODES } from '../../utils/AppConstants';
// import BackgroundImg from './components/BackgroundImage';
import { useColorsStateContext } from '../ColorContext';


const TasksPage = forwardRef(({
  signOutUser,
  session,
  supabase,
  taskItems,
  setTaskItems,
  habitHistory,
  setHabitHistory,
  habitStats,
  setHabitStats,
}, ref) => {


  var [fontsLoaded] = useFonts({
    "MPlusRegular": require("../../assets/fonts/mplusRegular.ttf"),
    "MPlusMedium": require("../../assets/fonts/mplusMedium.ttf")
  })


  if (!fontsLoaded) {
    return null
  }

  // useEffect(() => {
  //   const fetchData = async () => {
  //     await syncLocalWithDb()
  //   }
  //   fetchData()
  // }, [])



  useImperativeHandle(ref, () => ({
    syncLocalWithDb: syncLocalWithDb

  }));



  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [viewMode, setViewMode] = useState(TASKS_PAGE_VIEW_MODES[0])
  // tuple: first item is the mode, 2nd item is true if ascending (false if descending)
  const [sortModeJournalView, setSortModeJournalView] = useState([TASKS_PAGE_SORT_MODES[1], true])
  const [sortModeAllTasksView, setSortModeAllTasksView] = useState([TASKS_PAGE_SORT_MODES[3], false])
  const { ColorState, setColorState } = useColorsStateContext();
  const styles = getDynamicStyles(ColorState)
  const [allDaysTaskRecs, setAllDaysTaskRecs] = useState({}) // selectedDate : taskRecommendations

  const taskSettingsRef = useRef();
  const habitSettingsRef = useRef();
  const taskMenuRef = useRef();
  const habitApplyModalRef = useRef();
  const taskRecommendationsModalRef = useRef();

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
    taskSettingsRef?.current?.showAddTaskModal(selectedDate)
  }

  const onAddHabitButtonPressed = () => {
    habitSettingsRef?.current?.showAddHabitModal(selectedDate)
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
    await supabaseSyncLocalWithDb(session, setTaskItems, setHabitStats, setHabitHistory)
  }

  useEffect(() => {

  }, []); // Empty dependency array simulates componentDidMount


  return (<View style={styles.container}>

    <TasksHeader
      viewMode={viewMode}
      setViewMode={setViewMode}
      onAddTask={onAddTaskButtonPressed}
      onAddHabit={onAddHabitButtonPressed}
      goToPreviousDay={goToPreviousDay}
      showDatePicker={showDatePicker}
      dateText={dateText}
      goToNextDay={goToNextDay}
      isDatePickerVisible={isDatePickerVisible}
      handleConfirm={handleConfirm}
      hideDatePicker={hideDatePicker}
      selectedDate={selectedDate}
      sortModeJournalView={sortModeJournalView}
      setSortModeJournalView={setSortModeJournalView}
      sortModeAllTasksView={sortModeAllTasksView}
      setSortModeAllTasksView={setSortModeAllTasksView}
    />
    {
      /* display tasks */
    }
    <TasksWrapper
      session={session}
      taskMenuRef={taskMenuRef}
      habitSettingsRef={habitSettingsRef}
      taskSettingsRef={taskSettingsRef}
      taskRecommendationsModalRef={taskRecommendationsModalRef}
      allDaysTaskRecs={allDaysTaskRecs}
      setAllDaysTaskRecs={setAllDaysTaskRecs}
      selectedDate={selectedDate}
      taskItems={taskItems}
      setTaskItems={setTaskItems}
      dateText={dateText}
      habitHistory={habitHistory}
      setHabitHistory={setHabitHistory}
      habitStats={habitStats}
      setHabitStats={setHabitStats}
      viewMode={viewMode}
      sortModeJournalView={sortModeJournalView}
      sortModeAllTasksView={sortModeAllTasksView}
    />

    {
      /* bottom bar/buttons */
    }
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.writeTaskWrapper}>

    </KeyboardAvoidingView>

    <TaskSettingsModal session={session} ref={taskSettingsRef} syncLocalWithDb={syncLocalWithDb} supabase={supabase} taskItems={taskItems} setTaskItems={setTaskItems} habitHistory={habitHistory} setHabitHistory={setHabitHistory} habitStats={habitStats} setHabitStats={setHabitStats} />
    <HabitSettingsModal session={session}
      ref={habitSettingsRef}
      syncLocalWithDb={syncLocalWithDb}
      supabase={supabase}
      taskItems={taskItems}
      setTaskItems={setTaskItems}
      habitHistory={habitHistory}
      setHabitHistory={setHabitHistory}
      habitStats={habitStats}
      setHabitStats={setHabitStats}
      habitApplyModalRef={habitApplyModalRef}
    />

    <TaskMenu ref={taskMenuRef} supabase={supabase} taskItems={taskItems} setTaskItems={setTaskItems} habitHistory={habitHistory} setHabitHistory={setHabitHistory} setHabitStats={setHabitStats} />
    <HabitApplyModal ref={habitApplyModalRef} />
    <TaskRecommendationsModal ref={taskRecommendationsModalRef} session={session} setTaskItems={setTaskItems} taskItems={taskItems}/>



  </View>);
});

export default TasksPage;

const getDynamicStyles = (ColorState) => ({
  container: {
    flex: 1,
    backgroundColor: ColorState?.DarkestBlue,
  },
  text: {
    color: ColorState?.TextColor,
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