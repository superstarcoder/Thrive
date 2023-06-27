import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView } from 'react-native'
import Color from '../assets/themes/Color'
import {StyledH1, StyledH2, StyledH3, StyledH4, fontStyles, loadFonts} from './text/StyledText';
import { useFonts } from 'expo-font'
import React from 'react'


const InputBox = () => {

  // load fonts
  var [fontsLoaded] = useFonts({
    "MPlus": require("../assets/fonts/mplusRegular.ttf")
  })
  if (!fontsLoaded) {
    return null
  }

  return (
  <KeyboardAvoidingView>

	<View style={styles.inputBox}>
    <StyledH3 text={"Title"} style={{color: Color.Gray}}/>
    <TextInput style={[fontStyles.styledH2, styles.textInput]} placeholder={'Eg: water the plants'} placeholderTextColor={Color.GrayBlue}/>
	</View>
  </KeyboardAvoidingView>
  )
}

export default InputBox

const styles = StyleSheet.create({
  inputBox: {
    backgroundColor: Color.DarkestBlue,
    borderRadius: 12,
    paddingHorizontal: 27,
    paddingVertical: 20,
    marginBottom: 20,
  },
  textInput: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
  }

})