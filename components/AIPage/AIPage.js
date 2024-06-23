import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'

import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import React from 'react'
import { StyledH1, StyledH2, StyledH3 } from '../text/StyledText';
import Color from '../../assets/themes/Color';
import { getTasksForMonthString } from '../TasksPage/TasksPageSupabase';
import Markdown from 'react-native-markdown-display';
import { OPENAI_API_KEY } from '@env';
import OpenAI from "openai";


// const preprocessMarkdown = (markdownContent) => {
//   // Replace single newline characters (\n) with double newlines (\n\n)
//   return markdownContent.replace(/\n/g, '\n\n');
// };

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const myMonth = 6 // NOT zero indexed
const myYear = 2024
const monthName = monthNames[myMonth - 1];
const basePrompt = `
Please output a RAW markdown file with analysis of my task data for the month of ${monthName}. It would be great if you could provide:

1) What You Did Well: this section should talk about what goals I have, what significant things I achieved, how many hours of work I put in for each kind of task, days/weeks where I was very productive etc. Please talk about all the good things I have done, and be specific to my tasks. Don't be too general.

2) Areas of Improvement: in this section, please talk about some flaws in my productivity patterns AND strategies to improve. For example, am I being realistic about my goals? Do I have too many incomplete tasks? Give me exact and accurate information regarding this. Talk about strategies I could use to manage my time better and get a lot of things done. Give insight that is specific to my tasks. Don't be too general.

3) Strategies for Growth: this section should be the biggest section of all. Focus on talking about exactly what kind of strategies I can use in order to solve the problems that were mentioned in the previous section. Send links if needed, if you think those would be helpful to the user.


Please provide this information in a neat, pretty, and concise format, with around 4-6 bullet points for each number. And this is very very important: write everything in a RAW Markdown file format. Add emojis too! At the end of the file, add a motivating/encouraging message such as "Keep up the good work and focus on these areas for continued improvement! 💪"

Please do not include anything in your output other than a SINGULAR RAW markdown file. The RAW markdown file should be the only output.

The only output should be a SINGULAR RAW markdown file

In addition, the markdown file should only use the following formats:

heading3 (###)
heading4 (###)
bold (**text**)
list_item (-)

use this format:
### heading [emoji]

#### What You Did Well [emoji]:
- **[heading]**: [insert text here]
- [insert more list items]

#### Areas of Improvement [emoji]:
- **[heading]**: [insert text here]
- [insert more list items]

#### Strategies for Growth [emoji]:
- **[heading]**: [insert text here]
- [insert more list items]
    
    
in addition, no matter what, DO NOT indent ANYTHING in the RAW markdown file.
DO NOT indent ANYTHING in the RAW markdown file with spaces either. If you do, it will completely mess up the output and all of it will be useless.

Below, I've pasted productivity data for the month of ${monthName}

`
const promptFooter = `

As a reminder, please output a RAW markdown file only.`
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

  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

  const askAIButtonPressed = async (myMonth, myYear, taskItems) => {
    setIsLoading(true)

    let taskData = getTasksForMonthString(myMonth, myYear, taskItems)


    let completePrompt = basePrompt + taskData + promptFooter
    console.log("calling the api!! :)")

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: completePrompt }],
      model: "gpt-3.5-turbo",
    });

    // console.log(completion.choices[0])
    setIsLoading(false)
    setAnalysisText(completion.choices[0].message.content)
  }

  // Keep up the good work and focus on these areas for continued improvement! 💪

  const [analsysisText, setAnalysisText] = useState(``)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.scrollViewContainer}>
          <StyledH1 text={"Ask Daisy"} style={styles.sectionHeading} />
          <TouchableOpacity style={styles.askAIButton} onPress={() => askAIButtonPressed(myMonth, myYear, taskItems)}>
            <StyledH3 text={"Click me to analyze 📊📈!"} style={styles.buttonTitle} />
          </TouchableOpacity>
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

