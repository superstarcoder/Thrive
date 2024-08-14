import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView } from 'react-native'
import { useFonts } from 'expo-font'
import React, { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { WarningCircle } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';
import { StyledH1, StyledH2, StyledH3, StyledH4, fontStyles, loadFonts } from '../../text/StyledText';
import SliderBar from '../../FormComponents/SliderBar';
import { ACTIONS } from '../../../utils/Actions_TaskSettingsModal';
import { useColorsStateContext } from '../../ColorContext';


const ImportanceBox = forwardRef(({ dispatch, importance }, ref) => {


  const sliderBarRef = useRef(null)
  const [importanceText, setImportanceText] = useState("medium") // low, medium, high
  const [importanceNumber, setImportanceNumber] = useState(importance)
  const { ColorState, setColorState } = useColorsStateContext();
  const styles = getDynamicStyles(ColorState)

  var [fontsLoaded] = useFonts({
    "MPlus": require("../../../assets/fonts/mplusRegular.ttf")
  })

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  }, [importanceText])

  const updateImportanceText = (myImportanceNum) => {
    if (myImportanceNum <= 4.0) {
      setImportanceText("low")
    }
    else if (myImportanceNum <= 7.0) {
      setImportanceText("medium")
    }
    else {
      setImportanceText("high")
    }
  }

  const setSliderPercent = (value) => {
    const myImportanceNum = parseFloat((value * 10).toFixed(1))
    updateImportanceText(myImportanceNum)
    setImportanceNumber(myImportanceNum)
  }

  useImperativeHandle(ref, () => ({
    setImportance(importance) {
      setSliderPercent(importance / 10)
      sliderBarRef?.current?.setSliderTo(importance / 10)
    }
  }));

  const onSliderMoveEnd = (value) => {
    // setFinalImportanceNumber((value*10).toFixed(1))
    dispatch({ type: ACTIONS.UPDATE_IMPORTANCE, payload: { importance: parseFloat((value * 10).toFixed(1)) } })
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
            <StyledH2 text={"Importance"} style={{ color: ColorState?.TextColorOnBg }} />
          </Text>
          <View style={styles.sliderRow}>
            <SliderBar getSliderPercent={setSliderPercent} ref={sliderBarRef} onSliderMoveEnd={onSliderMoveEnd} />
            <StyledH4 text={importanceNumber} style={styles.sliderInfo} />
          </View>
          <View style={styles.importanceText}>
            <WarningCircle size={20} weight="fill" color={ColorState?.Blue} style={styles.clockIcon} />
            <StyledH4 text={importanceText + " importance "} style={{ color: ColorState?.TextColorOnBg }} />
          </View>
        </View>
        <View style={styles.inputBoxRight}>
        </View >
      </View>
    </KeyboardAvoidingView>
  )
})

export default ImportanceBox


const getDynamicStyles = (ColorState) => ({
  inputBox: {
    backgroundColor: ColorState?.DarkestBlue,
    borderRadius: 12,
    paddingHorizontal: 27,
    paddingVertical: 20,
    flexDirection: "row",
    marginBottom: 22,
  },

  sliderRow: {
    flexDirection: "row"
  },
  sliderInfo: {
    color: ColorState?.TextColorOnBg,
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

});