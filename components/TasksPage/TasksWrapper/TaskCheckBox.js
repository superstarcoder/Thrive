import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import Color from '../../../assets/themes/Color'
import { useFonts } from 'expo-font'
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Square, CheckSquare, XSquare, Placeholder } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { onlyDatesAreSame } from '../../../utils/DateHelper';
import { SvgUri, SvgXml } from 'react-native-svg';
// import exemptIconSvg from "../../../assets/images/exempt_icon.svg"

const TaskCheckBox = ({ onChange = null, size = 38, taskId, isHabit, habitHistoryEntry, status, disabled }) => {
  // const [checked, setChecked] = useState(false)

  const onCheckPress = async () => {

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    if (onChange != null) {

      let newStatus
      if (!isHabit) {
        if (status == "complete") {
          newStatus = "incomplete"
        } else if (status == "exempt" || status == "incomplete" || status == "incomplete_ignored") { // exempt OR incomplete OR incomplete_ignored tasks
          newStatus = "complete"
        }
      } else {
        if (status == "incomplete" || status == "pending" || status == "exempt") {
          newStatus = "complete"
        } else if (status == "complete") {
          if (onlyDatesAreSame(habitHistoryEntry.habit_due_date, new Date())) {
            newStatus = "pending"
          } else {
            newStatus = "incomplete"
          }
        }
      }
      await onChange(taskId, isHabit, habitHistoryEntry, newStatus)
    }
    // setChecked(!checked)
  }

  // let checkIcon;
  // if (checked) {
  // checkIcon = <CheckSquare size={size} weight="fill" color={Color.GreenAccent} style={styles.checkBoxIcon}/>
  // }
  // else {
  //   checkIcon = <Square size={size} weight="duotone" color={Color.DarkestBlue} style={[styles.checkBoxIcon, {borderColor: "black"}]}/>
  // }


  let statusIcon;


  if (!isHabit) {
    if (status == "complete") {
      statusIcon = <CheckSquare size={size} weight="fill" color={Color.GreenAccent} style={styles.checkBoxIcon} />
    } else if (status == "incomplete") {
      statusIcon = <Square size={size} weight="duotone" color={"black"} style={[styles.checkBoxIcon, { borderColor: "black" }]} />
    } else if (status == "exempt") {
      statusIcon = <Placeholder size={size} weight="fill" color={Color.BlueAccent} style={[styles.checkBoxIcon, { borderColor: "black" }]} />
    } else { // incomplete_ignored
      statusIcon = <XSquare size={size} weight="fill" color={Color.RedAccent} style={[styles.checkBoxIcon, { borderColor: "black" }]} />
    }
  }
  else {
    if (status == "complete") {
      statusIcon = <CheckSquare size={size} weight="fill" color={Color.GreenAccent} style={styles.checkBoxIcon} />
    } else if (status == "pending") {
      statusIcon = <Square size={size} weight="duotone" color={"black"} style={[styles.checkBoxIcon, { borderColor: "black" }]} />
    } else if (status == "exempt") {
      statusIcon = <Placeholder size={size} weight="fill" color={Color.BlueAccent} style={[styles.checkBoxIcon, { borderColor: "black" }]} />
    } else if (status == "incomplete") { // incomplete_ignored
      statusIcon = <XSquare size={size} weight="fill" color={Color.RedAccent} style={[styles.checkBoxIcon, { borderColor: "black" }]} />
    }
  }


  return (
    <TouchableOpacity disabled={disabled} onPress={!disabled && onCheckPress}>
      <View>
        {statusIcon}
      </View>
    </TouchableOpacity>
  )
}

export default TaskCheckBox

const styles = StyleSheet.create({
  checkBoxIcon: {
  },
})