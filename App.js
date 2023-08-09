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


export default function App() {
  const [task, setTask] = useState(null);
  const [session, setSession] = useState(null)

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

    let newTaskItems = []
    for (const task of data) {
      task["dueDate"] = new Date(task["dueDate"])
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

    console.log("deleting: "+taskSettingsToDelete.id)
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

  return (
    
      <GestureHandlerRootView style={{flex: 1}}>
        {session && session.user ? (

        <View style={styles.container}>

          {/* display tasks */}
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
                      <Task taskId={task.id} onComplete={onComplete} complete={task.complete} text={task.title} priority={task.importance} duration={task.duration} description={task.description} points={parseFloat(task.importance)+parseFloat(task.duration)}/> 
                    </TouchableOpacity>
                  )
                })
              }
            </View>
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