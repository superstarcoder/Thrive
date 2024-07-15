// import { TasksPage } from './components/TasksPage/TasksPage';
import TasksPage from './components/TasksPage/TasksPage';
// import TasksHeader from './components/TasksHeader';
import 'react-native-url-polyfill/auto'
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font'
import { supabase } from './lib/supabase'
import Auth from './components/Auth/AuthPage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Color from './assets/themes/Color';
import NavBar from './components/NavBar';
import { LogBox } from 'react-native';
// import PasswordResetForm from './components/TasksPage/Auth/PasswordResetForm';
import EnterNewPasswordForm from './components/Auth/EnterNewPasswordForm';
import StatsPage from './components/StatsPage/StatsPage';
import AIPage from './components/AIPage/AIPage';
import SettingsPage from './components/SettingsPage/SettingsPage';
import { supabaseSyncLocalWithDb, supabaseFixHistoryAllHabits } from './components/TasksPage/TasksPageSupabase';


// TODO: figure out how database gets updated onEditTaskComplete or onSaveTask
// TODO: update local states (tasks) on page load!!

// email: danny@gmail.com
// password: danny danny

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
 * * for day "myDay" between created_date and today:
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

const Tab = createBottomTabNavigator();

export default function App() {
  // const [task, setTask] = useState(null);

  const [session, setSession] = useState(null)
  const [currentPage, setCurrentPage] = useState("home")
  const [taskItems, setTaskItems] = useState([]);
  const [habitHistory, setHabitHistory] = useState({})
  const [habitStats, setHabitStats] = useState({})
  // const [dataIsFetched, setDataIsFetched] = useState(true)
  const tasksPageRef = useRef();
  // authorize user into session
  useEffect(() => {


    const updateSession = async () => {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        setSession(session)
        console.log("noticed a change in session")
        console.log(session)
        console.log(session?.user)
        if (session && session.user) {
          console.log("user logged in!")
          console.log("fetching data for " + session.user.email)
          const newData = await supabaseSyncLocalWithDb(session, setTaskItems, setHabitStats, setHabitHistory)
          console.log("synced")
          // this only needs to be run on new days! will fix later to increase efficiency
  
          await supabaseFixHistoryAllHabits(newData.newTaskItems, newData.newHabitHistory, setHabitHistory, newData.newHabitStats, setHabitStats)
          console.log("fixed habit histories")
          // await supabaseSyncLocalWithDb(session, setTaskItems, setHabitStats, setHabitHistory)
          console.log("synced")
        }
      })
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      console.info("onAuthStateChange: "+event)
      await updateSession()

      if (event == "SIGNED_IN") {
        setCurrentPage("home")
      }
    })

    // ignoring logs since it's giving a dumb warning with probably no solution
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

    return () => {
      authListener?.subscription.unsubscribe();
      console.log("unsubscribed successfuly")
    };
  }, []) // empty dependency array simulates componentDidMount


  const signOutUser = async () => {
    if (session.user && session) {
      console.log("signing out the user")
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
      else {
        // clear all local state data
        setTaskItems([])
        setHabitHistory([])
        setHabitStats({})
      }
      console.log("sign out was successful")
    }
  }

  var [fontsLoaded] = useFonts({
    "MPlusRegular": require("./assets/fonts/mplusRegular.ttf"),
    "MPlusMedium": require("./assets/fonts/mplusMedium.ttf")
  })


  if (!fontsLoaded) {
    return null
  }

  var MySettingsPage = () => {
    return (
      <View style={{ backgroundColor: Color.DarkestBlue, width: "100%", height: "100%" }}>
      </View>
    );
  }

  var myNavBar = <NavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />

  return (

    // <NavigationContainer style={{margin: 0}}>
    <GestureHandlerRootView style={styles.gestureHandler}>
      {/* <BackgroundImg /> */}
      {session && session.user ? (
        <>

          {currentPage == "home" &&
            <>
              <TasksPage
                signOutUser={signOutUser}
                session={session}
                ref={tasksPageRef}
                supabase={supabase}
                taskItems={taskItems}
                setTaskItems={setTaskItems}
                habitHistory={habitHistory}
                setHabitHistory={setHabitHistory}
                habitStats={habitStats}
                setHabitStats={setHabitStats}
              />
            </>
          }
          {currentPage == "settings" &&
            <>
              <SettingsPage signOutUser={signOutUser} />
            </>

          }
          {currentPage == "stats" &&
            <>
              <StatsPage habitStats={habitStats} taskItems={taskItems} />
            </>
          }
          {currentPage == "AI" &&
            <>
              <AIPage taskItems={taskItems} />
            </>
          }
          {currentPage == "enter_new_password_form" &&
            <EnterNewPasswordForm setCurrentPage={setCurrentPage} />
          }
          {currentPage != "enter_new_password_form" &&
            <>
              {myNavBar}
            </>
          }
        </>

      ) :
        (
          <Auth setCurrentPage={setCurrentPage} />
        )
      }

    </GestureHandlerRootView>
    // </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  gestureHandler: {
    flex: 1,
  }
});