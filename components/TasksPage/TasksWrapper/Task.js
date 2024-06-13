import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Color from '../../../assets/themes/Color'
import {StyledH1, StyledH2, StyledH3, StyledH4} from '../../text/StyledText';
import { Clock, WarningCircle, Fire, Repeat } from 'phosphor-react-native';
import TaskCheckBox from './TaskCheckBox';
import { BlurView } from 'expo-blur';
import { onlyDatesAreSame } from '../../../utils/DateHelper';


const Task = ({isOverdue=false, habitStatsEntry,selectedDate, habitHistory, habitInitDate, habitHistoryEntry, text, repeatDays, duration, isHabit, priority, points, description, onChange, taskId, dueDate, status, showDueDate=false, showDueTime=false}) => {

  // const [complete, setComplete] = useState(completeDefault)

  if (priority <= 4) {
    accent = <View style={styles.lowPriorityAccent}></View>
    importanceText = <StyledH4 text={"low importance"} style={styles.importanceText}/>
  }
  else if (priority <= 7) {
    accent = <View style={styles.mediumPriorityAccent}></View>
    importanceText = <StyledH4 text={"medium importance"} style={styles.importanceText}/>
  }
  else if (priority <= 10) {
    accent = <View style={styles.highPriorityAccent}></View>
    importanceText = <StyledH4 text={"high importance"} style={styles.importanceText}/>
  }
  
  if (status == "complete" || (status == "incomplete" && isHabit) || (status == "incomplete_ignored" && !isHabit) || (status == "exempt")) {
    taskConditionalStyle = {
      backgroundColor: "#28265c",
      opacity: 0.65,
    }
  }
  else {
    taskConditionalStyle = {
      backgroundColor: Color.DarkBlue,
    }
  }

  if (showDueTime) {
    dueDateTimeInfo =
    <View style={styles.dateTimeInfoContainer}>
      <StyledH4 text={dueDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} style={styles.currentDate}/>
    </View>
  }
  else if (showDueDate) {
    dueDateTimeInfo = <View style={styles.dateTimeInfoContainer}>
      <StyledH4 text={dueDate.toLocaleDateString()} style={styles.currentDate}/>
    </View>
  }
  else {
    dueDateTimeInfo = <View></View>
  }


  if (isHabit) {




    // habit db stuff
    // console.log({habitHistory, habitInitDate})
    // get habit due time

    // const habitItem = habitHistory.find(entry => onlyDatesAreSame(entry.exactDueDate, selectedDate));
    // if (habitItem != undefined) {
    //   console.log(habitItem.exactDueDate)
    // }

    // console.log(exactDueDate)

    // console.log("HABIT HISTORY ENTRY!!: "+habitHistoryEntry)

    // UPDATE UI FOR HABIT
    // console.log({habitStatsEntry})
    var streak
    if (habitStatsEntry == undefined) {
      streak = 0
    }
    else {
      streak = habitStatsEntry.streak
    }
    


    // from 1 to 50
    // goal is multiple of 5
    // from 50 to 100
    // goal is multiple of 20
    // from 100+
    // goal is multiple of 50

    let goal = 10
    // if (streak >= 0 && streak <= 50) {
    //   goal = 5 * (Math.floor(streak / 5)) + 5
    // } else if (streak >= 50 && streak <= 100) {
    //   goal = 20 * (Math.floor(streak / 20)) + 20
    // } else {
    //   goal = 50 * (Math.floor(streak / 50)) + 50
    // }

    const progressBarMaxWidth = 200
    const fireIconSize = 35

    
    let progressBarWidth = (streak/goal)*progressBarMaxWidth
    if (progressBarWidth < fireIconSize) {
      progressBarWidth = fireIconSize/2 + 7
    }
  
    const conditionalStyling = {
      width: progressBarWidth
    }  

    habitBar =
    <View style={styles.progressBar}>
      <View style={[styles.progressBarFilled, conditionalStyling]}>
        <Fire size={fireIconSize} weight="fill" color="#750909" style={styles.fireIcon}/>
      </View>
    </View>

    habitInfoText =
    <View style={styles.habitInfoText}>
      <StyledH4 text={`${streak} streaks (goal: ${goal})`} style={{marginRight: 10,}}/>
    </View> 

    // console.log("repeat days: "+repeatDays)
    const daysOfWeek = ["M", "T", "W", "Th", "F", "S", "Su"]
    var repeatDaysStr = ""
    for (var i = 0; i < daysOfWeek.length; i++) {
      if (repeatDays[i]) {
        repeatDaysStr += (daysOfWeek[i]+" ")
      }
    }

    // remove last char from string
    repeatDaysStr = repeatDaysStr.substring(0, repeatDaysStr.length - 1);
    
    if (repeatDaysStr == "S Su") repeatDaysStr = "weekends"
    if (repeatDaysStr == "M T W Th F") repeatDaysStr = "weekdays"
    if (repeatDaysStr == "M T W Th F S Su") repeatDaysStr = "daily"

    repeatDetail =
    <View style={styles.repeatDetail}>
      <Repeat size={20} weight="fill" color={Color.Blue} style={styles.repeatIcon} />
      <StyledH4 text={"repeats: "+repeatDaysStr} style={{color: Color.Gray }}/>
    </View>

  }
  else {
    habitBar = <View></View>
    habitInfoText = <View></View>
    repeatDetail = <View></View>
  }


  return (
    <View style={[styles.task, taskConditionalStyle]}>
      <BlurView style={styles.blurView} intensity={3} />
      {accent}
      <View style={[styles.taskContent]}>

        {isOverdue &&
          <View style={styles.warningBox}>
            <StyledH3 text={"overdue"} style={styles.overdueText}/>            
            <View style={styles.warningIgnoreButton}>
              <StyledH3 text={"ignore"} style={[styles.ignoreText, {color: "black"}]}/>            
            </View>
          </View>
        }

        <StyledH2 text={text} weight='regular' style={styles.title}/>

        {description != "" ? ( <StyledH4 text={description} style={styles.description}/> ) : ( null )}

        {habitBar}
        {habitInfoText}

        <View style={styles.taskDetails}>
          <View style={styles.timeDetail}>
            <Clock size={20} weight="fill" color={Color.RedAccent} style={styles.clockIcon} />
            <StyledH4 text={`${duration} hours`} style={styles.timeText}/>
          </View>
          <View style={styles.importanceDetail}>
            <WarningCircle size={20} weight="fill" color={Color.Blue} style={styles.clockIcon} />
            {importanceText}
          </View>
        </View>

        <View style={styles.timeInfo}>
          {dueDateTimeInfo}
          {repeatDetail}
        </View>
        {/* <StyledH4 text={"+"+points+" points"} style={styles.pointsText}/> */}
      </View>
      <View style={styles.checkBoxSection}>
        <TaskCheckBox size={45} onChange={onChange} taskId={taskId} isHabit={isHabit} habitHistoryEntry={habitHistoryEntry} status={status}/>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  habitInfoText: {
    flexDirection: "row",
    marginTop: 10
  },
  timeInfo: {
    flexDirection: "row"
  },
  repeatIcon: {
    marginRight: 6,
  },
  currentDate: {
    color: Color.Gray
  },
  progressBar: {
    height: 24,
    width: 200,
    backgroundColor: Color.DarkGray,
    marginTop: 12,
    borderRadius: 30,
  },
  progressBarFilled: {
    height: 24,
    width: 50,
    backgroundColor: "#d55500",
    borderRadius: 30,
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'
  },
  fireIcon: {
    position: "absolute",
    right: -10,
  },
  title: {
    flex: 1,
    flexWrap: 'wrap',
  },
  description: {
    color: Color.Gray
  },
  clockIcon: {
    marginRight: 6,
  },
  timeDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 6,
  },
  importanceDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  repeatDetail: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    color: Color.Gray
  },
  importanceText: {
    color: Color.Gray
  },
  taskDetails: {
    flexDirection: "row",
    marginTop: 10,
  },
  pointsText: {
    margin: 0,
    color: Color.LightBlue,
  },
  lowPriorityAccent: {
    width: 13,
    height: '100%',
    backgroundColor: Color.GreenAccent,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  }, 
  mediumPriorityAccent: {
    width: 13,
    height: '100%',
    backgroundColor: Color.BlueAccent,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  }, 
  highPriorityAccent: {
    width: 13,
    height: '100%',
    backgroundColor: Color.RedAccent,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  blurView: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },
  task: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
    // marginTop: 10,
  },
  taskContent: {
    flexDirection: 'column',
    padding: 15,
    paddingRight: 0,
    flex: 1,
    marginRight: 8,
  },
  checkBoxSection: {
    margin: 20,
    marginLeft: "auto",
    // width: 50,
    
  },
  dateTimeInfoContainer: {
    backgroundColor: "hsl(0, 0%, 24%)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    padding: 2,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  warningBox: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#a40000",
    borderRadius: 8,
    alignItems: "center",
    alignSelf: 'flex-start',
    marginBottom: 5,
    paddingLeft: 2,
    // paddingHorizontal: 5,
    // paddingHorizontal: 12,

    // paddingVertical: 5,
  },
  warningIgnoreButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8E8E8E",
    borderRadius: 8,
    borderWidth: 2,
    marginVertical: 1,
    


  },
  overdueText: {
    marginHorizontal: 5,
  },
  ignoreText: {
    marginHorizontal: 5,

  }
});

export default Task;