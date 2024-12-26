import { getMonthNameString, getStandardDateString } from "../../utils/DateHelper";
import { getRecentTasksString, getTasksForMonthString } from "../TasksPage/TasksPageSupabase";
import { monthAnalysisPrompt, recommendTasksPrompt } from "./Prompts";

var baseModelParams = {
  top_k: 0,
  top_p: 0.9,
  prompt: "Hi",
  max_tokens: 5120,
  min_tokens: 0,
  temperature: 0.6,
  system_prompt: "You are a helpful assistant",
  length_penalty: 1,
  stop_sequences: "<|end_of_text|>,<|eot_id|>",
  prompt_template:
    "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nYou are a helpful assistant<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
  presence_penalty: 1.15,
  log_performance_metrics: false,
};
const apiUrl =
  "https://api.replicate.com/v1/models/meta/meta-llama-3-70b-instruct/predictions";
const apiToken = process.env.REPLICATE_API_TOKEN;

/**
 * function that simply takes in hyperparams for the model (which includes a prompt and system_prompt)
 * for info on input schema, check out: https://replicate.com/meta/meta-llama-3-70b-instruct/api/schema
 * @param {string} modelParams
 * @returns
 */
const fetchPrediction = async ({ modelParams }) => {
  // let customInput = {...baseInputParams}

  const body = JSON.stringify({
    input: modelParams,
    stream: false,
  });

  try {
    // Make the initial request
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body,
    });

    let prediction = await response.json();

    // Polling until the prediction is complete
    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      const pollResponse = await fetch(prediction.urls.get, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      });
      prediction = await pollResponse.json();

      if (prediction.error) {
        console.error("Error:", prediction.error);
        return null;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before polling again
    }

    if (prediction.status === "succeeded") {
      // console.log(prediction);
      const result = prediction.output.join(""); // If output is an array, join into a single string
      // console.log(result)
      return result;
    } else {
      console.error("Prediction failed:", prediction);
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

/**
 * extracts tasks from current month and prompts llm to provide insights
 * @param {int} myMonth
 * @param {myYear} myYear
 * @param {taskItems} taskItems
 */
export const AIAnalyzeMonth = async ({ myMonth, myYear, taskItems }) => {

  console.log({myMonth, myYear })
  
  // get modelParams ready (including prompt string)
  let taskDataString = getTasksForMonthString({myMonth, myYear, taskItems});

  if (taskDataString == null) return "You need to add more tasks on the app to use this feature!"

  let monthName = getMonthNameString((new Date()).setMonth(myMonth - 1))
  // console.log(monthName)
  let promptHeader = monthAnalysisPrompt.promptHeader.replace(
    /\$\{monthName\}/g,
    monthName
  );
  let promptFooter = monthAnalysisPrompt.promptFooter
  let completePrompt = promptHeader + taskDataString + promptFooter;
  // console.log({completePrompt})

  let modelParams = { ...baseModelParams };
  modelParams.prompt = completePrompt;
  modelParams.system_prompt = monthAnalysisPrompt.system_prompt
  // call fetchPrediction
  const result = await fetchPrediction({modelParams})
  return result
};

/**
 * 
 * @param {selectedDate} selectedDate
 * @param {taskItems} taskItems
 */
export const AIRecommendTasks = async({selectedDate, taskItems}) => {
  let taskDataString = getRecentTasksString({selectedDate, taskItems})
  let promptHeader = recommendTasksPrompt.promptHeader
  let promptFooter = recommendTasksPrompt.promptFooter.replace(
    /\$\{selected_date\}/g,
    getStandardDateString(selectedDate)
  )
  let completePrompt = promptHeader + taskDataString + promptFooter

  console.log(completePrompt)
  console.log(`
   
    ========================================================================

    `)

  let modelParams = { ...baseModelParams };
  modelParams.prompt = completePrompt;
  modelParams.system_prompt = recommendTasksPrompt.system_prompt  

  let result = await fetchPrediction({modelParams})
  // console.log(completePrompt)


  console.log(result)

  const isTaskDataString = line => {
    // Count occurrences of " and ,
    const quoteCount = (line.match(/"/g) || []).length;
    const commaCount = (line.match(/,/g) || []).length;
    
    // Return true if there are exactly 6 " characters and 2 , characters
    return (
      quoteCount === 6 &&
      commaCount === 2 &&
      line[0] === '"' &&
      line[line.length - 1] === '"'
    );
  };
  
  // // the first 2 lines are USUALLY not the task data (eg: "Here are the suggested tasks: "), so we ignore those
  // result = result.split("\n").slice(2).join("\n")

  let recommendationsArray = result.split("\n")
  // filter out all lines of result that are not of csv format
  recommendationsArray = recommendationsArray.filter(isTaskDataString)

  let propertyLabels = ["title", "duration", "importance"]

  try {
    let taskRecommendations = []
    let id = 0
    recommendationsArray.forEach(recommendation => {
      recommendation = recommendation.split(",")
      let i = 0
      let myTask = {id: id, isRecAdded: false}
      recommendation.forEach(propertyValue => {
  
        propertyValue = propertyValue.replace(/"/g, '').trim();
        let propertyLabel = propertyLabels[i]
  
        if (propertyLabel == "duration" || propertyLabel == "importance") {
          propertyValue = parseFloat(propertyValue)
        }
  
        myTask[propertyLabel] = propertyValue
        i++
      });
  
      taskRecommendations.push(myTask)
      id ++
    })

    console.log(taskRecommendations)
    return taskRecommendations
  } catch (error) {
    console.warn(error)
    return null
  }
}