import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, Keyboard, Dimensions } from 'react-native'
import { useFonts } from 'expo-font'
import React, { useEffect, useRef, useState } from 'react'
import { StyledH1, StyledH2, StyledH3, StyledH4, fontStyles, loadFonts } from '../../text/StyledText';
import Color from '../../../assets/themes/Color'
import MyTextInput from '../../FormComponents/MyTextInput';
import { ACTIONS } from '../../../utils/Actions_TaskSettingsModal';

const DescriptionBox = ({ description, dispatch }) => {

  const inputRef = useRef(null);
  const [keyboardHeight, setKeyboardHeight] = useState();
  const [isHidden, setIsHidden] = useState(false);
  const [onFocus, setOnFocus] = useState(true);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      let temp = event.endCoordinates.height
      // console.log("keyboard height: " + temp)
      setKeyboardHeight(temp);
      checkIfHiddenAndOnFocus(temp);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      // console.log("keyboard hidden")
      setKeyboardHeight(0);
      setIsHidden(false);
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [])

  const checkIfHiddenAndOnFocus = (keyboardHeight) => {
      if (!onFocus) {
        // console.log("setting is hidden to false")
        setIsHidden(false)
        return
      }

      inputRef?.current?.measure((x, y, width, height, pageX, pageY) => {
        const screenHeight = Dimensions.get('screen').height;
        const isHiddenByKeyboard = pageY + height > screenHeight - keyboardHeight;
        setIsHidden(isHiddenByKeyboard);

        // console.log('Is hidden by keyboard:', isHiddenByKeyboard);
        // console.log({ y, pageY, height, screenHeight, keyboardHeight })

        const yOffset = (pageY + height) - (screenHeight - keyboardHeight)
        
      });
  };

  let title;
  if (description == "") {
    title = <StyledH2 text={"Description"} />
  }
  else {
    title = <StyledH3 text={"Description"} style={{ color: Color.Gray }} />
  }

  return (
    <View style={styles.titleBox}>
      {title}
      <MyTextInput onFocus={() => setOnFocus(true)} onBlur={() => setOnFocus(false)} inputRef={inputRef} placeholderText={'Optional'} text={description} onChangeText={(text) => { dispatch({ type: ACTIONS.UPDATE_DESCRIPTION, payload: { description: text } }) }} multiline={true} />
    </View>
  )
}

export default DescriptionBox

const styles = StyleSheet.create({
  titleBox: {
    display: "flex",
    backgroundColor: Color.DarkestBlue,
    borderRadius: 12,
    paddingHorizontal: 27,
    paddingVertical: 20,
    marginBottom: 25,
  },
})