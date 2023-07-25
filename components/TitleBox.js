import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView } from 'react-native'
import Color from '../assets/themes/Color'
import {StyledH1, StyledH2, StyledH3, StyledH4, fontStyles, loadFonts} from './text/StyledText';
import { useFonts } from 'expo-font'
import React, { useState } from 'react'
import MyTextInput from './FormComponents/MyTextInput';

const TitleBox = () => {

  const [currentText, setCurrentText] = useState("")

	const onTextUpdate = (text) => {
    setCurrentText(text)
	}

  let title;
  if (currentText == "") {
    title = <StyledH2 text={"Title"}/>
  }
  else {
    title = <StyledH3 text={"Title"} style={{color: Color.Gray}}/>
  }

  return (
  <KeyboardAvoidingView>
    <View style={styles.titleBox}>
      {title}
      <MyTextInput placeholderText={'Eg: water the plants'} getText={onTextUpdate}/>
    </View>
  </KeyboardAvoidingView>
  )
}

export default TitleBox

const styles = StyleSheet.create({
	titleBox: {
    backgroundColor: Color.DarkestBlue,
    borderRadius: 12,
    paddingHorizontal: 27,
    paddingVertical: 22,
    marginBottom: 25,
  },
})