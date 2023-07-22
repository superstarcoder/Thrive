import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView } from 'react-native'
import Color from '../assets/themes/Color'
import {StyledH1, StyledH2, StyledH3, StyledH4, fontStyles, loadFonts} from './text/StyledText';
import { useFonts } from 'expo-font'
import React, { useState } from 'react'
import { Clock } from 'phosphor-react-native';
import ScrollSelect from './ScrollSelect';

const DurationBox = () => {

  const [duration, setDuration] = useState(0)

  // load fonts
  var [fontsLoaded] = useFonts({
    "MPlus": require("../assets/fonts/mplusRegular.ttf")
  })
  if (!fontsLoaded) {
    return null
  }

  let dataArray = [0, 0.2, 0.5, 0.8]

  for (let i = 1; i < 9; i += 0.5) {
    dataArray.push(i)
  }

  const setDurationOnUpdate = (value) => {
    setDuration(value)
  }

  console.log("dataArray: "+dataArray)

  return (
  <KeyboardAvoidingView>

	<View style={styles.inputBox}>
    <View style={styles.inputBoxLeft}>
      <Text style={styles.boxTitleContainer}>
          <StyledH2 text={"Duration "}/>
          <StyledH4 text={"(estimate)"} style={{color: Color.Gray}}/>
      </Text>
      <View style={styles.timeText}>
        <Clock size={20} weight="fill" color={Color.RedAccent} style={styles.clockIcon} />
        <StyledH4 text={duration+" hours "}/>
      </View>
    </View>
    <View style={styles.inputBoxRight}>
      <ScrollSelect dataArray={dataArray} getScrollValue={(value) => setDurationOnUpdate(value)}/>
    </View >
	</View>
  </KeyboardAvoidingView>
  )
}

export default DurationBox

const styles = StyleSheet.create({
  inputBox: {
    backgroundColor: Color.DarkestBlue,
    borderRadius: 12,
    paddingHorizontal: 27,
    paddingVertical: 20,
    flexDirection: "row",
    marginBottom: 20,
  },
  inputBoxLeft: {

  },
  inputBoxRight: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 10

  },
  clockIcon: {
	marginRight: 7,
  },
  timeText: {
	flexDirection: "row",

  },
  textInput: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
  },
  boxTitleContainer: {
	flexDirection: "row",
	alignItems: "flex-end",
	marginBottom: 7,
  }

})