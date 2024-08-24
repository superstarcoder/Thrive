import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import BottomSheet from '../../FormComponents/BottomSheet';
import { forwardRef, useRef, useImperativeHandle, useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Trash, XCircle, CheckCircle, Check, Circle } from 'phosphor-react-native';
import { StyledH2, fontStyles } from '../../text/StyledText';
import { Square, CheckSquare, XSquare, Placeholder, PencilSimpleLine } from 'phosphor-react-native';
import { supabaseDeleteTask } from '../TasksPageSupabase';
import { useColorsStateContext } from '../../ColorContext';


const HabitApplyModal = forwardRef(({ }, ref) => {

  const heightPercent = 0.8
  useEffect(() => {
    bottomSheetRef?.current?.scrollTo(0)
  }, [])
  const bottomSheetRef = useRef(null)


  const [onConfirmEditsComplete, setOnConfirmEditsComplete] = useState()
  const [taskSettingsEdited, setTaskSettingsEdited] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [scrollingEnabled, setScrollingEnabled] = useState(true)
  const [loadingString, setLoadingString] = useState("")
  const { ColorState, setColorState } = useColorsStateContext();
  const styles = getDynamicStyles(ColorState)


  useImperativeHandle(ref, () => ({
    showHabitApplyModal(onConfirmEditsCompleteArg, taskSettingsEditedArg) {
      bottomSheetRef?.current?.scrollTo(heightPercent)
      setOnConfirmEditsComplete(() => onConfirmEditsCompleteArg)
      setTaskSettingsEdited(taskSettingsEditedArg)
    },
    disableScrolling() {
      setScrollingEnabled(false)
    },
    enableScrolling() {
      setScrollingEnabled(true)
    }
  }));

  const hideModal = () => {
    bottomSheetRef?.current?.scrollTo(0)
  }

  const onSavePress = async () => {
    setIsLoading(true)
    await onConfirmEditsComplete(taskSettingsEdited, optionSelected, setLoadingString)
    setIsLoading(false)
    hideModal()
  }

  const [optionSelected, setOptionSelected] = useState("edit_selected_habit") // or edit_selected_and_upcoming or edit_all

  return (

    <BottomSheet ref={bottomSheetRef} customStyle={styles.taskMenuModal} clamps={[0, heightPercent]} scrollingEnabled={scrollingEnabled}>

      <View style={styles.taskMenuContainer}>
        <View style={styles.myTitle}>
          <Text style={[fontStyles.styledH1, { color: ColorState?.TextColorOnGrayBlueBg }]}>Apply Edits For:</Text>
          <Text style={[fontStyles.styledH2, { color: ColorState?.BlueAccent }]}>({taskSettingsEdited?.title})</Text>
        </View>


        <View style={styles.optionsContainer}>
          <TouchableOpacity onPress={() => setOptionSelected("edit_selected_habit")}>
            <View style={styles.markAsButton}>

              {optionSelected == "edit_selected_habit" ? (
                <CheckCircle size={30} weight="fill" color={ColorState?.GreenAccent} style={styles.buttonIcon} />
              ) : (
                <Circle size={30} weight="fill" color={"white"} style={styles.buttonIcon} />
              )}

              <Text style={[fontStyles.styledH3, styles.buttonText2]}>Selected habit event</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setOptionSelected("edit_selected_and_upcoming")}>
            <View style={styles.markAsButton}>
              {optionSelected == "edit_selected_and_upcoming" ? (
                <CheckCircle size={30} weight="fill" color={ColorState?.GreenAccent} style={styles.buttonIcon} />
              ) : (
                <Circle size={30} weight="fill" color={"white"} style={styles.buttonIcon} />
              )}

              <Text style={[fontStyles.styledH3, styles.buttonText2]}>Selected and all upcoming habit events</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setOptionSelected("edit_all")}>
            <View style={styles.markAsButton}>
              {optionSelected == "edit_all" ? (
                <CheckCircle size={30} weight="fill" color={ColorState?.GreenAccent} style={styles.buttonIcon} />
              ) : (
                <Circle size={30} weight="fill" color={"white"} style={styles.buttonIcon} />
              )}
              <Text style={[fontStyles.styledH3, styles.buttonText2]}>All habit events (old habit setting will be replaced)</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.userButtons}>
          {scrollingEnabled &&
            <TouchableOpacity onPress={hideModal}>
              <View style={styles.cancelTaskButton}>
                <Text style={[fontStyles.styledH1, styles.buttonText]}>Cancel</Text>
                <XCircle size={30} weight="bold" color={"black"} style={styles.buttonIcon} />
              </View>
            </TouchableOpacity>
          }

          <TouchableOpacity onPress={onSavePress}>
            <View style={styles.saveButton}>
              <Text style={[fontStyles.styledH1, styles.buttonText]}>Save</Text>
              {isLoading &&
                <ActivityIndicator size="large" color={ColorState?.DarkestBlue} />
              }
              {/* <XCircle size={30} weight="bold" color={"black"} style={styles.buttonIcon} /> */}
            </View>
          </TouchableOpacity>
        </View>
        {!scrollingEnabled &&
          <View style={styles.loadingStringContainer}>
            <StyledH2 text={loadingString} style={styles.loadingStringText} />
          </View>
        }
      </View>
    </BottomSheet>
  );
});

export default HabitApplyModal


const getDynamicStyles = (ColorState) => ({
  myTitle: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  userButtons: {
    flexDirection: "row",
    gap: 18,
  },
  loadingStringContainer: {
    display: "flex",
    alignItems: "center",
  },
  loadingStringText: {
    color: ColorState?.TextColor

  },
  taskMenuModal: {
    backgroundColor: ColorState?.GrayBlue,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.74,
    shadowRadius: 20,  // Adjusted to give a similar effect
    elevation: 24,       // For Android shadow (optional, based on testing)
  },
  taskMenuContainer: {
    paddingHorizontal: 25,
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 35,
    paddingBottom: 370,
    justifyContent: "center"

  },
  optionsContainer: {
    alignItems: "center",
    gap: 15,
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
    paddingVertical: 15,
    gap: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
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
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: ColorState?.Blue,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: ColorState?.GreenAccent,
    borderRadius: 12,
    justifyContent: 'center',
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
    color: "#000"
  },
  buttonText2: {
    textAlign: "center",
    color: "#CFD6FC",
  }
});