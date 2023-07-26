import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import Color from '../../assets/themes/Color'
import { useFonts } from 'expo-font'
import React, {useState, useRef, useEffect, useCallback} from 'react';
import { Square, CheckSquare } from 'phosphor-react-native';

const CheckBox = ({getCheckValue, size=38}) => {


  const [checked, setChecked] = useState(false)

  const onCheckPress = () => {
    getCheckValue(!checked)
	  setChecked(!checked)
  }

  let checkIcon;
  if (checked) {
	checkIcon = <CheckSquare size={size} weight="fill" color={Color.GreenAccent} style={styles.checkBoxIcon}/>
  }
  else {
	checkIcon = <Square size={size} weight="fill" color={"white"} style={styles.checkBoxIcon}/>
  }
  
  return (
	<TouchableOpacity onPress={onCheckPress}>
			{checkIcon}
	</TouchableOpacity>
  )
}

export default CheckBox

const styles = StyleSheet.create({
  checkBoxIcon: {
  },
})