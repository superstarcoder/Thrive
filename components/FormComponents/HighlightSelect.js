import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import Color from '../../assets/themes/Color'
import { useFonts } from 'expo-font'
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Square, CheckSquare } from 'phosphor-react-native';
import { StyledH1, StyledH2, StyledH3, StyledH4, fontStyles, loadFonts } from '../text/StyledText';
import { useColorsStateContext } from '../ColorContext';

const HighlightSelect = ({ text, selected, onChange }) => {

  const { ColorState, setColorState } = useColorsStateContext();
  // const styles = getDynamicStyles(ColorState)

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const onCheckPress = () => {
    onChange(!selected, daysOfWeek.indexOf(text))
  }

  let hText;
  if (selected) {
    hText = <View style={[styles.highlighted, { backgroundColor: ColorState?.LightBlue }]}>
      <StyledH3 text={text} style={styles.textHighlighted} />
    </View>
  }
  else {
    hText = <View style={styles.unHighlighted}>
      <StyledH3 text={text} style={styles.textUnhighlighted} />
    </View>
  }

  return (
    <TouchableOpacity onPress={onCheckPress} style={styles.container}>
      {hText}
    </TouchableOpacity>
  )
}

export default HighlightSelect

const styles = StyleSheet.create({
  container: {
    // marginRight: 4,
  },
  highlighted: {
    // height: 25,
    minWidth: 40,
    borderRadius: 30,
    paddingVertical: 1,
    paddingHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  unHighlighted: {
    // height: 25,
    minWidth: 40,
    // width: 38,
    paddingVertical: 1,
    paddingHorizontal: 4,
  },
  checkBoxIcon: {
  },
  textHighlighted: {
    color: "black"

  },
  textUnhighlighted: {
  }
})