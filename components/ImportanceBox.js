import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView } from 'react-native'
import Color from '../assets/themes/Color'
import {StyledH1, StyledH2, StyledH3, StyledH4, fontStyles, loadFonts} from './text/StyledText';
import { useFonts } from 'expo-font'
import React, {useState, useRef, useEffect, useCallback} from 'react';
import { WarningCircle } from 'phosphor-react-native';
import SliderBar from './SliderBar';

const ImportanceBox = () => {


  const sliderBarRef = useRef(null)
  const [importance, setImportance] = useState("medium") // low, medium, high
  const [importanceNumber, setImportanceNumber] = useState(0)

  var [fontsLoaded] = useFonts({
    "MPlus": require("../assets/fonts/mplusRegular.ttf")
  })

  const setSliderPercent = (value) => {
    // console.log("SLIDER PERCENT: "+value)
    if (value <= 0.4) {
      setImportance("low")
    }
    else if (value <= 0.7) {
      setImportance("medium")
    }
    else {
      setImportance("high")
    }
    setImportanceNumber((value*10).toFixed(1))
  }

  // code to get sliderBarPercentage
  // console.log(sliderBarRef?.current?.getSliderPercent())

  if (!fontsLoaded) {
    return null
  }
  
  return (
    <KeyboardAvoidingView>

    {/* <View style={styles.inputBox} onTouchStart={() => {console.log(sliderBarRef?.current?.getSliderPercent())}}> */}
    <View style={styles.inputBox}>
      <View style={styles.inputBoxLeft}>
        <Text style={styles.boxTitleContainer}>
            <StyledH2 text={"Importance"}/>
        </Text>
      <View style={styles.sliderRow}>
        <SliderBar getSliderPercent={(value) => setSliderPercent(value)} ref={sliderBarRef}/>
        <StyledH4 text={importanceNumber} style={styles.sliderInfo}/>
      </View>
        <View style={styles.importanceText}>
          <WarningCircle size={20} weight="fill" color={Color.Blue} style={styles.clockIcon} />
          <StyledH4 text={importance+" importance "}/>
        </View>
      </View>
      <View style={styles.inputBoxRight}>
      </View >
    </View>
    </KeyboardAvoidingView>
  )
}

export default ImportanceBox

const styles = StyleSheet.create({
  inputBox: {
    backgroundColor: Color.DarkestBlue,
    borderRadius: 12,
    paddingHorizontal: 27,
    paddingVertical: 20,
    flexDirection: "row",
  },

  sliderRow: {
    flexDirection: "row"
  },
  sliderInfo: {
    marginTop: 17,
    marginLeft: 5,
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
  importanceText: {
	flexDirection: "row",

  },
  textInput: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
  },
  boxTitleContainer: {
	flexDirection: "row",
	alignItems: "flex-end",
	marginBottom: 0,
  }

})