import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Color from '../../assets/themes/Color'
import React from 'react'
import { StyledH2 } from '../text/StyledText'

const SettingsPage = ({signOutUser}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.signOutButton} onPress={signOutUser}>
        <StyledH2 text={"Sign Out"} style={styles.buttonText}/>
      </TouchableOpacity>
    </View>
  )
}

export default SettingsPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.DarkestBlue,
    paddingTop: 100,
    flexDirection: "column",
    alignItems: "center"
  },
  signOutButton: {
    display: "flex",
    backgroundColor: Color.RedAccent,
    alignItems: "center",
    justifyContent: "center",
    width: 180,
    height: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: "black"
  }
})