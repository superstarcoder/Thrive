import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView } from 'react-native'
import Color from '../assets/themes/Color'
import {StyledH1, StyledH2, StyledH3, StyledH4, fontStyles, loadFonts} from './text/StyledText';
import { useFonts } from 'expo-font'
import React from 'react'


const MyTextInput = ({placeholderText, getText}) => {

  // load fonts
  var [fontsLoaded] = useFonts({
    "MPlus": require("../assets/fonts/mplusRegular.ttf")
  })
  if (!fontsLoaded) {
    return null
  }

  const onChangeText = (text) => {
    getText(text)
  }

  return (
    <View>
      <TextInput style={[fontStyles.styledH2, styles.textInput]} placeholder={placeholderText} placeholderTextColor={Color.GrayBlue} onChangeText={onChangeText}/>
    </View>
  )
}

export default MyTextInput

const styles = StyleSheet.create({
  textInput: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
  }
})