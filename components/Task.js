import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Color from '../assets/themes/Color'
import {StyledH1, StyledH2, StyledH3, StyledH4} from './text/StyledH1';
import { Clock, WarningCircle } from 'phosphor-react-native';


const Task = (props) => {

  return (
    <View style={styles.task}>
      <View style={styles.accent}></View>
      <View style={styles.taskContent}>
        <StyledH1 text={props.text} style={styles.title}/>
        <StyledH4 text={"+ 5 points"} style={styles.pointsText}/>
        <View style={styles.taskDetails}>
          <View style={styles.timeDetail}>
            <Clock size={20} weight="fill" color={Color.RedAccent} style={styles.clockIcon} />
            <StyledH4 text={"5 hours"} style={styles.timeText}/>
          </View>
          <View style={styles.importanceDetail}>
            <WarningCircle size={20} weight="fill" color={Color.Blue} style={styles.clockIcon} />
            <StyledH4 text={"very important"} style={styles.importanceText}/>
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
  accent: {
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