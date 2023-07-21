import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView } from 'react-native'
import Color from '../assets/themes/Color'
import {StyledH1, StyledH2, StyledH3, StyledH4, fontStyles, loadFonts} from './text/StyledText';
import { useFonts } from 'expo-font'
import React, {useState, useRef, useEffect, useCallback} from 'react';
import { WarningCircle } from 'phosphor-react-native';
import SliderBar from './SliderBar';

const ImportanceBox = () => {


  const sliderBarRef = useCallback(node => {
    if (node !== null) { 
      console.log("NODE: "+node.getSliderPercent())
      // DOM node referenced by ref has changed and exists
    }
    

  }, []); // adjust deps
  // load fonts
  var [fontsLoaded] = useFonts({
    "MPlus": require("../assets/fonts/mplusRegular.ttf")
  })

  const setSliderPercent = (value) => {
    console.log("SLIDER PERCENT: "+value)
  }

  // code to get sliderBarPercentage
  // console.log(sliderBarRef?.current?.getSliderPercent())

  useEffect(() => {
    console.log("yo")

  }, [sliderBarRef?.current?.getSliderPercent()])

  


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
	  <SliderBar getSliderPercent={(value) => setSliderPercent(value)} ref={sliderBarRef}/>
      <View style={styles.importanceText}>
        <WarningCircle size={20} weight="fill" color={Color.Blue} style={styles.clockIcon} />
        <StyledH4 text={"medium importance "}/>
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