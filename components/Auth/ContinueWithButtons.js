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

const ContinueWithButtons = ({
  signInWithGithub,
  signInWithDiscord,
  signInWithGoogle,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.signInWithGithubButton}
        onPress={() => signInWithGithub()}
      >
        <GithubLogo size={30} weight="duotone" color={"white"} />
        <StyledH3 text={"Continue with Github"} />
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.signInWithDiscordButton} onPress={() => signInWithDiscord()}>
        <DiscordLogo size={30} weight="duotone" color={"white"} />
        <StyledH3 text={"Continue with Discord"} />
      </TouchableOpacity> */}

      {/* <GoogleSocialButton
        onPress={() => {}}
        buttonViewStyle={styles.signInWithGoogle}
        logoStyle={styles.googleLogoStyle}
        textStyle={styles.googleButtonText}
        buttonText="Continue with Google"
      /> */}
    </View>
  );
};

export default ContinueWithButtons;

const styles = StyleSheet.create({
  container: {
    gap: 15,
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
    backgroundColor: "#F2F2F2",
    paddingVertical: 11,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    gap: 10,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 12,
    height: "auto",
    borderRadius: 20,
  },
  googleButtonText: {
    // fontFamily: "MPlusMedium",
    fontSize: 16,
  },
  googleLogoStyle: {
    margin: 0,
    padding: 0,
  },
});
