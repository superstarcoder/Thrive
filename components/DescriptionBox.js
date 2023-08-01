import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView } from 'react-native'
import Color from '../assets/themes/Color'
import {StyledH1, StyledH2, StyledH3, StyledH4, fontStyles, loadFonts} from './text/StyledText';
import { useFonts } from 'expo-font'
import React, { useEffect, useState } from 'react'
import MyTextInput from './FormComponents/MyTextInput';
import { ACTIONS } from './TaskSettingsModal';

const DescriptionBox = ({description, dispatch}) => {

  let title;
  if (description == "") {
    title = <StyledH2 text={"Description"}/>
  }
  else {
    title = <StyledH3 text={"Description"} style={{color: Color.Gray}}/>
  }

  return (
    <View style={styles.titleBox}>
      {title}
      <MyTextInput placeholderText={'Optional'} onChangeText={(text) => {dispatch({type: ACTIONS.UPDATE_DESCRIPTION, payload: {description: text} })}} multiline={true}/>
    </View>
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