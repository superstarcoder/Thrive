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
import PasswordResetForm, { redirectToPasswordResetForm } from "./PasswordResetForm";
import SignInForm from "./SignInForm";

const redirectTo = makeRedirectUri();
// console.log({ redirectTo })

const createSessionFromUrl = async (url) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;
  return data.session;
};

const signInWithGithub = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });
  if (error) throw error;

  const res = await WebBrowser.openAuthSessionAsync(
    data?.url ?? "",
    redirectTo
  );

  if (res.type === "success") {
    const { url } = res;
    await createSessionFromUrl(url);
  }
};





export default function Auth({ setCurrentPage }) {

  // load fonts
  var [fontsLoaded] = useFonts({
    "MPlusRegular": require("../../assets/fonts/mplusRegular.ttf"),
    "MPlusMedium": require("../../assets/fonts/mplusMedium.ttf")
  })
  if (!fontsLoaded) {
    return null
  }

  // const [email, setEmail] = useState('')
  // const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [authPageScreen, setAuthPageScreen] = useState("sign_in")


  async function signInWithEmail(email, password) {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      Alert.alert(error.message)
    }
    else {
      setCurrentPage("home")
    }
    // console.log({ email, password })
    setLoading(false)
  }

  async function signUpWithEmail(email, password) {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    }, )

    if (error) {
      console.log(error.message)
      Alert.alert(error.message)
    }
    else {
      setCurrentPage("home")

    }
    setLoading(false)
  }

  const resetPassword = async () => {
    setAuthPageScreen("password_reset")
  };

  const url = Linking.useURL();
  if (url) createSessionFromUrl(url);

  return (
    <>
      {authPageScreen == "sign_in" &&
        <SignInForm resetPassword={resetPassword} signInWithEmail={signInWithEmail} signUpWithEmail={signUpWithEmail} signInWithGithub={signInWithGithub} />
      }
      {authPageScreen == "password_reset" &&
        <PasswordResetForm setAuthPageScreen={setAuthPageScreen} setCurrentPage={setCurrentPage} />
      }
    </>
  )
}

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