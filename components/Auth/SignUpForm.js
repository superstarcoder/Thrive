import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Alert, StyleSheet, View, TextInput, Text } from "react-native";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as Linking from "expo-linking";
import { supabase } from "../../lib/supabase";
import { Button, Input } from "react-native-elements";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
// import Color from "../../assets/themes/Color";
import { thriveBlueTheme as Color } from "../../assets/themes/ThemeColors";
import { StyledH1, StyledH3, StyledH4, fontStyles } from "../text/StyledText";
import { useFonts } from "expo-font";
import { TouchableOpacity } from "react-native-gesture-handler";
import { DiscordLogo, GithubLogo } from "phosphor-react-native";
import {
  FacebookSocialButton,
  GoogleSocialButton,
} from "react-native-social-buttons";
import { redirectToPasswordResetForm } from "./PasswordResetForm";
import ContinueWithButtons from "./ContinueWithButtons";

const SignUpForm = ({
  signInWithEmail,
  signUpWithEmail,
  signInWithGithub,
  resetPassword,
  signInWithDiscord,
  signInWithGoogle,
  setAuthPageScreen,
}) => {
  // load fonts
  var [fontsLoaded] = useFonts({
    MPlusRegular: require("../../assets/fonts/mplusRegular.ttf"),
    MPlusMedium: require("../../assets/fonts/mplusMedium.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const openLink = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Unable to open this url: ${url}`);
    }
  };

  return (
    <View style={styles.container}>
      <StyledH1 text={"Create a new account"} style={styles.headingText} />

      <TextInput
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="Email"
        autoCapitalize={"none"}
        style={[styles.myInputBox, fontStyles.styledH3]}
        placeholderTextColor={Color.Gray}
      />
      <View>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          style={[styles.myInputBox, fontStyles.styledH3]}
          autoCapitalize={"none"}
          placeholderTextColor={Color.Gray}
        />
        <TouchableOpacity onPress={resetPassword}>
          <StyledH4
            text={"Forgot password?"}
            style={styles.forgotPasswordText}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => signUpWithEmail(email, password)}
      >
        <StyledH3 text={"Sign Up"} style={styles.buttonText} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.switchToSignUpButton}
        onPress={() => setAuthPageScreen("sign_in")}
      >
        <StyledH3
          text={"Already have an account? Sign in now!"}
          style={styles.buttonText2}
        />
      </TouchableOpacity>
      <View style={styles.agreementTextContainer}>
        <Text
          style={[fontStyles.styledH4, styles.agreementText]}
          textBreakStrategy="simple"
        >
          By continuing, you agree to Thrive's{" "}
          <Text
            style={[fontStyles.styledH4, { color: "#5c6b9f" }]}
            onPress={() =>
              openLink(
                "https://www.privacypolicies.com/live/dfc59ac9-3a53-4de5-a1df-bdbebaedce57"
              )
            }
          >
            Privacy Policy
          </Text>
        </Text>
      </View>

      <Text style={[fontStyles.styledH4, styles.separator]}>or</Text>

      <ContinueWithButtons
        signInWithGithub={signInWithGithub}
        signInWithDiscord={signInWithDiscord}
        signInWithGoogle={signInWithGoogle}
      />
    </View>
  );
};

export default SignUpForm;

const styles = StyleSheet.create({
  privacyLink: {
    // display: "flex",
    // alignItems: "flex-end",
    // flexDirection: "column"
  },
  switchToSignUpButton: {
    backgroundColor: Color.GrayBlue,
    paddingVertical: 11,
    paddingHorizontal: 12,
    alignItems: "center",
    borderRadius: 8,
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
    marginVertical: 20,
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
  signInButton: {
    backgroundColor: Color.Blue,
    paddingVertical: 11,
    paddingHorizontal: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "black",
  },
  buttonText2: {
    color: Color.LightBlue,
  },
  agreementText: {
    textAlign: "center",
    color: "#727272",
  },
  agreementTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  },
});
