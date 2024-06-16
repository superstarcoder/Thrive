import React, { useState } from 'react'
import { Alert, StyleSheet, View, TextInput, Text } from 'react-native'
import { makeRedirectUri } from "expo-auth-session";
import Color from "../../assets/themes/Color";
import { StyledH1, StyledH2, StyledH3, StyledH4, fontStyles } from "../text/StyledText";
import { useFonts } from 'expo-font'
import { TouchableOpacity } from "react-native-gesture-handler";
import { DiscordLogo, GithubLogo } from "phosphor-react-native";
import { FacebookSocialButton, GoogleSocialButton, } from "react-native-social-buttons";
import { supabase } from '../../lib/supabase'

export const redirectToEnterNewPasswordForm = makeRedirectUri();

const EnterNewPasswordForm = ({ setCurrentPage }) => {
  // load fonts
  var [fontsLoaded] = useFonts({
    "MPlusRegular": require("../../assets/fonts/mplusRegular.ttf"),
    "MPlusMedium": require("../../assets/fonts/mplusMedium.ttf")
  })

  if (!fontsLoaded) {
    return null
  }

  const [password, setPassword] = useState('')

  const resetPassword = async () => {
	console.log("time to reset password!")
	const { data, error } = await supabase.auth.updateUser({ password: password })
	console.log({password})

	if (error) {
		Alert.alert(error.message)
	} else {
		Alert.alert("Password has been reset successfuly!")
		setCurrentPage("home")
	}
  }
  const cancelPasswordReset = async () => {
	setCurrentPage("home")
  }

  return (
    <View style={styles.container}>
      <StyledH1 text={"Enter New Password"} style={styles.headingText} />

	  <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          style={[styles.myInputBox, fontStyles.styledH3]}
          autoCapitalize={'none'}
        />

      <TouchableOpacity style={styles.submitButton} onPress={resetPassword}>
        <StyledH3 text={"Submit"} style={styles.buttonText} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={cancelPasswordReset}>
        <StyledH3 text={"Cancel"} style={styles.buttonText} />
      </TouchableOpacity>
    </View>
  )
}

export default EnterNewPasswordForm


const styles = StyleSheet.create({
  confirmationText: {
    color: Color.GreenAccent
  },
  errorText: {
    color: Color.RedAccent
  },
  container: {
    backgroundColor: Color.DarkestBlue,
    display: "flex",
    gap: 20,
    width: "100%",
    height: "100%",
    paddingTop: 70,
    // marginTop: 40,
    paddingHorizontal: 20,
  },
  headingText: {
    alignSelf: "center",
    marginVertical: 20
  },
  myInputBox: {
    backgroundColor: Color.GrayBlue,
    borderWidth: 0,
    borderRadius: 8,
    padding: 5,
    paddingVertical: 11,
    paddingHorizontal: 12,
    // fontStyle: fontStyles.styledH4
  },
  forgotPasswordText: {
    color: "#5c6b9f",
    marginTop: 2,
  },
  submitButton: {
    backgroundColor: Color.Blue,
    paddingVertical: 11,
    paddingHorizontal: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: Color.DarkGray,
    paddingVertical: 11,
    paddingHorizontal: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "black"
  },
  agreementText: {
    textAlign: "center",
    color: "#727272"
  },
  agreementTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  separator: {
    marginVertical: 5,
    alignSelf: "center",
    color: "#727272",
  },
  signInWithGithubButton: {
    flexDirection: "row",
    backgroundColor: "black",
    paddingVertical: 11,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    gap: 10,
  },
  signInWithDiscordButton: {
    flexDirection: "row",
    backgroundColor: "#5865f2",
    paddingVertical: 11,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    gap: 10,
  },
  signInWithGoogle: {
    flexDirection: "row",
    backgroundColor: "#5865f2",
    paddingVertical: 11,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    gap: 10,
  },
  signInWithGoogle: {
    alignSelf: "center",
    width: "100%",
    paddingVertical: 11,
    paddingHorizontal: 12,
    height: "auto",
    borderRadius: 8,
  },
  googleButtonText: {
    fontFamily: "MPlusMedium",
    fontSize: 16,
  }

})