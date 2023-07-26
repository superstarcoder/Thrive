import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import Color from '../assets/themes/Color'
import {StyledH1, StyledH2, StyledH3, StyledH4, fontStyles, loadFonts} from './text/StyledText';
import React, {useState, useRef, useEffect, useCallback} from 'react';
import CheckBox from './FormComponents/CheckBox';
import HighlightSelect from './FormComponents/HighlightSelect';


const RepeatBox = () => {

  const [checked, setChecked] = useState(false)

  const setCheckValue = (value) => {
    setChecked(value)
    console.log("set check value to: "+value)
  }

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  let myDict = {} 
  for (day of daysOfWeek) {
    myDict[day] = "false"
  }
  const [selectedList, setSelectedList] = useState(myDict)

  // useEffect(() => {
  //   console.log(selectedList)
  // }, [selectedList])
  
  const updateSelectedList = (value, text) => {
    let selectedListCopy = {...selectedList}
    selectedListCopy[text] = value
    setSelectedList(selectedListCopy)
  }

  return (
    <View style={styles.inputBox}>
      <StyledH2 text={"Repeat"} style={styles.inputTitle}/>
      <View style={styles.multiSelect}>
        <HighlightSelect text="Mon" getSelectedValue={updateSelectedList}/>
        <HighlightSelect text="Tue" getSelectedValue={updateSelectedList}/>
        <HighlightSelect text="Wed" getSelectedValue={updateSelectedList}/>
        <HighlightSelect text="Thu" getSelectedValue={updateSelectedList}/>
        <HighlightSelect text="Fri" getSelectedValue={updateSelectedList}/>
        <HighlightSelect text="Sat" getSelectedValue={updateSelectedList}/>
        <HighlightSelect text="Sun" getSelectedValue={updateSelectedList}/>
      </View>
    </View>
  )
}

export default RepeatBox

const styles = StyleSheet.create({
  inputBox: {
    backgroundColor: Color.DarkestBlue,
    borderRadius: 12,
    paddingHorizontal: 27,
    paddingVertical: 20,
    flexDirection: "column",
    marginBottom: 22,
	  justifyContent: "center"
  },
  bottomTextContainer: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  bottomText: {
    marginRight: 5,
    color: Color.Gray
  },
  multiSelect: {
	flexDirection: "row"
  },
  inputTitle: {
	marginBottom: 8,
  }
})