import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Color from '../assets/themes/Color'
import {StyledH1, StyledH2, StyledH3, StyledH4} from './text/StyledText';
import { Clock, WarningCircle } from 'phosphor-react-native';
import TaskCheckBox from './TaskCheckBox';

const Task = ({text, duration, priority, points, description, complete, onComplete, taskId, dueDate, showDueDate=false, showDueTime=false}) => {

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
  
  if (complete) {
    taskConditionalStyle = {
      backgroundColor: "#28265c",
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


  return (
    <View style={[styles.task, taskConditionalStyle]}>
      {accent}
      <View style={[styles.taskContent]}>
        <StyledH2 text={text} style={styles.title}/>

        {description != "" ? ( <StyledH4 text={description}/> ) : ( null )}
        
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

        {dueDateTimeInfo}
        {/* <StyledH4 text={"+"+points+" points"} style={styles.pointsText}/> */}
      </View>
      <View style={styles.checkBoxSection}>
        <TaskCheckBox size={45} onChange={onComplete} checked={complete} taskId={taskId}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    flex: 1,
    flexWrap: 'wrap',
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
  timeText: {

  },
  importanceText: {

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
  task: {

    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  taskContent: {
    flexDirection: 'column',
    padding: 15,
    paddingRight: 0,
    flex: 1,
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
});

export default Task;