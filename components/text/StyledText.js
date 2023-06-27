import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useFonts } from 'expo-font'
// import AppLoading from 'expo-app-loading'
import Color from '../../assets/themes/Color'

export function StyledH1({text, style={}, weight="regular"}) {
  if (weight == "regular") {
    var [fontsLoaded] = useFonts({
      "MPlus": require("../../assets/fonts/mplusRegular.ttf")
    })
  }
  else if (weight == "medium") {
    var [fontsLoaded] = useFonts({
      "MPlus": require("../../assets/fonts/mplusMedium.ttf")
    })
  }


  if (!fontsLoaded) {
    return null
  }
  
  return (
	  <Text style={[fontStyles.styledH1, style]}>{text}</Text>
  )
}

export function StyledH2({text, style={}, weight="regular"}) {
  if (weight == "regular") {
    var [fontsLoaded] = useFonts({
      "MPlus": require("../../assets/fonts/mplusRegular.ttf")
    })
  }
  else if (weight == "medium") {
    var [fontsLoaded] = useFonts({
      "MPlus": require("../../assets/fonts/mplusMedium.ttf")
    })
  }


  if (!fontsLoaded) {
    return null
  }
  
  return (
	  <Text style={[fontStyles.styledH2, style]}>{text}</Text>
  )
}


export function StyledH3({text, style={}, weight="regular"}) {
  if (weight == "regular") {
    var [fontsLoaded] = useFonts({
      "MPlus": require("../../assets/fonts/mplusRegular.ttf")
    })
  }
  else if (weight == "medium") {
    var [fontsLoaded] = useFonts({
      "MPlus": require("../../assets/fonts/mplusMedium.ttf")
    })
  }


  if (!fontsLoaded) {
    return null
  }
  
  return (
	  <Text style={[fontStyles.styledH3, style]}>{text}</Text>
  )
}

export function StyledH4({text, style={}, weight="regular"}) {
  if (weight == "regular") {
    var [fontsLoaded] = useFonts({
      "MPlus": require("../../assets/fonts/mplusRegular.ttf")
    })
  }
  else if (weight == "medium") {
    var [fontsLoaded] = useFonts({
      "MPlus": require("../../assets/fonts/mplusMedium.ttf")
    })
  }


  if (!fontsLoaded) {
    return null
  }
  
  return (
	  <Text style={[fontStyles.styledH4, style]}>{text}</Text>
  )
}

export const fontStyles = StyleSheet.create({
	styledH1: {
    fontFamily: "MPlus",
    color: Color.White,
    fontSize: 24,
	},
  styledH2: {
    fontFamily: "MPlus",
    color: Color.White,
    fontSize: 20,
	},
  styledH3: {
    fontFamily: "MPlus",
    color: Color.White,
    fontSize: 16,
	},
  styledH4: {
    fontFamily: "MPlus",
    color: Color.White,
    fontSize: 12,
	},
})