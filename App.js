// import { TasksPage } from './components/TasksPage/TasksPage';
import TasksPage from './components/TasksPage/TasksPage';
// import TasksHeader from './components/TasksHeader';
import 'react-native-url-polyfill/auto'
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font'
import { supabase } from './lib/supabase'
import Auth from './components/AuthPage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Color from './assets/themes/Color';
import { Gear, House, Trash, XCircle, Robot, Sparkle } from 'phosphor-react-native';



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
        console.info("inside authstatechange: unable to fetch data since user is not logged in for some reason!")
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

  var MyTasksPage = () => {
    return (
      <>
        <TasksPage 
        signOutUser={signOutUser}
        session={session}  ref={tasksPageRef} supabase={supabase} />
      </>
    );
  }

  var MySettingsPage = () => {
    return (
      <View style={{backgroundColor: Color.DarkestBlue, width: "100%", height: "100%"}}>
      </View>
    );
  }

  return (

    // <NavigationContainer style={{margin: 0}}>


      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* <BackgroundImg /> */}
        {session && session.user ? (
          
          
        // <Tab.Navigator
        // screenOptions={({ route }) => ({
        //   tabBarStyle: {
        //     backgroundColor: Color.DarkBlue,
        //     borderRadius: 0,
        //     borderWidth: 0,
        //   },
        //   headerShown: false,
        //   tabBarIcon: ({ focused, color, size }) => {
        //     let my_icon;

        //     if (route.name === 'Home') {
        //       my_icon = focused
        //         ? <House size={30} weight="fill" color={"white"} style={styles.buttonIcon} />
        //         : <House size={30} weight="regular" color={"white"} style={styles.buttonIcon} />
        //     } else if (route.name === 'Settings') {
        //       my_icon = focused
        //       ? <Gear size={30} weight="fill" color={"white"} style={styles.buttonIcon} />
        //       : <Gear size={30} weight="regular" color={"white"} style={styles.buttonIcon} />;
        //     }

        //     // You can return any component that you like here!
        //     return my_icon;
        //   },
        //   tabBarActiveTintColor: Color.LightBlue,
        //   tabBarInactiveTintColor: 'gray',
        // })}

        // > 
  
        //   <Tab.Screen name="Home" component={MyTasksPage}/>
        //   <Tab.Screen name="Settings" component={MySettingsPage}/>

    
        //   {/* <Tab.Screen name="Settings" component={SettingsScreen} /> */}
    
        // </Tab.Navigator>
        <>

        <TasksPage 
        signOutUser={signOutUser}
        session={session}  ref={tasksPageRef} supabase={supabase} />
          <View style={styles.navbarContainer}>
            <View style={styles.navbar}>
            <TouchableOpacity>
                <View style={styles.settingsButton}>
                  <Gear size={30} weight="bold" color={"black"} style={styles.buttonIcon} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.homeButton}>
                  <House size={30} weight="bold" color={"black"} style={styles.buttonIcon} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.AIButton}>
                  <XCircle size={30} weight="bold" color={"black"} style={styles.buttonIcon} />
                </View>
              </TouchableOpacity>        
              <TouchableOpacity>
                <View style={styles.cancelTaskButton}>
                  <Sparkle size={30} weight="bold" color={"black"} style={styles.buttonIcon} />
                </View>
              </TouchableOpacity>   
            </View>
          </View>
          </>

          ) :
          (<Auth />)
          
          }

      </GestureHandlerRootView>
    // </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  navbarContainer: {
    backgroundColor: Color.GrayBlue,
    height: 90,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  navbar: {
    borderRadius: 30,
    backgroundColor: Color.DarkestBlue,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "center",
    bottom: 0,
    width: "80%",
    shadowColor: "black",
    shadowOpacity: 0.2,
    paddingBottom: 10,
  },
  saveTaskButton: {
    backgroundColor: "hsla(114, 100%, 36%, 1)",
    width: 100,
    height: 45,
    borderRadius: 12,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: "row",
  },
  cancelTaskButton: {
    backgroundColor: Color.Blue,
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeButton: {
    backgroundColor: Color.Blue,
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    marginRight: 20,
    alignItems: 'center',
  },
  AIButton: {
    backgroundColor: Color.Blue,
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    marginRight: 20,
    alignItems: 'center',
  },
  settingsButton: {
    backgroundColor: Color.Blue,
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    marginRight: 20,
    alignItems: 'center',
  },
  deleteTaskButton: {
    backgroundColor: "hsl(0, 81%, 50%)",
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});