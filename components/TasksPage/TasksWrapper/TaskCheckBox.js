import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import Color from '../../../assets/themes/Color'
import { useFonts } from 'expo-font'
import React, {useState, useRef, useEffect, useCallback} from 'react';
import { Square, CheckSquare, SquareLogo, SquaresFour, XSquare, List, TextAlignCenter, TextAlignJustify, Placeholder } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { SvgUri, SvgXml } from 'react-native-svg';
// import exemptIconSvg from "../../../assets/images/exempt_icon.svg"

const TaskCheckBox = ({onChange=null, checked, size=38, taskId, isHabit, habitHistoryEntry, status}) => {


  // const [checked, setChecked] = useState(false)

  const onCheckPress = async () => {
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    if (onChange != null) {

      let newStatus
      if (status == "complete") {
        newStatus = "incomplete"
      } else {
        newStatus = "complete"

      }
      await onChange(!checked, taskId, isHabit, habitHistoryEntry, newStatus)
    }
	  // setChecked(!checked)
  }

  let checkIcon;
  if (checked) {
	checkIcon = <CheckSquare size={size} weight="fill" color={Color.GreenAccent} style={styles.checkBoxIcon}/>
  }
  else {
	  checkIcon = <Square size={size} weight="duotone" color={Color.DarkestBlue} style={[styles.checkBoxIcon, {borderColor: "black"}]}/>
  }


  let statusIcon;
  if (status == "complete") {
	  statusIcon = <CheckSquare size={size} weight="fill" color={Color.GreenAccent} style={styles.checkBoxIcon}/>
  } else if (status == "incomplete") {
	  statusIcon = <Square size={size} weight="duotone" color={Color.DarkestBlue} style={[styles.checkBoxIcon, {borderColor: "black"}]}/>
  } else if (status == "exempt") {
	  statusIcon = <Placeholder size={size} weight="fill" color={Color.BlueAccent} style={[styles.checkBoxIcon, {borderColor: "black"}]}/>
  } else { // incomplete_ignored
	  statusIcon = <XSquare size={size} weight="fill" color={Color.RedAccent} style={[styles.checkBoxIcon, {borderColor: "black"}]}/>
  }
  
  return (
	<TouchableOpacity onPress={onCheckPress}>
			{statusIcon}
	</TouchableOpacity>
  )
}

export default TaskCheckBox

const styles = StyleSheet.create({
  checkBoxIcon: {
  },
})