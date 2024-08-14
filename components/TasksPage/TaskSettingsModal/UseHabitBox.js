import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { StyledH1, StyledH2, StyledH3, StyledH4, fontStyles, loadFonts } from '../../text/StyledText';
import Color from '../../../assets/themes/Color'
import CheckBox from '../../FormComponents/CheckBox';
import { ACTIONS } from '../../../utils/Actions_TaskSettingsModal';
import { useColorsStateContext } from '../../ColorContext';


const UseHabitBox = ({ dispatch, selected, repeatDays, dueDate }) => {

  const { ColorState, setColorState } = useColorsStateContext();
  const styles = getDynamicStyles(ColorState)

  return (
    <View style={styles.inputBox}>
      <StyledH2 text={"Use as a habit:"} style={styles.inputTitle} />
      <CheckBox onChange={(value) => { dispatch({ type: ACTIONS.UPDATE_IS_HABIT, payload: { isHabit: value, repeatDays: repeatDays, dueDate: dueDate } }) }} checked={selected} />
    </View>
  )
}

export default UseHabitBox


const getDynamicStyles = (ColorState) => ({
  inputBox: {
    backgroundColor: ColorState?.DarkestBlue,
    borderRadius: 12,
    paddingHorizontal: 27,
    paddingVertical: 20,
    flexDirection: "row",
    marginBottom: 22,
    alignItems: "center"
  },
  inputTitle: {
    marginRight: 10,
  },
  checkBoxIcon: {
  },
});