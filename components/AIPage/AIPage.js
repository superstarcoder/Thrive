import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'

import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import React from 'react'
import { StyledH1, StyledH2, StyledH3 } from '../text/StyledText';
import Color from '../../assets/themes/Color';
import { getTasksForMonthString } from '../TasksPage/TasksPageSupabase';
import Markdown from 'react-native-markdown-display';

// const preprocessMarkdown = (markdownContent) => {
//   // Replace single newline characters (\n) with double newlines (\n\n)
//   return markdownContent.replace(/\n/g, '\n\n');
// };

const AIPage = ({ taskItems }) => {


  var [fontsLoaded] = useFonts({
    "MPlusRegular": require("../../assets/fonts/mplusRegular.ttf"),
    "MPlusMedium": require("../../assets/fonts/mplusMedium.ttf")
  })

  if (!fontsLoaded) {
    return null
  }

  useEffect(() => {
    console.log("component mounted")
  }, [])

  // Keep up the good work and focus on these areas for continued improvement! 💪
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const myMonth = 6 // NOT zero indexed
  const myYear = 2024
  const monthName = monthNames[myMonth - 1];

  let myText = `### February Task Analysis 📅

  #### What You Did Well 👍:
  - **Goals Achievement**: Completed tasks like applying to startups and finishing coursework regularly.
  - **Productivity Peaks**: Highly productive days on February 6th, 13th, 17th, and 28th with multiple tasks completed.
  - **Coursework Commitment**: Consistently worked on ML, Stats, CS courses with dedicated hours per task.
  - **Project Management**: Successfully completed multiple homework assignments and project milestones.
  - **Application Efforts**: Actively applied to various programs and opportunities throughout the month.
  
  #### Areas of Improvement 🎯:
  - **Goal Realism**: Several incomplete tasks suggest potential overestimation of available time.
  - **Task Prioritization**: Need to prioritize tasks better to ensure critical items are completed on time.
  - **Focus on Incomplete Tasks**: Many tasks left incomplete, especially in mid-February and towards month-end.
  - **Time Management Strategies**: Implementing time-blocking or Pomodoro techniques could enhance productivity.
  - **Consistency in Course Engagement**: Some coursework areas (like ML and Linear Algebra) have inconsistent completion rates.
  - **Follow-up on Applications**: Ensure follow-ups with applications to increase chances of success.
  
  Keep up the good work and focus on these areas for continued improvement! 💪
  `

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.scrollViewContainer}>
          <StyledH1 text={"Ask Daisy"} style={styles.sectionHeading} />
          <TouchableOpacity style={styles.askAIButton} onPress={() => getTasksForMonthString(myMonth, myYear, taskItems)}>
            <StyledH3 text={"Click me to analyze 📊📈!"} style={styles.buttonTitle} />
          </TouchableOpacity>
          {/* <StyledH3 text={myText} style={styles.sectionHeading} /> */}
          <Markdown style={markdownStyles}>
            {myText}
          </Markdown>
        </View>
      </ScrollView>

    </View>
  )
}

export default AIPage



const markdownStyles = StyleSheet.create({
  body: {
    color: Color.Gray,
    fontFamily: "MPlusRegular",
    fontSize: 18,
  },
  heading2: {
    fontSize: 40,
    color: '#FFFFFF',
  },
  heading3: {
    fontSize: 25,
    // marginBottom: 20,
    color: '#FFFFFF',
    fontFamily: "MPlusMedium",
    // backgroundColor: "black"
  },
  heading4: {
    fontSize: 22,
    marginBottom: 5,
    marginTop: 25,
    color: Color.LightBlue,
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
    color: Color.Blue
  },
  list_item: {
    marginVertical: 7.5,
  }
});


const styles = StyleSheet.create({
  body: {
    color: "white"
  },
  heading: {
    color: "white"
  },
  scrollView: {
    display: "flex",
    paddingTop: 60,
    flexDirection: "column",
  },
  askAIButton: {
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: Color.LightBlue,
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
    alignSelf: "center"
  },
  container: {
    flex: 1,
    backgroundColor: Color.DarkestBlue,
  },

})

