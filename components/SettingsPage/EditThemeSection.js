import React, { useState } from 'react';
import { StyleSheet, View, Image, ScrollView, Dimensions } from 'react-native';
// import Color from '../../assets/themes/Color';
import { StyledH2, StyledH4 } from '../text/StyledText';
import { CheckCircle } from 'phosphor-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useColorsStateContext } from '../ColorContext';
import { titleToTheme } from '../../assets/themes/ThemeColors';
import { supabaseUpdateUserSettings } from '../Auth/AuthPageSupabase';

const themeImageWidth = 131
const themeImageHeight = 250
const screenWidth = Dimensions.get('window').width
const itemsPerRow = 2
const itemMargin = 12
const selectedColor = "#C8C8C8"
const selectedBorderWidth = 8
const data = [
  { id: '1', title: 'Thrive Blue', imagePath: require("../../assets/images/themes/thrive_blue_theme.png") },
  { id: '2', title: 'Deep Purple', imagePath: require("../../assets/images/themes/deep_purple_theme.png") },
  { id: '3', title: 'Ocean Mist', imagePath: require("../../assets/images/themes/ocean_mist_theme.png") },
  { id: '4', title: 'Sky Blue', imagePath: require("../../assets/images/themes/sky_blue_theme.png") },
]


const EditThemeSection = ({userSettings, setUserSettings}) => {
  const rowsOfThemes = []
  const { ColorState, setColorState } = useColorsStateContext();
  const styles = getDynamicStyles(ColorState)

  const getSelectedStyle = (themeTitle) => {
    if (userSettings.selectedTheme == themeTitle) {
      return {
        borderWidth: selectedBorderWidth,
        borderColor: selectedColor,
        opacity: 0.7,
      }
    }
    return {}
  }

  const onThemeOptionPressed = async (themeTitle) => {
    if (themeTitle == userSettings.selectedTheme) return

    await supabaseUpdateUserSettings({updateDict: {selectedTheme: themeTitle}, userSettings, setUserSettings, setColorState})

  }

  // Generate rows with items
  for (let i = 0; i < data.length; i += itemsPerRow) {
    const rowItems = data.slice(i, i + itemsPerRow);
    rowsOfThemes.push(
      <View key={i} style={styles.row}>
        {rowItems.map((item) => (

          <TouchableOpacity key={item.id} style={styles.themeContainer} onPress={async () => { await onThemeOptionPressed(item.title) }}>
            <View style={styles.themeImageContainer}>
              <Image
                source={item.imagePath}
                style={[styles.image, getSelectedStyle(item.title)]}
                resizeMode="cover"
                onError={() => console.log('Image failed to load.')}
              />
              {userSettings.selectedTheme == item.title &&
                <>
                  <CheckCircle size={35} weight="fill" color={ColorState?.GreenAccent} style={styles.checkIconStyle} />
                </>
              }
            </View>
            <StyledH4 text={item.title} style={styles.themeTitle} />
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <StyledH2 text={"Themes"} style={styles.themeSectionTitle} />
      {rowsOfThemes}
    </ScrollView>
  )
}


const getDynamicStyles = (ColorState) => ({
  checkIconStyle: {
    position: "absolute",
    right: selectedBorderWidth,
    bottom: selectedBorderWidth,
  },
  themeSectionTitle: {
    alignSelf: "center",
  },
  scrollViewContainer: {
    width: "100%",
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20, // Space between rows
  },
  themeContainer: {
    width: (screenWidth / itemsPerRow) - (itemMargin * 2), // Width of each item
    marginHorizontal: itemMargin,
    alignItems: 'center',
  },
  themeImageContainer: {
    width: '100%',
    height: themeImageHeight,
    backgroundColor: ColorState?.Gray,
    borderRadius: 18,
    shadowColor: 'black', // Shadow color
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 10, // Shadow blur radius
    elevation: 10, // For Android shadow
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    borderWidth: 3,
  },
  themeTitle: {
    marginTop: 10,
    textAlign: 'center',
  },
});

export default EditThemeSection