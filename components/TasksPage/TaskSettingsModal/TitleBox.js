import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView } from 'react-native'
import { useFonts } from 'expo-font'
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react'
import { StyledH1, StyledH2, StyledH3, StyledH4, fontStyles, loadFonts } from '../../text/StyledText';
import MyTextInput from '../../FormComponents/MyTextInput';
import { ACTIONS } from '../../../utils/Actions_TaskSettingsModal';
import { useColorsStateContext } from '../../ColorContext';

const TitleBox = ({ title, dispatch }) => {

  const { ColorState, setColorState } = useColorsStateContext();
  const styles = getDynamicStyles(ColorState)

  let titleComp;
  if (title == "") {
    titleComp = <StyledH2 text={"Title"} style={{ color: ColorState.TextColorOnBg }} />
  }
  else {
    titleComp = <StyledH3 text={"Title"} style={{ color: ColorState.TextColorOnBg }} />
  }

  return (
    <KeyboardAvoidingView>
      <View style={styles.titleBox}>
        {titleComp}
        <MyTextInput placeholderText={'Eg: water the plants'} onChangeText={(text) => { dispatch({ type: ACTIONS.UPDATE_TITLE, payload: { title: text } }) }} text={title} />
      </View>
    </KeyboardAvoidingView>
  )
}

export default TitleBox

const getDynamicStyles = (ColorState) => ({
  titleBox: {
    backgroundColor: ColorState.DarkestBlue,
    borderRadius: 12,
    paddingHorizontal: 27,
    paddingVertical: 22,
    marginBottom: 25,
  },
});