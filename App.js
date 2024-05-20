// import { TasksPage } from './components/TasksPage/TasksPage';
import TasksPage from './components/TasksPage/TasksPage';
// import TasksHeader from './components/TasksHeader';
import 'react-native-url-polyfill/auto'
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font'
import { supabase } from './lib/supabase'
import Auth from './components/AuthPage';

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

export default function App() {
  // const [task, setTask] = useState(null);
  const [session, setSession] = useState(null)
  const tasksPageRef = useRef();
  // const tasksPageRef = useCallback(async (node) => {
  //   if (node !== null) {
  //     await fetchData()
  //   }
  // }, []);

  // supabase realtime:

  // supabase
  // .channel('any')
  // .on('postgres_changes', { event: '*', schema: 'public', table: 'Tasks' }, payload => {
  //   syncLocalAndDb()
  // })
  // .subscribe()

  const fetchData = async () => {
    if (tasksPageRef != null) {
      await tasksPageRef?.current?.syncLocalWithDb()
      console.info("fetched data successfully.")
    } else {
      console.info("did not fetch data since tasks page has not loaded yet")
    }
  }


  // authorize user into session
  useEffect(() => {


    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.info("logging in now")
      setSession(session)

    })

    supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      console.info("changing login info")
      console.info(event)
      if ((event == "SIGNED_IN" || event == "INITIAL_SESSION") && session) {
        console.log("fetching data")
        await fetchData()
      } else {
        console.warn("inside authstatechange: unable to fetch data since user is not logged in for some reason!")
      }
    })

    // ignoring logs since it's giving a dumb warning with probably no solution
    // LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []) // empty dependency array simulates componentDidMount


  const signOutUser = async () => {
    if (session.user && session) {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
    }
  }

  var [fontsLoaded] = useFonts({
    "MPlusRegular": require("./assets/fonts/mplusRegular.ttf"),
    "MPlusMedium": require("./assets/fonts/mplusMedium.ttf")
  })


  if (!fontsLoaded) {
    return null
  }

  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* <BackgroundImg /> */}
      {session && session.user ? (

        <TasksPage 
        signOutUser={signOutUser}
        session={session}  ref={tasksPageRef} supabase={supabase} />) :
        (<Auth />)}

    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
});