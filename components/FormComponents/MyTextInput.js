import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import { StyledH1, StyledH2, StyledH3, StyledH4, fontStyles, loadFonts } from '../text/StyledText';
import { useFonts } from 'expo-font'
import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { useColorsStateContext } from '../ColorContext';




const MyTextInput = ({ onFocus, onBlur, placeholderText, onChangeText, text, inputRef = undefined, multiline = false }) => {

  // load fonts
  var [fontsLoaded] = useFonts({
    "MPlusRegular": require("../../assets/fonts/mplusRegular.ttf"),
    "MPlusMedium": require("../../assets/fonts/mplusMedium.ttf")
  })
  if (!fontsLoaded) {
    return null
  }

  const { ColorState, setColorState } = useColorsStateContext();
  const styles = getDynamicStyles(ColorState)

  return (
    <View>
      <TextInput onFocus={onFocus} onBlur={onBlur} ref={inputRef} multiline={multiline} value={text} style={[fontStyles.styledH2, styles.textInput]} placeholder={placeholderText} placeholderTextColor={ColorState?.PlaceholderTextColor} onChangeText={onChangeText} />
    </View>
  )
}

export default MyTextInput

const getDynamicStyles = (ColorState) => ({
  textInput: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    fontFamily: "MPlusRegular",
    color: ColorState?.TextColorOnBg
  }
});