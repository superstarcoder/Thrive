import React, {useState, useRef, useCallback} from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Modal } from 'react-native';
import Task from './components/Task';
import Color from './assets/themes/Color'
import {StyledH1, StyledH2, StyledH3, StyledH4} from './components/text/StyledText';
import { XCircle } from 'phosphor-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from './components/BottomSheet';
import InputBox from './components/InputBox';
import DurationBox from './components/DurationBox'
import ImportanceBox from './components/ImportanceBox';


export default function App() {
  const [task, setTask] = useState(null);
  const [taskItems, setTaskItems] = useState([]);

  const handleAddTask = () => {
    if (task != null) {
      Keyboard.dismiss();
      setTaskItems([...taskItems, task])
      setTask(null);
      this.textInput.clear()
    }
  }

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy)
  }

  const onButtonPress = () => {
    handleAddTask();
    initializeBottomSheet();
  }


  const bottomSheetRef = useRef(null)

  const initializeBottomSheet = useCallback(() => {

    const isActive = bottomSheetRef?.current?.isActive()
    bottomSheetRef?.current?.scrollTo(0.5)
  }, [])

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
                    <Task text={task.text} priority={task.priority} duration={task.duration}/> 
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
        <BottomSheet ref={bottomSheetRef} test="yo i am a prop" customStyle={styles.addTaskModal} clamps={[0, 0.5, 1]}>
          {/* <ScrollView style={{display: "flex", flexDirection: "column"}}> */}
            <InputBox />
            <DurationBox />
            <ImportanceBox />
          {/* </ScrollView> */}
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({


  container: {
    flex: 1,
    backgroundColor: Color.DarkestBlue,
  },
  addTaskModal: {
		backgroundColor: Color.GrayBlue,
    paddingHorizontal: 30,
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
  addText: {},
});