import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import React, { useState, useRef, useEffect, useCallback } from 'react';
// import CheckBox from '../FormComponents/CheckBox';
import { StyledH1, StyledH2, StyledH3, StyledH4, fontStyles, loadFonts } from '../../text/StyledText';
import HighlightSelect from '../../FormComponents/HighlightSelect';
import * as Haptics from 'expo-haptics';
import { ACTIONS } from '../../../utils/Actions_TaskSettingsModal';
import { useColorsStateContext } from '../../ColorContext';


const RepeatBox = ({ dispatch, repeatDays, isHabit, showNote }) => {
  const { ColorState, setColorState } = useColorsStateContext();
  const styles = getDynamicStyles(ColorState)

  const updateSelectedList = (value, text) => {
    dispatch({ type: ACTIONS.SINGLE_UPDATE_REPEAT_DAYS, payload: { dayInt: text, selected: value, isHabit: isHabit } })
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  return (
    <View style={styles.inputBox}>
      <StyledH2 text={"Repeat"} style={styles.inputTitle} />
      <View style={styles.multiSelect}>
        <HighlightSelect text="Mon" onChange={updateSelectedList} selected={repeatDays[0]} />
        <HighlightSelect text="Tue" onChange={updateSelectedList} selected={repeatDays[1]} />
        <HighlightSelect text="Wed" onChange={updateSelectedList} selected={repeatDays[2]} />
        <HighlightSelect text="Thu" onChange={updateSelectedList} selected={repeatDays[3]} />
        <HighlightSelect text="Fri" onChange={updateSelectedList} selected={repeatDays[4]} />
        <HighlightSelect text="Sat" onChange={updateSelectedList} selected={repeatDays[5]} />
        <HighlightSelect text="Sun" onChange={updateSelectedList} selected={repeatDays[6]} />
      </View>
      {showNote &&
        <StyledH4 text={"Note: editing repeat days will not affect past habits (only upcoming habits)"} style={styles.note} />
      }
    </View>
  )
}

export default RepeatBox

const getDynamicStyles = (ColorState) => ({
  inputBox: {
    backgroundColor: ColorState?.DarkestBlue,
    borderRadius: 12,
    paddingLeft: 27,
    paddingRight: 10,
    paddingVertical: 20,
    flexDirection: "column",
    marginBottom: 22,
    justifyContent: "center",
    gap: 8,
  },
  note: {
    color: ColorState?.TextColorOnBg,
    textAlign: "left",

  },
  multiSelect: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 1,

  },
  inputTitle: {
    color: ColorState?.TextColorOnBg
  }
});