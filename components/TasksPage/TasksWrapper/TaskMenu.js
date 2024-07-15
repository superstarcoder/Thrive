import { View, Text, StyleSheet, ScrollView } from 'react-native'
import Color from '../../../assets/themes/Color';
import React, { useEffect } from 'react'
import BottomSheet from '../../FormComponents/BottomSheet';
import { forwardRef, useRef, useImperativeHandle, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Trash, XCircle, CheckCircle } from 'phosphor-react-native';
import { fontStyles } from '../../text/StyledText';
import { Square, CheckSquare, XSquare, Placeholder, PencilSimpleLine } from 'phosphor-react-native';
import { supabaseDeleteTask } from '../TasksPageSupabase';


const TaskMenu = forwardRef(({supabase, taskItems, setTaskItems, habitHistory, setHabitHistory}, ref) => {

  const heightPercent = 0.8 
  useEffect(() => {
    bottomSheetRef?.current?.scrollTo(0)
  }, [])
  const bottomSheetRef = useRef(null)
  const [taskSettings, setTaskSettings] = useState()
  const [habitHistoryEntry, setHabitHistoryEntry] = useState()
  const [onEditPressed, setOnEditPressed] = useState()
  const [onCheckBoxPressed, setOnCheckBoxPressed] = useState()

  useImperativeHandle(ref, () => ({
    showTaskMenuModal(taskSettingsArg, habitHistoryEntryArg, onEditPressedArg, onCheckBoxPressedArg) {
      bottomSheetRef?.current?.scrollTo(heightPercent)
      setTaskSettings(taskSettingsArg)
      setHabitHistoryEntry(habitHistoryEntryArg)
      setOnEditPressed(() => onEditPressedArg)
      setOnCheckBoxPressed(() => onCheckBoxPressedArg)
    }
  }));

  const onCancelPress = () => {
    bottomSheetRef?.current?.scrollTo(0)
  }

  const onDeletePress = async () => {
    onCancelPress();
    await supabaseDeleteTask(taskSettings.id, taskSettings.isHabit, setTaskItems, taskItems, habitHistory, setHabitHistory)
  }

  const onMarkAsCompletePressed = () => {
    onCancelPress();
    onCheckBoxPressed(taskSettings.id, taskSettings.isHabit, habitHistoryEntry, "complete")
  }

  const onMarkAsIncompletePressed = () => {
    onCancelPress();
    let newStatus
    if (!taskSettings.isHabit) {
      newStatus = "incomplete_ignored"
    } else {
      newStatus = "incomplete"
    }
    onCheckBoxPressed(taskSettings.id, taskSettings.isHabit, habitHistoryEntry, newStatus)
  }

  const onMarkAsExemptPressed = () => {
    onCancelPress();
    onCheckBoxPressed(taskSettings.id, taskSettings.isHabit, habitHistoryEntry, "exempt")
  }

  return (

    <BottomSheet ref={bottomSheetRef} customStyle={styles.taskMenuModal} clamps={[0, heightPercent]} scrollingEnabled={true}>

      <View style={styles.taskMenuContainer}>
        <Text style={[fontStyles.styledH1, {color: "#CFD6FC",}]}>Mark As:</Text>

        <TouchableOpacity onPress={onMarkAsCompletePressed}>
          <View style={styles.markAsButton}>
            <Text style={[fontStyles.styledH1, styles.buttonText2]}>Complete</Text>
            <CheckSquare size={38} weight="fill" color={Color.GreenAccent} style={styles.checkBoxIcon}/>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={onMarkAsIncompletePressed}>
          <View style={styles.markAsButton}>
            <Text style={[fontStyles.styledH1, styles.buttonText2]}>Incomplete</Text>
            <XSquare size={38} weight="fill" color={Color.RedAccent} style={[styles.checkBoxIcon, {borderColor: "black"}]}/>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={onMarkAsExemptPressed}>
          <View style={styles.markAsButton}>
            <Text style={[fontStyles.styledH1, styles.buttonText2]}>Exempt</Text>
            <Placeholder size={38} weight="fill" color={Color.BlueAccent} style={[styles.checkBoxIcon, {borderColor: "black"}]}/>
          </View>
        </TouchableOpacity>
        
        <View style={styles.taskMenuButtons}>

          <TouchableOpacity onPress={() => {onCancelPress(); onEditPressed(taskSettings)}}>
            <View style={styles.editTaskButton}>
              <Text style={[fontStyles.styledH1, styles.buttonText]}>Edit</Text>
              <PencilSimpleLine  size={25} weight="bold" color={"black"} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={onCancelPress}>
            <View style={styles.cancelTaskButton}>
              <XCircle size={30} weight="bold" color={"black"} style={styles.buttonIcon} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={onDeletePress}>
            <View style={styles.deleteTaskButton}>
              <Trash size={30} weight="bold" color={"black"} style={styles.buttonIcon} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
});

export default TaskMenu

const styles = StyleSheet.create({
  taskMenuModal: {
    backgroundColor: Color.GrayBlue,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.74,
    shadowRadius: 20,  // Adjusted to give a similar effect
    elevation: 24,       // For Android shadow (optional, based on testing)
  },
  taskMenuContainer: {
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 22,
    paddingBottom: 370,
    justifyContent: "center"
    
  },
  addTaskModalSettings: {
    flexDirection: "column",
    paddingHorizontal: 30,
  },
  markAsButton: {
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 25,
    gap: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    height: 70,
    width: 250,
    backgroundColor: Color.DarkestBlue,
  },
  cancelButton: {

  },
  taskMenuButtons: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "center",
  },
  editTaskButton: {
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
  buttonText: {
    color: "#000"
  },
  buttonText2: {
    color: "#CFD6FC",
    marginRight: "auto",
  }
})