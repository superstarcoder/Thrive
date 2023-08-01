import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import Color from '../assets/themes/Color'
import {StyledH1, StyledH2, StyledH3, StyledH4, fontStyles, loadFonts} from './text/StyledText';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import CheckBox from './FormComponents/CheckBox';
import HighlightSelect from './FormComponents/HighlightSelect';
import * as Haptics from 'expo-haptics';
import { ACTIONS } from './MyGlobalVars';

const RepeatBox = ({dispatch, repeatDays}) => {

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  let myDict = {} 
  for (day of daysOfWeek) {
    myDict[day] = "false"
  }
  const updateSelectedList = (value, text) => {
    dispatch({type: ACTIONS.SINGLE_UPDATE_REPEAT_DAYS, payload: {day: text, selected: value}})
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    console.log("yuh")
  }

  return (
    <View style={styles.inputBox}>
      <StyledH2 text={"Repeat"} style={styles.inputTitle}/>
      <View style={styles.multiSelect}>
        <HighlightSelect text="Mon" onChange={updateSelectedList} selected={repeatDays["Mon"]}/>
        <HighlightSelect text="Tue" onChange={updateSelectedList} selected={repeatDays["Tue"]}/>
        <HighlightSelect text="Wed" onChange={updateSelectedList} selected={repeatDays["Wed"]}/>
        <HighlightSelect text="Thu" onChange={updateSelectedList} selected={repeatDays["Thu"]}/>
        <HighlightSelect text="Fri" onChange={updateSelectedList} selected={repeatDays["Fri"]}/>
        <HighlightSelect text="Sat" onChange={updateSelectedList} selected={repeatDays["Sat"]}/>
        <HighlightSelect text="Sun" onChange={updateSelectedList} selected={repeatDays["Sun"]}/>
      </View>
    </View>
  )
}

export default RepeatBox

const styles = StyleSheet.create({
  inputBox: {
    backgroundColor: Color.DarkestBlue,
    borderRadius: 12,
    paddingHorizontal: 27,
    paddingVertical: 20,
    flexDirection: "column",
    marginBottom: 22,
	  justifyContent: "center"
  },
  bottomTextContainer: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  bottomText: {
    marginRight: 5,
    color: Color.Gray
  },
  multiSelect: {
	flexDirection: "row"
  },
  inputTitle: {
	marginBottom: 8,
  }
})