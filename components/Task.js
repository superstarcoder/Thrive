import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Color from '../assets/themes/Color'
import {StyledH1, StyledH2, StyledH3, StyledH4} from './text/StyledH1';
import { Clock, WarningCircle } from 'phosphor-react-native';


const Task = ({text, duration, priority}) => {

  // 1, 2, 3
  // 4, 5, 6, 7
  // 8, 9, 10

  console.log(priority, text, duration)

  if (priority <= 3) {
    accent = <View style={styles.lowPriorityAccent}></View>
    importanceText = <StyledH4 text={"very important"} style={styles.importanceText}/>
  }
  else if (priority <= 7) {
    accent = <View style={styles.mediumPriorityAccent}></View>
    importanceText = <StyledH4 text={"medium importance"} style={styles.importanceText}/>
  }
  else if (priority <= 10) {
    accent = <View style={styles.highPriorityAccent}></View>
    importanceText = <StyledH4 text={"high importance"} style={styles.importanceText}/>
  }

  return (
    <View style={styles.task}>
      {accent}
      <View style={styles.taskContent}>
        <StyledH1 text={text} style={styles.title}/>
        <StyledH4 text={"+ 5 points"} style={styles.pointsText}/>
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
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    // color: Color.Blue
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
    backgroundColor: Color.DarkBlue,
    paddingRight: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  taskContent: {
    flexDirection: 'column',
    padding: 15,
  },
});

export default Task;