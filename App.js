import React, {useState, useRef, useCallback} from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Modal, Button } from 'react-native';
import Task from './components/Task';
import Color from './assets/themes/Color'
import {StyledH1, StyledH2, StyledH3, StyledH4, fontStyles} from './components/text/StyledText';
// import { XCircle } from 'phosphor-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font'
import BottomSheet from './components/BottomSheet';
import TitleBox from './components/TitleBox';
import DurationBox from './components/DurationBox'
import ImportanceBox from './components/ImportanceBox';
import DescriptionBox from './components/DescriptionBox';
import UseHabitBox from './components/UseHabitBox';
import RepeatBox from './components/RepeatBox';
import DueDatePickerBox from './components/DueDatePickerBox';
import { Trash, XCircle, CheckCircle} from 'phosphor-react-native';
import * as Haptics from "expo-haptics"


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
    bottomSheetRef?.current?.scrollTo(1)
  }, [])

  var [fontsLoaded] = useFonts({
    "MPlusRegular": require("./assets/fonts/mplusRegular.ttf"),
    "MPlusMedium": require("./assets/fonts/mplusMedium.ttf")
  })
  if (!fontsLoaded) {
    return null
  }


  const onSavePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    bottomSheetRef?.current?.scrollTo(0)
  }
  const onCancelPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    bottomSheetRef?.current?.scrollTo(0)
  }
  const onDeletePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    bottomSheetRef?.current?.scrollTo(0)
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
        <BottomSheet ref={bottomSheetRef} test="yo i am a prop" customStyle={styles.addTaskModal} clamps={[0, 0.5, 1]} scrollingEnabled={false}>

          <ScrollView style={styles.addTaskModalSettings} scrollEnabled={true}>
            <TitleBox />
            <DurationBox />
            <ImportanceBox />
            <DescriptionBox />
            <StyledH1 style={styles.settingsTitle} text={"Habit Settings"}/>
            <UseHabitBox />
            <RepeatBox />
            <StyledH1 style={styles.settingsTitle} text={"Advanced"}/>
            <DueDatePickerBox />
          </ScrollView>
          <View style={styles.addTaskModalButtons}>
              <TouchableOpacity onPress={onSavePress}>
                <View style={styles.saveTaskButton}>
                  <Text style={[fontStyles.styledH1, styles.buttonText]}>Save</Text>
                  {/* <CheckCircle size={30} weight="bold" color={"black"} style={styles.saveButtonIcon} /> */}
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={onCancelPress}>
                <View style={styles.cancelTaskButton}>
                  {/* <Text style={[fontStyles.styledH1, styles.buttonText]}>Cancel</Text> */}
                  <XCircle size={30} weight="bold" color={"black"} style={styles.buttonIcon} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={onDeletePress}>
                <View style={styles.deleteTaskButton}>
                  <Trash size={30} weight="bold" color={"black"} style={styles.buttonIcon} />
                </View>
              </TouchableOpacity>
            
            </View>
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
  buttonText: {
    color: "#000"
  },
  saveButtonIcon: {
    marginLeft: 5,
  },
  settingsTitle: {
    alignSelf: "center",
    marginBottom: 25,
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
  addTaskModalButtons: {
    backgroundColor: Color.GrayBlue,
    height: 90,
    marginBottom: 25,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    // position: "absolute",
    alignSelf: "center",
    bottom: 25,
    width: "100%",
    marginTop: 25,
    shadowColor: "black",
    shadowOpacity: 0.2,
    paddingBottom: 10,
  },
  addTaskModalSettings: {
    flexDirection: "column",
    // backgroundColor: Color.Gray,
    paddingHorizontal: 30,
  },
  addTaskModal: {
		backgroundColor: Color.GrayBlue,
    // paddingHorizontal: 30,
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