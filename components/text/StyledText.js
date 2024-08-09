import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useFonts } from 'expo-font'
// import AppLoading from 'expo-app-loading'
import { useColorsStateContext } from '../ColorContext';


export function StyledH1({text, style={}, weight="regular"}) {

  var [fontsLoaded] = useFonts({
    "MPlusRegular": require("../../assets/fonts/mplusRegular.ttf"),
    "MPlusMedium": require("../../assets/fonts/mplusMedium.ttf")
  })

  const { ColorState, setColorState } = useColorsStateContext();
const fontStyles = getDynamicStyles(ColorState)


  if (!fontsLoaded) {
    return null
  }
  
  return (
	  <Text style={[fontStyles.styledH1, style]}>{text}</Text>
  )
}

export function StyledH2({text, style={}, weight="medium", onLayout}) {

  var [fontsLoaded] = useFonts({
    "MPlusRegular": require("../../assets/fonts/mplusRegular.ttf"),
    "MPlusMedium": require("../../assets/fonts/mplusMedium.ttf")
  })

  var fontFamily = (weight == "medium") ? "MPlusMedium" : "MPlusRegular"

  const { ColorState, setColorState } = useColorsStateContext();
  const fontStyles = getDynamicStyles(ColorState)



  if (!fontsLoaded) {
    return null
  }

  return (
	  <Text style={[fontStyles.styledH2, {fontFamily: fontFamily}, style]} onLayout={onLayout}>{text}</Text>
  )
}


export function StyledH3({text, style={}, weight="regular"}) {

  var [fontsLoaded] = useFonts({
    "MPlusRegular": require("../../assets/fonts/mplusRegular.ttf"),
    "MPlusMedium": require("../../assets/fonts/mplusMedium.ttf")
  })
  const { ColorState, setColorState } = useColorsStateContext();
  const fontStyles = getDynamicStyles(ColorState)

  if (!fontsLoaded) {
    return null
  }
  
  return (
	  <Text style={[fontStyles.styledH3, style]}>{text}</Text>
  )
}

export function StyledH4({text, style={}, weight="regular"}) {

  var [fontsLoaded] = useFonts({
    "MPlusRegular": require("../../assets/fonts/mplusRegular.ttf"),
    "MPlusMedium": require("../../assets/fonts/mplusMedium.ttf")
  })

  const { ColorState, setColorState } = useColorsStateContext();
  const fontStyles = getDynamicStyles(ColorState)


  if (!fontsLoaded) {
    return null
  }
  
  return (
	  <Text style={[fontStyles.styledH4, style]}>{text}</Text>
  )
}

const getDynamicStyles = (ColorState) => ({
  styledH1: {
    fontFamily: "MPlusMedium",
    color: ColorState?.TextColor,
    fontSize: 24,
	},
  styledH2: {
    fontFamily: "MPlusMedium",
    color: ColorState?.TextColor,
    fontSize: 20,
	},
  styledH3: {
    fontFamily: "MPlusMedium",
    color: ColorState?.TextColor,
    fontSize: 16,
	},
  styledH4: {
    fontFamily: "MPlusMedium",
    color: ColorState?.TextColor,
    fontSize: 12,
	},
});

export const fontStyles = {
  styledH1: {
    fontFamily: "MPlusMedium",
    fontSize: 24,
	},
  styledH2: {
    fontFamily: "MPlusMedium",
    fontSize: 20,
	},
  styledH3: {
    fontFamily: "MPlusMedium",
    fontSize: 16,
	},
  styledH4: {
    fontFamily: "MPlusMedium",
    fontSize: 12,
	},
}