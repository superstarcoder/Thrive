import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView } from 'react-native'
import Color from '../../assets/themes/Color'
import {StyledH1, StyledH2, StyledH3, StyledH4, fontStyles, loadFonts} from '../text/StyledText';
import { useFonts } from 'expo-font'
import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react'
import { Clock } from 'phosphor-react-native';
import ScrollSelect from '../FormComponents/ScrollSelect';

const DurationBox =  forwardRef(({dispatch, duration}, ref) => {

  // const [duration, setDuration] = useState(0)

  // useEffect(() => {
  //   onChange(duration)
  // }, [duration])

  // load fonts
 

  let dataArray = [0, 0.2, 0.5, 0.8]

  for (let i = 1; i < 9; i += 0.5) {
    dataArray.push(i)
  }

  // const setDurationOnUpdate = (value) => {
  //   setDuration(value)
  // }

  const scrollSelectRef = useRef()

  useImperativeHandle(ref, () => ({

    setDuration (duration) {
      const index = dataArray.indexOf(duration)
      if (index == -1) {
        console.error("DurationBox.js: setDuration: duration not in list of possible durations")
      }
      // console.log(index, duration, dataArray)
      scrollSelectRef?.current?.scrollToIndex(index)
    }

  }));

  var [fontsLoaded] = useFonts({
    "MPlus": require("../../assets/fonts/mplusRegular.ttf")
  })
  if (!fontsLoaded) {
    return null
  }

  // console.log("dataArray: "+dataArray)

  return (
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
        <ScrollSelect dataArray={dataArray} dispatch={dispatch} duration={duration} ref={scrollSelectRef}/>
      </View >
    </View>
  )
});

export default DurationBox

const styles = StyleSheet.create({
  inputBox: {
    backgroundColor: Color.DarkestBlue,
    borderRadius: 12,
    paddingHorizontal: 27,
    paddingVertical: 20,
    flexDirection: "row",
    marginBottom: 22,
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