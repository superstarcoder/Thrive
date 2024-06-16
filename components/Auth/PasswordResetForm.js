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
import { redirectToEnterNewPasswordForm } from './EnterNewPasswordForm';


const PasswordResetForm = ({ setAuthPageScreen, setCurrentPage }) => {
  // load fonts
  var [fontsLoaded] = useFonts({
    "MPlusRegular": require("../../assets/fonts/mplusRegular.ttf"),
    "MPlusMedium": require("../../assets/fonts/mplusMedium.ttf")
  })

  if (!fontsLoaded) {
    return null
  }

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // const [signedIn, setSignedIn] = useState(false)
  // const [emailSent, setEmailSent] = useState(false)
  const [formState, setFormState] = useState("enter_email")

  // enter_email
  // email_sent
  // email_does_not_exist
  // reset_password


  const sendResetPasswordEmail = async () => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectToEnterNewPasswordForm })
    if (error) {
      console.log({error})
      setFormState("invalid_email")
    } else {
      setCurrentPage("enter_new_password_form")
      setFormState("email_sent")
    }
  }

  return (
    <View style={styles.container}>
      <StyledH1 text={"Reset Password"} style={styles.headingText} />
      <StyledH3 text={"Please enter your email:"} />

      <TextInput
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="Email"
        autoCapitalize={'none'}
        style={[styles.myInputBox, fontStyles.styledH3]}
      />
      {formState == "email_sent" &&
        <StyledH3 text={"Email has been sent! Please check your email"} style={styles.confirmationText} />
      }
      {formState == "invalid_email" &&
        <StyledH3 text={"Invalid email entered. Please double check email field."} style={styles.errorText} />
      }
      {/* <View>
	
			<TextInput
			  onChangeText={(text) => setPassword(text)}
			  value={password}
			  secureTextEntry={true}
			  placeholder="Password"
			  style={[styles.myInputBox, fontStyles.styledH3]}
			  autoCapitalize={'none'}
			/>
			<TouchableOpacity onPress={() => {}}>
			  <StyledH4 text={"Forgot password?"} style={styles.forgotPasswordText}/>
			</TouchableOpacity>
		  </View> */}

      <TouchableOpacity style={styles.submitButton} onPress={sendResetPasswordEmail}>
        <StyledH3 text={"Submit"} style={styles.buttonText} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => { setAuthPageScreen("sign_in") }}>
        <StyledH3 text={"Cancel"} style={styles.buttonText} />
      </TouchableOpacity>
      {/* <View style={[styles.verticallySpaced, styles.mt20]}> */}
      {/* <TouchableOpacity style={styles.loginButton} onPress={() => {}}>
			<StyledH3 text={"Sign Up"} style={styles.buttonText} />
		  </TouchableOpacity> */}
      {/* <Button title="Sign in" disabled={loading} onPress={() => signInWithGithub()} /> */}
      {/* </View> */}
      {/* <View style={styles.verticallySpaced}>
			<Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
		  </View> */}
      {/* <View style={styles.agreementTextContainer}>
			<Text style={[fontStyles.styledH4, styles.agreementText]} textBreakStrategy="simple">
			  By continuing, you agree to Thrive's{' '}
			  <Text style={{ color: "#5c6b9f" }}>
				Terms of Service{' '}
			  </Text>
	
			  and{' '}
	
			  <Text style={{ color: "#5c6b9f" }}>
				Privacy Policy
			  </Text>
			</Text>
	
		  </View>
	
		  <Text style={[fontStyles.styledH4, styles.separator]}>or</Text> */}

    </View>
  )
}

export default PasswordResetForm


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