import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import Color from '../assets/themes/Color'
import { useFonts } from 'expo-font'
import React, {useState, useRef, useEffect, useCallback} from 'react';
import { Square, CheckSquare } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';

const TaskCheckBox = ({onChange=null, checked, size=38, taskId}) => {


  // const [checked, setChecked] = useState(false)

  const onCheckPress = async () => {
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    if (onChange != null) {
      await onChange(!checked, taskId)
    }
	  // setChecked(!checked)
  }

  let checkIcon;
  if (checked) {
	checkIcon = <CheckSquare size={size} weight="fill" color={Color.GreenAccent} style={styles.checkBoxIcon}/>
  }
  else {
	checkIcon = <Square size={size} weight="duotone" color={Color.DarkestBlue} style={styles.checkBoxIcon}/>
  }
  
  return (
	<TouchableOpacity onPress={onCheckPress}>
			{checkIcon}
	</TouchableOpacity>
  )
}

export default TaskCheckBox

const styles = StyleSheet.create({
  checkBoxIcon: {
  },
})