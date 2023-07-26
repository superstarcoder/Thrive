import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView } from 'react-native'
import Color from '../assets/themes/Color'
import {StyledH1, StyledH2, StyledH3, StyledH4, fontStyles, loadFonts} from './text/StyledText';
import { useFonts } from 'expo-font'
import React, { useState } from 'react'
import MyTextInput from './FormComponents/MyTextInput';

const DescriptionBox = () => {

  const [currentText, setCurrentText] = useState("")

	const onTextUpdate = (text) => {
    setCurrentText(text)
	}

  let title;
  if (currentText == "") {
    title = <StyledH2 text={"Description"}/>
  }
  else {
    title = <StyledH3 text={"Description"} style={{color: Color.Gray}}/>
  }

  return (
  <KeyboardAvoidingView>
    <View style={styles.titleBox}>
      {title}
      <MyTextInput placeholderText={'Eg: in frontyard and backyard'} getText={onTextUpdate} multiline={true}/>
    </View>
  </KeyboardAvoidingView>
  )
}

export default DescriptionBox

const styles = StyleSheet.create({
	titleBox: {
    backgroundColor: Color.DarkestBlue,
    borderRadius: 12,
    paddingHorizontal: 27,
    paddingVertical: 20,
    marginBottom: 25,
  },
})