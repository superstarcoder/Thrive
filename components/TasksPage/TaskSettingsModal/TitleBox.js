import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView } from 'react-native'
import Color from '../../assets/themes/Color'
import {StyledH1, StyledH2, StyledH3, StyledH4, fontStyles, loadFonts} from '../text/StyledText';
import { useFonts } from 'expo-font'
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react'
import MyTextInput from '../FormComponents/MyTextInput';
import { ACTIONS } from '../../../utils/Actions_TaskSettingsModal';

const TitleBox = ({title, dispatch}) => {

  // const [currentText, setCurrentText] = useState(defaultValue)
  // console.log("default title in title box: "+defaultValue)

	// const onChange = (title) => {
  //   onChange(title)
  //   // setCurrentText(text)
	// }

  // const inputRef = useRef()

  // useImperativeHandle(ref, () => ({
  //   setValue (newValue) {
  //     setCurrentText(newValue)
  //     inputRef?.current?.setValue(newValue)
  //   }
  // }));


  // useEffect(() => {
  //   onChange(currentText)
  // }, [currentText])

  let titleComp;
  if (title == "") {
    titleComp = <StyledH2 text={"Title"}/>
  }
  else {
    titleComp = <StyledH3 text={"Title"} style={{color: Color.Gray}}/>
  }

  return (
  <KeyboardAvoidingView>
    <View style={styles.titleBox}>
      {titleComp}
      <MyTextInput placeholderText={'Eg: water the plants'} onChangeText={(text) => {dispatch({type: ACTIONS.UPDATE_TITLE, payload: {title: text} })}} text={title} />
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