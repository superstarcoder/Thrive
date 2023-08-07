import 'react-native-url-polyfill/auto'
import React, {useState, useRef, useCallback, useEffect} from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Modal, Button } from 'react-native';
import Task from './components/Task';
import Color from './assets/themes/Color'
import {StyledH1, StyledH2, StyledH3, StyledH4, fontStyles} from './components/text/StyledText';
// import { XCircle } from 'phosphor-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font'
import * as Haptics from "expo-haptics"
import TaskSettingsModal from './components/TaskSettingsModal';
import { LogBox } from 'react-native';
import { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import Auth from './components/Auth';

// import 'react-native-url-polyfill/auto'
// import { createClient } from "@supabase/supabase-js";
// import AsyncStorage from "@react-native-async-storage/async-storage";


// const supabase = createClient("https://yzbfybzztgrtnagvvmzv.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6YmZ5Ynp6dGdydG5hZ3Z2bXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTExNzQxMDcsImV4cCI6MjAwNjc1MDEwN30.Yyja16-OfD98Z37i25zO5YSMOFqK6N4ZVQpuUETPQfE"
//  , {auth: {
//     storage: AsyncStorage,
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//   }},
// );


export default function App() {
  const [task, setTask] = useState(null);
  const [session, setSession] = useState(null)

  const [taskItems, setTaskItems] = useState([]);

  supabase
  .channel('any')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'Tasks' }, payload => {
    console.log('Change received!', payload)
  })
  .subscribe()

  // async function getTaskItems() {
  //   const { data } = await supabase.from("Tasks").select();
  //   setTaskItems(data);
  //   console.log(data)
  // }

  // const [dbTasks, setDbTasks] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
}, [])


  const signOutUser = async () => {
    if (session.user && session) {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
    }
  }

  const onSave = async (newTaskSettings) => {
    console.log(newTaskSettings)
    setTaskItems([...taskItems, newTaskSettings])


    let taskSettingsCopy = {...newTaskSettings} 
    taskSettingsCopy["dueDate"] = newTaskSettings["dueDate"].toISOString()
    taskSettingsCopy["email"] = session.user.email
    delete taskSettingsCopy["id"]


    console.log("adding task: "+taskSettingsCopy)

    const { error } = await supabase
    .from('Tasks')
    .insert(taskSettingsCopy)

    console.log("error adding task?: "+error)
  }

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy)
  }

  const onAddTask = () => {
    // initializeBottomSheet();
    // setInitialSettings(defaultSettings)
    taskSettingsRef?.current?.showAddTaskModal()
  }

  const onEditTask = (taskSettings) => {
    taskSettingsRef?.current?.showEditTaskModal(taskSettings)
    // getTaskItems()
  }

  const onEditTaskComplete = (taskSettingsEdited) => {
    const oldTask = taskItems.find(x => x.id == taskSettingsEdited.id)

    let taskItemsCopy = [...taskItems]
    const index = taskItemsCopy.indexOf(oldTask)
    if (index == -1) {
      console.error("App.js: onEditTaskComplete: unable to edit task since task is not found in array state")
    }
    taskItemsCopy[index] = taskSettingsEdited //replace 1st occurance of this task
    setTaskItems(taskItemsCopy)
    console.log("edited")
  }

  const onDelete = (taskSettingsToDelete) => {
    const oldTask = taskItems.find(x => x.id == taskSettingsToDelete.id)

    let taskItemsCopy = [...taskItems]
    const index = taskItemsCopy.indexOf(oldTask)
    if (index == -1) {
      console.error("App.js: onEditTaskComplete: unable to dlete task since task is not found in array state")
    }
    taskItemsCopy.splice(index, 1) //delete 1st occurance of this task
    setTaskItems(taskItemsCopy)
    console.log("deleted")
  }


  // const bottomSheetRef = useRef(null)
  const taskSettingsRef = useRef();

  // const initializeBottomSheet = useCallback(() => {

  //   const isActive = bottomSheetRef?.current?.isActive()
  //   bottomSheetRef?.current?.scrollTo(1)
  // }, [])

  var [fontsLoaded] = useFonts({
    "MPlusRegular": require("./assets/fonts/mplusRegular.ttf"),
    "MPlusMedium": require("./assets/fonts/mplusMedium.ttf")
  })

  // const defaultSettings = {title: "", duration: 0, importance: 0, description: "", isHabit: false, repeatDays: {}, dueDate: new Date(), includeOnlyTime: false}
  // const [initialSettings, setInitialSettings] = useState(defaultSettings)


  if (!fontsLoaded) {
    return null
  }


  return (
    
      <GestureHandlerRootView style={{flex: 1}}>
        {session && session.user ? (

        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1
            }}
            keyboardShouldPersistTaps='handled'
          >

          <View style={styles.tasksWrapper}>
            <StyledH1 style={styles.sectionTitle} text={"Today's tasks"}/>
            <View style={styles.items}>
              {
                taskItems.map((task, index) => {
                  return (
                    <TouchableOpacity key={index}  onPress={() => {onEditTask(task)}}>
                      <Task text={task.title} priority={task.importance} duration={task.duration} description={task.description} points={parseFloat(task.importance)+parseFloat(task.duration)}/> 
                    </TouchableOpacity>
                  )
                })
              }
            </View>
          </View>
            
          </ScrollView>

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
  container: {
    flex: 1,
    backgroundColor: Color.DarkestBlue,
  },
  text: {
    color: Color.White,
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
  },
  items: {
    marginTop: 30,
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