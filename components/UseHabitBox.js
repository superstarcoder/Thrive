import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import Color from '../assets/themes/Color'
import {StyledH1, StyledH2, StyledH3, StyledH4, fontStyles, loadFonts} from './text/StyledText';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import CheckBox from './FormComponents/CheckBox';
import * as Haptics from 'expo-haptics';
import { ACTIONS } from './MyGlobalVars';

const UseHabitBox = ({dispatch, selected}) => {

  // const [selected, setSelected] = useState(false)

  // const setCheckValue = (value) => {
  //   setSelected(value)
  //   console.log("set check value to: "+value)
  // }

  // useEffect(() => {
  //   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  //   onChange(selected)
  // }, [selected])

  return (
    <View style={styles.inputBox}>
      <StyledH2 text={"Use as a habit:"} style={styles.inputTitle}/>
      <CheckBox onChange={(value) => {dispatch({type: ACTIONS.UPDATE_IS_HABIT, payload: {isHabit: value}})}} checked={selected}/>
    </View>
  )
}

export default UseHabitBox

const styles = StyleSheet.create({
  inputBox: {
    backgroundColor: Color.DarkestBlue,
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
})