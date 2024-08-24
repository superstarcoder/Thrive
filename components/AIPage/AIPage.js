import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'

import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import React from 'react'
import { StyledH1, StyledH2, StyledH3 } from '../text/StyledText';
import { getTasksForMonthString } from '../TasksPage/TasksPageSupabase';
import Markdown from 'react-native-markdown-display';
// import { OPENAI_API_KEY } from '@env';
import OpenAI from "openai";
import { useColorsStateContext } from '../ColorContext';
import { AIAnalyzeMonth } from '../AITools/AITools';

// Function to make the request

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const APISecondsTimeout = 60
const myMonth = (new Date()).getMonth() + 1 // NOT zero indexed
const myYear = (new Date()).getFullYear()
const monthName = monthNames[myMonth - 1];

const AIPage = ({ taskItems, lastAnalyzedTime, setLastAnalyzedTime }) => {


  var [fontsLoaded] = useFonts({
    "MPlusRegular": require("../../assets/fonts/mplusRegular.ttf"),
    "MPlusMedium": require("../../assets/fonts/mplusMedium.ttf")
  })

  if (!fontsLoaded) {
    return null
  }

  useEffect(() => {
  }, [])

  const askAIButtonPressed = async (myMonth, myYear, taskItems) => {

    if (lastAnalyzedTime != null) {
      let now = new Date()
      let time1 = now.getTime()
      let time2 = lastAnalyzedTime.getTime()
      let timePassed = Math.abs(time2 - time1) / 1000
      if (timePassed < APISecondsTimeout) {
        setErrorMessage(`Please try again in ${(APISecondsTimeout - timePassed).toFixed()} seconds!`)
        return
      }
    }
    setErrorMessage(null)
    setIsLoading(true)

    await AIAnalyzeMonth({myMonth, myYear, taskItems}).then(result => {
      setAnalysisText(result)
      setIsLoading(false)
      setLastAnalyzedTime(new Date())
    });
  }

  // Keep up the good work and focus on these areas for continued improvement! 💪

  const [analsysisText, setAnalysisText] = useState(``)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const { ColorState, setColorState } = useColorsStateContext();
  const styles = getDynamicStyles(ColorState)


  const markdownStyles = {

    body: {
      color: ColorState?.GrayOnBg,
      fontFamily: "MPlusRegular",
      fontSize: 18,
    },
    heading2: {
      fontSize: 40,
      color: ColorState?.TextColorOnBg,
    },
    heading3: {
      fontSize: 25,
      // marginBottom: 20,
      color: ColorState?.TextColorOnBg,
      fontFamily: "MPlusMedium",
      // backgroundColor: "black"
    },
    heading4: {
      fontSize: 22,
      marginBottom: 5,
      marginTop: 25,
      color: ColorState?.Blue,
      fontFamily: "MPlusMedium",
    },
    heading5: {
      fontSize: 13,
      color: '#FFFFFF',
    },
    heading6: {
      fontSize: 11,
      color: '#FFFFFF',
    },
    strong: {
      fontFamily: "MPlusMedium",
      fontSize: 19,
      color: ColorState?.Blue
    },
    list_item: {
      marginVertical: 7.5,
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.scrollViewContainer}>
          <StyledH1 text={"Ask Thrive AI"} style={styles.sectionHeading} />
          <TouchableOpacity style={styles.askAIButton} onPress={() => askAIButtonPressed(myMonth, myYear, taskItems)}>
            <StyledH3 text={`Click me to analyze ${monthName}! 📊📈`} style={styles.buttonTitle} />
            {errorMessage &&
              <StyledH3 text={errorMessage} />
            }
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <StyledH3 text={"Thrive AI is designed to analyze your monthly productivity and provide personalized improvement tips. The more tasks you add, the better Thrive AI becomes at offering tailored advice!"} style={styles.infoText} />
          </View>
          {isLoading &&
            <ActivityIndicator size="large" />
          }
          {/* <StyledH3 text={myText} style={styles.sectionHeading} /> */}
          <Markdown style={markdownStyles}>
            {analsysisText}
          </Markdown>
        </View>
      </ScrollView>

    </View>
  )
}

export default AIPage

const getDynamicStyles = (ColorState) => ({
  infoBox: {
    display: "flex",
    backgroundColor: ColorState?.GrayBlue,
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 15,
  },
  infoText: {
    alignSelf: "center",
    color: ColorState?.TextColorOnGrayBlueBg,
    fontSize: 13,
  },
  errorText: {
    color: ColorState?.RedAccent
  },
  body: {
    color: ColorState?.TextColor
  },
  heading: {
    color: ColorState?.TextColor
  },
  scrollView: {
    display: "flex",
    paddingTop: 60,
    flexDirection: "column",
  },
  askAIButton: {
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: ColorState?.AIPage?.AskAIButton,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonTitle: {
    color: "black",
    alignSelf: "center"
  },
  container: {
    flexGrow: 1,
  },
  scrollViewContainer: {
    display: "flex",
    gap: 20,
    padding: 12,
    paddingBottom: 200,
  },
  sectionHeading: {
    alignSelf: "center",
    color: ColorState?.TextColorOnBg
  },
  container: {
    flex: 1,
    backgroundColor: ColorState?.DarkestBlue,
  },

})