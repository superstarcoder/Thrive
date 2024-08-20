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
// import RNFetchBlob from 'react-native-blob-util';
// import { Color } from '../../assets/themes/Color';
// import Replicate from "replicate";


// const replicateInput = {
//   top_k: 0,
//   top_p: 0.9,
//   prompt: "Paper title: A proof that drinking coffee causes supernovas\n\nIn this essay, I will",
//   max_tokens: 512,
//   min_tokens: 0,
//   temperature: 0.6,
//   length_penalty: 1,
//   stop_sequences: "<|end_of_text|>",
//   prompt_template: "{prompt}",
//   presence_penalty: 1.15,
//   log_performance_metrics: false
// };


// Function to make the request

const fetchPrediction = async ({completePrompt}) => {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  const apiUrl = 'https://api.replicate.com/v1/models/meta/meta-llama-3-70b-instruct/predictions';
  // const body = JSON.stringify({
  //   stream: false,
  //   input: {
  //     system_prompt: "You are an assistant that helps analyze a user's task data and provide valuable, concise, and constructive feedback based on the data",
  //     top_p: 0.9,
  //     prompt: completePrompt,
  //     min_tokens: 0,
  //     temperature: 0.6,
  //     presence_penalty: 1.15
  //   }
  // });

  const body = JSON.stringify({
    input: {
      top_k: 0,
      top_p: 0.9,
      prompt: completePrompt,
      max_tokens: 5120,
      min_tokens: 0,
      temperature: 0.6,
      system_prompt: "You are an assistant that helps analyze a user's task data and provide valuable, concise, and constructive feedback based on the data. You must strictly follow the output format that the user specifies.",
      length_penalty: 1,
      stop_sequences: "<|end_of_text|>,<|eot_id|>",
      prompt_template: "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nYou are a helpful assistant<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
      presence_penalty: 1.15,
      log_performance_metrics: false,
    },
    stream: false
  });

  try {
    // Make the initial request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body
    });

    let prediction = await response.json();

    // Polling until the prediction is complete
    while (prediction.status !== "succeeded" && prediction.status !== "failed") {
      const pollResponse = await fetch(prediction.urls.get, {
        headers: {
          'Authorization': `Bearer ${apiToken}`
        }
      });
      prediction = await pollResponse.json();
      
      if (prediction.error) {
        console.error('Error:', prediction.error);
        return null;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before polling again
    }

    if (prediction.status === "succeeded") {
      console.log(prediction)
      const result = prediction.output.join(""); // If output is an array, join into a single string
      // console.log(result)
      return result;
    } else {
      console.error('Prediction failed:', prediction);
      return null;
    }

    // const prediction = await response.json();
    // console.log(prediction)
    // const streamUrl = prediction.urls.stream;

    // Fetch the stream data
    // const streamResponse = await fetch(streamUrl, {
    //   headers: {
    //     'Accept': 'text/event-stream',
    //     'Cache-Control': 'no-store'
    //   }
    // });

    // const result = await streamResponse.text();

    // const result = prediction.output.join(" ")

    // const result = prediction
    // Handle the result here

    // return result;

  } catch (error) {
    console.error('Error:', error);
  }
};


const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const APISecondsTimeout = 2
const myMonth = (new Date()).getMonth() + 1 // NOT zero indexed
const myYear = (new Date()).getFullYear()
const monthName = monthNames[myMonth - 1];
const basePrompt = `
Please output a RAW markdown file with analysis of my task data for the month of ${monthName}.

This analysis should be specifically tailored to my task data. Feel free to refer to popular productivity books and articles online for mentioning productivity techniques. However, if you do use an external source, please cite your sources.
Here is the content that the markdown file should include:

1) What You Accomplished:
  - List some of the overarching goals (not individual tasks) I had based on my task data
  - Mention the completion of recurring/similar tasks
  - Mention which days/weeks I was the most productive (most % of tasks completed or most hours worked)
  - Provide some positive statistics based on the data: number of hours worked, good productivity patterns, etc.

2) Areas of Improvement:
  - Mention unproductive patterns that you can infer from the data. Also provide reasoning for everything that is mentioned. However, if you don’t see any unproductive patterns, then say so! Please be supportive when you are providing this feedback:
    - Ignoring priorities / lack of prioritization
    - Underestimating time
    - Over-scheduling (trying to fit too many tasks into a short period of time)
    - Lack of planning
  - Focus a lot on specific techniques that I can use. Only mention 1-3 techniques that are most applicable to me based on the tasks data and areas of improvement. Here are just a few examples. Feel free to mention other techniques as well:
    - Creating a schedule
    - Prioritizing tasks
    - Pomodoro technique
    - Active Learning
    - Declutter
    - Set specific goals
    - Track progress
    - Regular exercise
    - Balanced diet
    - Adequate sleep
    - Collaboration (study groups)
    - Work-Life balance
  - Also remind me to check Thrive everyday in order for me to stay on top of my tasks!

Please provide this information in a neat, pretty, and concise format, with around 4-6 bullet points for each number. And this is very very important: write everything in a RAW Markdown file format. Add emojis too! At the end of the file, add a motivating/encouraging message too, to tell the user to not give up and keep focusing on improvement.

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
    
in addition, no matter what, DO NOT indent ANYTHING in the RAW markdown file.
DO NOT indent ANYTHING in the RAW markdown file with spaces either. If you do, it will completely mess up the output and all of it will be useless.

Below, I've pasted productivity data for the month of ${monthName} (in csv format):

`
const promptFooter = `

As a reminder, please output a RAW markdown file only.`
const AIPage = ({ taskItems, lastAnalyzedTime, setLastAnalyzedTime }) => {


  var [fontsLoaded] = useFonts({
    "MPlusRegular": require("../../assets/fonts/mplusRegular.ttf"),
    "MPlusMedium": require("../../assets/fonts/mplusMedium.ttf")
  })

  if (!fontsLoaded) {
    return null
  }

  useEffect(() => {
    // console.log("component mounted")
  }, [])

  // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // const replicate = new Replicate({
  //   auth: process.env.REPLICATE_API_TOKEN,
  // });


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

    let taskData = getTasksForMonthString(myMonth, myYear, taskItems)


    let completePrompt = basePrompt + taskData + promptFooter
    console.log(completePrompt)

    // const completion = await openai.chat.completions.create({
    //   messages: [{ role: "user", content: completePrompt }],
    //   model: "gpt-3.5-turbo",
    // });

    // replicateInput.prompt = completePrompt

    fetchPrediction({completePrompt}).then(result => {
      setAnalysisText(result)
      setIsLoading(false)
      setLastAnalyzedTime(new Date())
    });

    // for await (const event of replicate.stream("meta/meta-llama-3-70b", { input })) {
    //   process.stdout.write(`${event}`)

    //   console.log(`${event}`)
    // };

    // don't delete:
    // setAnalysisText(completion.choices[0].message.content)
    // setAnalysisText("finished processing")
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