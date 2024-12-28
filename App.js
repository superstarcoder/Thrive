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
import { supabaseSyncLocalWithDb, supabaseFixHistoryAllHabits, updateEmberStats } from './components/TasksPage/TasksPageSupabase';
import { ColorsStateProvider } from './components/ColorContext';
import { supabaseLoadUserSettings } from './components/Auth/AuthPageSupabase'
import { useColorsStateContext } from './components/ColorContext';
import { USER_INIT_SETTINGS } from './utils/AppConstants';


// const Tab = createBottomTabNavigator();


function MainApp() {
  // const [task, setTask] = useState(null);

  const [session, setSession] = useState(null)
  const [currentPage, setCurrentPage] = useState("home")
  const [taskItems, setTaskItems] = useState([]);
  const [habitHistory, setHabitHistory] = useState({})
  const [habitStats, setHabitStats] = useState({})
  const [embersStats, setEmberStats] = useState({})
  const [lastAnalyzedTime, setLastAnalyzedTime] = useState(null)
  const [selectedTheme, setSelectedTheme] = useState("Thrive Blue")
  const [userSettings, setUserSettings] = useState(USER_INIT_SETTINGS)
  const { ColorState, setColorState } = useColorsStateContext();
  // const [ColorState, setColorState] = useState('Hello from Context!');

  // const [dataIsFetched, setDataIsFetched] = useState(true)
  const tasksPageRef = useRef();
  // authorize user into session
  useEffect(() => {


    const updateSession = async () => {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        setSession(session)
        console.log("noticed a change in session")
        if (session && session.user) {
          console.log("user logged in!")
          console.log("fetching data for " + session.user.email)
          await supabaseLoadUserSettings({ "user": session.user, setUserSettings, setColorState })
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
      console.info("onAuthStateChange: " + event)
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


  useEffect(() => {
    updateEmberStats(setEmberStats, taskItems, habitHistory, habitStats);
  }, [taskItems, habitHistory])


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

  // var MySettingsPage = () => {
  //   return (
  //     <View style={{ backgroundColor: Color.DarkestBlue, width: "100%", height: "100%" }}>
  //     </View>
  //   );
  // }

  var myNavBar = <NavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />

  return (
    <>
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
                emberStats={embersStats}
              />
            </>
          }
          {currentPage == "settings" &&
            <>
              <SettingsPage signOutUser={signOutUser} userSettings={userSettings} setUserSettings={setUserSettings}  selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme} />
            </>

          }
          {currentPage == "stats" &&
            <>
              <StatsPage habitStats={habitStats} taskItems={taskItems} habitHistory={habitHistory} setHabitStats={setHabitStats} />
            </>
          }
          {currentPage == "AI" &&
            <>
              <AIPage taskItems={taskItems} lastAnalyzedTime={lastAnalyzedTime} setLastAnalyzedTime={setLastAnalyzedTime} />
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
          <>
            <Auth setCurrentPage={setCurrentPage}/>
          </>
        )
      }
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.gestureHandler}>
      <ColorsStateProvider>
        <MainApp />
      </ColorsStateProvider>
    </GestureHandlerRootView>

  );
}

const styles = StyleSheet.create({
  gestureHandler: {
    flex: 1,
  }
});