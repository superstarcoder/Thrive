export const monthAnalysisPrompt = {
  promptHeader: `
Please output a RAW markdown file with analysis of my task data for the month of \${monthName}.

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

Below, I've pasted productivity data for the month of \${monthName} (in csv format):

`,
  promptFooter: `As a reminder, please output a RAW markdown file only.`,
  system_prompt: "You are an assistant that helps analyze a user's task data and provide valuable, concise, and constructive feedback based on the data. You must strictly follow the output format that the user specifies."
};


export const recommendTasksPrompt = {
  promptHeader: `Here are my past tasks in csv format:

  `,
  promptFooter: `
  
  Today’s date is \${selected_date}. Give me a list of tasks that I can add to today’s tasks such that the total workload does not exceed 10 hours and does not seem unrealistic, based on the past task data and completion rate per task category or type. If the task data above is inappropriate, please do not provide any suggestions.
  Here are some things to keep in mind:
- DO NOT provide any explanations. instead, simply list the tasks. nothing else.
- DO NOT include tasks that were already added by the user
- estimated_duration can be 0.1, 0.2, 0.5, 0.8, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, or 5
- List ONLY 3-5 tasks
- Follow this csv format (you can include anywhere from 3 to 5 tasks though):

task_name,estimated_duration,importance
“name of task”,”1”,”9”
“name of task”,”2”,”9”
“name of task”,”0.5”,”3”
“name of task”,”1”,”5"

No need to provide any explanations. Simply list the tasks.

`,
system_prompt: "You are an assistant that must closely follow the format requested by the user. You must come to the best decisions based on patterns in user's data."



}