import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import React, {useState, useRef, useEffect, useCallback} from 'react';
// import CheckBox from '../FormComponents/CheckBox';
import {StyledH1, StyledH2, StyledH3, StyledH4, fontStyles, loadFonts} from '../../text/StyledText';
import Color from '../../../assets/themes/Color'
import HighlightSelect from '../../FormComponents/HighlightSelect';
import * as Haptics from 'expo-haptics';
import { ACTIONS } from '../../../utils/Actions_TaskSettingsModal';

const RepeatBox = ({dispatch, repeatDays}) => {

  const updateSelectedList = (value, text) => {
    dispatch({type: ACTIONS.SINGLE_UPDATE_REPEAT_DAYS, payload: {dayInt: text, selected: value}})
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  return (
    <View style={styles.inputBox}>
      <StyledH2 text={"Repeat"} style={styles.inputTitle}/>
      <View style={styles.multiSelect}>
        <HighlightSelect text="Mon" onChange={updateSelectedList} selected={repeatDays[0]}/>
        <HighlightSelect text="Tue" onChange={updateSelectedList} selected={repeatDays[1]}/>
        <HighlightSelect text="Wed" onChange={updateSelectedList} selected={repeatDays[2]}/>
        <HighlightSelect text="Thu" onChange={updateSelectedList} selected={repeatDays[3]}/>
        <HighlightSelect text="Fri" onChange={updateSelectedList} selected={repeatDays[4]}/>
        <HighlightSelect text="Sat" onChange={updateSelectedList} selected={repeatDays[5]}/>
        <HighlightSelect text="Sun" onChange={updateSelectedList} selected={repeatDays[6]}/>
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