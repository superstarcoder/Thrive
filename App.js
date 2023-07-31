import React, {useState, useRef, useCallback} from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Modal, Button } from 'react-native';
import Task from './components/Task';
import Color from './assets/themes/Color'
import {StyledH1, StyledH2, StyledH3, StyledH4, fontStyles} from './components/text/StyledText';
// import { XCircle } from 'phosphor-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font'
import * as Haptics from "expo-haptics"
import TaskSettingsModal from './components/TaskSettingsModal';


export default function App() {
  const [task, setTask] = useState(null);
  const [taskItems, setTaskItems] = useState([]);

  const handleAddTask = () => {
    // if (task != null) {
    //   Keyboard.dismiss();
    //   setTaskItems([...taskItems, task])
    //   setTask(null);
    //   this.textInput.clear()
    // }
  }

  const onSave = (newTaskSettings) => {
    setTaskItems([...taskItems, newTaskSettings])
  }

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy)
  }

  const onButtonPress = () => {
    handleAddTask();
    // initializeBottomSheet();
    taskSettingsRef?.current?.showTaskSettings()
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
  if (!fontsLoaded) {
    return null
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
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
                  <TouchableOpacity key={index}  onPress={() => {completeTask(index);}}>
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
          <TouchableOpacity onPress={onButtonPress}>
            <View style={styles.addWrapper}>
              <Text style={styles.addText}>+</Text>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>

        <TaskSettingsModal ref={taskSettingsRef} onSave={onSave} />

      </View>
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