import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { StyledH1, StyledH2, StyledH3 } from '../text/StyledText';
import StreaksCalendar from './StreaksCalendar';
import { v4 as uuidv4 } from 'uuid';
import { toYMDFormat } from '../../utils/DateHelper';
import { updateHabitStats } from '../TasksPage/TasksPageSupabase';
import { BarChart } from "react-native-gifted-charts";
import HoursGraph from './HoursGraph';
import AllStreaksCalendars from './AllStreaksCalendars';
import { useColorsStateContext } from '../ColorContext';



const StatsPage = ({ habitStats, taskItems, habitHistory, setHabitStats }) => {

  const { ColorState, setColorState } = useColorsStateContext();
  const styles = getDynamicStyles(ColorState)

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.scrollViewContainer}>
          <View style={styles.hoursGraphView}>
            <StyledH1 text={"Hours Worked 💪"} style={styles.sectionHeading} />
            <View>
              <HoursGraph taskItems={taskItems} habitHistory={habitHistory} />
            </View>
            <AllStreaksCalendars habitStats={habitStats} taskItems={taskItems} habitHistory={habitHistory} setHabitStats={setHabitStats} />
          </View>


        </View>
      </ScrollView>
    </View>
  )
}

export default StatsPage


const getDynamicStyles = (ColorState) => ({
  infoBox: {
    display: "flex",
    backgroundColor: ColorState?.GrayBlue,
    alignSelf: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
  },
  infoText: {
    alignSelf: "center",
    color: ColorState?.BlueAccent
  },
  scrollView: {
    display: "flex",
    paddingTop: 100,
    flexDirection: "column",
  },
  container: {
    flexGrow: 1,
  },

  hoursGraphView: {
    gap: 20,
  },
  sectionHeading: {
    alignSelf: "center",
    color: ColorState?.TextColorOnBg
  },
  container: {
    flex: 1,
    backgroundColor: ColorState?.DarkestBlue,
  },
  text: {
    color: ColorState?.TextColor,
  },
  tasksWrapper: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    marginBottom: 20,
  },
  items: {
    // marginTop: 20,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  myCalendar: {
    display: "flex",
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    margin: 12,
    elevation: 5,
    borderWidth: 4,
    borderColor: 'rgba(100, 100, 100, 0.2)'
  },
});