import React, {useState, useRef, useCallback,  forwardRef, useImperativeHandle, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Modal, Button } from 'react-native';
import Color from '../assets/themes/Color'
import {StyledH1, StyledH2, StyledH3, StyledH4, fontStyles} from './text/StyledText';
import { useFonts } from 'expo-font'
import BottomSheet from './BottomSheet';
import TitleBox from './TitleBox';
import DurationBox from './DurationBox'
import ImportanceBox from './ImportanceBox';
import DescriptionBox from './DescriptionBox';
import UseHabitBox from './UseHabitBox';
import RepeatBox from './RepeatBox';
import DueDatePickerBox from './DueDatePickerBox';
import { Trash, XCircle, CheckCircle} from 'phosphor-react-native';
import * as Haptics from "expo-haptics"

const TaskSettingsModal = forwardRef ((props, ref) => {

  useImperativeHandle(ref, () => ({

    showTaskSettings () {
      const isActive = bottomSheetRef?.current?.isActive()
      bottomSheetRef?.current?.scrollTo(1)
    }

  }));

	const bottomSheetRef = useRef(null)

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


  // task structure:
  const initialSettings = {title: "", duration: 0, importance: 0, description: "", isHabit: false, repeatDays: {}, dueDate: new Date(), includeOnlyTime: false}
  const [currentSettings, setCurrentSettings] = useState(initialSettings)

  // functions to update form states

  const updateTitle = (title) => {
    settingsCopy = {...currentSettings}
    settingsCopy.title = title
    setCurrentSettings(settingsCopy)
  }

  const updateDuration = (duration) => {
    settingsCopy = {...currentSettings}
    settingsCopy.duration = duration
    setCurrentSettings(settingsCopy)
  }

  const updateImportance = (importance) => {

    console.log(importance)
    settingsCopy = {...currentSettings}
    settingsCopy.importance = importance
    setCurrentSettings(settingsCopy)
  }

  const updateDescription = (description) => {
    settingsCopy = {...currentSettings}
    settingsCopy.description = description
    setCurrentSettings(settingsCopy)
  }

  const updateIsHabit = (isHabit) => {
    settingsCopy = {...currentSettings}
    settingsCopy.isHabit = isHabit
    setCurrentSettings(settingsCopy)
  }

  const updateRepeat = (repeatDays) => {
    settingsCopy = {...currentSettings}
    settingsCopy.repeatDays = repeatDays
    setCurrentSettings(settingsCopy)
  }

  useEffect(() => {
    console.log(currentSettings)
  }, [currentSettings])

  const updateDueDate = (dueDateObject, includeOnlyTime) => {
    // console.log("settings update: ")
    // console.log(dueDateObject.toLocaleDateString())
    // console.log(dueDateObject.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }))
    settingsCopy = {...currentSettings}
    settingsCopy.dueDate = dueDateObject
    settingsCopy.includeOnlyTime = includeOnlyTime
    setCurrentSettings(settingsCopy)
  }

	return (
	<BottomSheet ref={bottomSheetRef} test="yo i am a prop" customStyle={styles.addTaskModal} clamps={[0, 0.5, 1]} scrollingEnabled={false}>

	{/* <KeyboardAvoidingView behavior="padding" enabled> */}
		<ScrollView style={[styles.addTaskModalSettings]}>
		  <TitleBox onChange={updateTitle}/>
		  <DurationBox onChange={updateDuration}/>
		  <ImportanceBox onChange={updateImportance}/>
		  <DescriptionBox onChange={updateDescription}/>
		  <StyledH1 style={styles.settingsTitle} text={"Habit Settings"}/>
		  <UseHabitBox onChange={updateIsHabit}/>
		  <RepeatBox onChange={updateRepeat}/>
		  <StyledH1 style={styles.settingsTitle} text={"Advanced"}/>
		  <DueDatePickerBox onChange={updateDueDate}/>
		</ScrollView>

	  {/* </ KeyboardAvoidingView > */}
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
	);
});

export default TaskSettingsModal

const styles = StyleSheet.create({

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

})