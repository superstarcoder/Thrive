import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import BottomSheet from '../../FormComponents/BottomSheet';
import { forwardRef, useRef, useImperativeHandle, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Trash, XCircle, CheckCircle } from 'phosphor-react-native';
import { fontStyles } from '../../text/StyledText';
import { Square, CheckSquare, XSquare, Placeholder, PencilSimpleLine } from 'phosphor-react-native';
import { supabaseDeleteTask } from '../TasksPageSupabase';
import { useColorsStateContext } from '../../ColorContext';


const TaskMenu = forwardRef(({ supabase, taskItems, setTaskItems, habitHistory, setHabitHistory, setHabitStats }, ref) => {
  const { ColorState, setColorState } = useColorsStateContext();
  const styles = getDynamicStyles(ColorState)

  const heightPercent = 0.8
  useEffect(() => {
    bottomSheetRef?.current?.scrollTo(0)
  }, [])
  const bottomSheetRef = useRef(null)
  const [taskSettings, setTaskSettings] = useState()
  const [habitHistoryEntry, setHabitHistoryEntry] = useState()
  const [onEditTask, setOnEditTask] = useState()
  const [onCheckBoxPressed, setOnCheckBoxPressed] = useState()

  useImperativeHandle(ref, () => ({
    showTaskMenuModal(taskSettingsArg, habitHistoryEntryArg, onEditTaskArg, onCheckBoxPressedArg) {
      bottomSheetRef?.current?.scrollTo(heightPercent)
      setTaskSettings(taskSettingsArg)
      setHabitHistoryEntry(habitHistoryEntryArg)
      setOnEditTask(() => onEditTaskArg)
      setOnCheckBoxPressed(() => onCheckBoxPressedArg)
    }
  }));

  const onCancelPress = () => {
    bottomSheetRef?.current?.scrollTo(0)
  }

  const onDeletePress = async () => {
    onCancelPress();
    await supabaseDeleteTask(taskSettings.id, taskSettings.isHabit, setTaskItems, taskItems, habitHistory, setHabitHistory, setHabitStats)
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

  const onEditPressedWrapper = () => {
    onCancelPress();
    onEditTask(taskSettings, habitHistoryEntry, habitHistoryEntry)
  }

  return (

    <BottomSheet ref={bottomSheetRef} customStyle={styles.taskMenuModal} clamps={[0, heightPercent]} scrollingEnabled={true}>

      <View style={styles.taskMenuContainer}>
        <Text style={[fontStyles.styledH1, { color: ColorState?.TextColorOnGrayBlueBg, }]}>Mark As:</Text>

        <TouchableOpacity onPress={onMarkAsCompletePressed}>
          <View style={styles.markAsButton}>
            <Text style={[fontStyles.styledH1, styles.buttonText2]}>Complete</Text>
            <CheckSquare size={38} weight="fill" color={ColorState?.GreenAccent} style={styles.checkBoxIcon} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={onMarkAsIncompletePressed}>
          <View style={styles.markAsButton}>
            <Text style={[fontStyles.styledH1, styles.buttonText2]}>Incomplete</Text>
            <XSquare size={38} weight="fill" color={ColorState?.RedAccent} style={[styles.checkBoxIcon, { borderColor: "black" }]} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={onMarkAsExemptPressed}>
          <View style={styles.markAsButton}>
            <Text style={[fontStyles.styledH1, styles.buttonText2]}>Exempt</Text>
            <Placeholder size={38} weight="fill" color={ColorState?.BlueAccent} style={[styles.checkBoxIcon, { borderColor: "black" }]} />
          </View>
        </TouchableOpacity>

        <View style={styles.taskMenuButtons}>

          <TouchableOpacity onPress={onEditPressedWrapper}>
            <View style={styles.editTaskButton}>
              <Text style={[fontStyles.styledH1, styles.buttonText]}>Edit</Text>
              <PencilSimpleLine size={25} weight="bold" color={ColorState?.IconColor} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={onCancelPress}>
            <View style={styles.cancelTaskButton}>
              <XCircle size={30} weight="bold" color={ColorState?.IconColor} style={styles.buttonIcon} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={onDeletePress}>
            <View style={styles.deleteTaskButton}>
              <Trash size={30} weight="bold" color={ColorState?.IconColor} style={styles.buttonIcon} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
});

export default TaskMenu


const getDynamicStyles = (ColorState) => ({
  taskMenuModal: {
    backgroundColor: ColorState?.GrayBlue,
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
    backgroundColor: ColorState?.DarkestBlue,
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
    backgroundColor: ColorState?.GreenAccent,
    width: 100,
    height: 45,
    borderRadius: 12,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: "row",
  },
  cancelTaskButton: {
    backgroundColor: ColorState?.BlueAccent,
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    marginRight: 20,
    alignItems: 'center',
  },
  deleteTaskButton: {
    backgroundColor: ColorState?.RedAccent,
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: ColorState?.IconColor
  },
  buttonText2: {
    color: ColorState?.TextColorOnBg,
    marginRight: "auto",
  }
});