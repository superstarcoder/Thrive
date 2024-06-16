import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from 'react'
import { Alert, StyleSheet, View, TextInput, Text } from 'react-native'
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as Linking from "expo-linking";
import { supabase } from '../../lib/supabase'
import { Button, Input } from 'react-native-elements'
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import Color from "../../assets/themes/Color";
import { StyledH1, StyledH3, StyledH4, fontStyles } from "../text/StyledText";
import { useFonts } from 'expo-font'
import { TouchableOpacity } from "react-native-gesture-handler";
import { DiscordLogo, GithubLogo } from "phosphor-react-native";
import { FacebookSocialButton, GoogleSocialButton, } from "react-native-social-buttons";
import { redirectToPasswordResetForm } from "./PasswordResetForm";


const SignInForm = ({signInWithEmail, signUpWithEmail, signInWithGithub, resetPassword}) => {

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
  const [loading, setLoading] = useState(false)

  return (
    <View style={styles.container}>
      <StyledH1 text={"Sign In"} style={styles.headingText} />

      <TextInput
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="Email"
        autoCapitalize={'none'}
        style={[styles.myInputBox, fontStyles.styledH3]}
      />
      <View>

        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          style={[styles.myInputBox, fontStyles.styledH3]}
          autoCapitalize={'none'}
        />
        <TouchableOpacity onPress={resetPassword}>
          <StyledH4 text={"Forgot password?"} style={styles.forgotPasswordText} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={() => signInWithEmail(email, password)}>
        <StyledH3 text={"Login"} style={styles.buttonText} />
      </TouchableOpacity>
      {/* <View style={[styles.verticallySpaced, styles.mt20]}> */}
      <TouchableOpacity style={styles.loginButton} onPress={() => signUpWithEmail(email, password)}>
        <StyledH3 text={"Sign Up"} style={styles.buttonText} />
      </TouchableOpacity>
      {/* <Button title="Sign in" disabled={loading} onPress={() => signInWithGithub()} /> */}
      {/* </View> */}
      {/* <View style={styles.verticallySpaced}>
      <Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
    </View> */}
      <View style={styles.agreementTextContainer}>
        {/* <StyledH4 text={"By continuing, you agree to Thrive's Terms of Service and Privacy Policy"} style={styles.agreementText}/> */}
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

      <Text style={[fontStyles.styledH4, styles.separator]}>or</Text>


      <TouchableOpacity style={styles.signInWithGithubButton} onPress={() => signInWithGithub()}>
        <GithubLogo size={30} weight="duotone" color={"white"} />
        <StyledH3 text={"Sign in with Github"} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.signInWithDiscordButton}>
        <DiscordLogo size={30} weight="duotone" color={"white"} />
        <StyledH3 text={"Sign in with Discord"} />
      </TouchableOpacity>


      <GoogleSocialButton onPress={() => { }} buttonViewStyle={styles.signInWithGoogle} logoStyle={{}} textStyle={styles.googleButtonText} />
    </View>
  )
}

export default SignInForm


const styles = StyleSheet.create({
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
  loginButton: {
    backgroundColor: Color.Blue,
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