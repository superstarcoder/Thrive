import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Color from '../../assets/themes/Color'
import React from 'react'
import { StyledH2 } from '../text/StyledText'
import EditThemeSection from './EditThemeSection'
import { ScrollView } from 'react-native-gesture-handler'
import { useColorsStateContext } from '../ColorContext';

const SettingsPage = ({ signOutUser, selectedTheme, setSelectedTheme }) => {


  const { ColorState, setColorState } = useColorsStateContext();
  const styles = getDynamicStyles(ColorState)

  return (

    <View style={styles.container}>
      <EditThemeSection selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme} />
      <TouchableOpacity style={styles.signOutButton} onPress={signOutUser}>
        <StyledH2 text={"Sign Out"} style={styles.buttonText} />
      </TouchableOpacity>
    </View>
  )
}

export default SettingsPage


const getDynamicStyles = (ColorState) => ({
  container: {
    flex: 1,
    backgroundColor: ColorState?.DarkestBlue,
    paddingTop: 70,
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  signOutButton: {
    display: "flex",
    backgroundColor: ColorState?.RedAccent,
    alignItems: "center",
    justifyContent: "center",
    width: 180,
    height: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: "black"
  }
});