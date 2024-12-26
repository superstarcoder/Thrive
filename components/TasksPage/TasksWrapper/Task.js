import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { StyledH1, StyledH2, StyledH3, StyledH4 } from "../../text/StyledText";
import { Clock, WarningCircle, Fire, Repeat, PlusCircle, PlusSquare, Checks } from "phosphor-react-native";
import TaskCheckBox from "./TaskCheckBox";
import { BlurView } from "expo-blur";
import { onlyDatesAreSame } from "../../../utils/DateHelper";
import { useColorsStateContext } from "../../ColorContext";

const Task = ({
  isRecAdded = false,
  isRecommendation = false,
  isOverdue = false,
  disabled = false,
  onAddTaskRec=undefined,
  dueTimeOverride,
  habitStatsEntry,
  selectedDate,
  habitHistory,
  habitInitDate,
  habitHistoryEntry,
  text,
  repeatDays,
  duration,
  isHabit,
  priority,
  points,
  description,
  onChange,
  taskId,
  dueDate,
  status,
  showDueDate = false,
  showDueTime = false,
}) => {
  const { ColorState, setColorState } = useColorsStateContext();
  const styles = getDynamicStyles(ColorState);

  if (priority <= 4) {
    accent = <View style={styles.lowPriorityAccent}></View>;
    importanceText = (
      <StyledH4 text={"low importance"} style={styles.importanceText} />
    );
  } else if (priority <= 7) {
    accent = <View style={styles.mediumPriorityAccent}></View>;
    importanceText = (
      <StyledH4 text={"medium importance"} style={styles.importanceText} />
    );
  } else if (priority <= 10) {
    accent = <View style={styles.highPriorityAccent}></View>;
    importanceText = (
      <StyledH4 text={"high importance"} style={styles.importanceText} />
    );
  }

  if (isRecommendation && !isRecAdded) {
    taskConditionalStyle = {
      backgroundColor: ColorState?.Task?.TaskRecBackgroundColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 8, // For Android
    }
  } else if (isRecommendation && isRecAdded) {
    taskConditionalStyle = {
      backgroundColor: ColorState?.Task?.TaskRecBackgroundColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 10,
      elevation: 8, // For Android
      opacity: 0.55,
    }
  } else if (
    status == "complete" ||
    (status == "incomplete" && isHabit) ||
    (status == "incomplete_ignored" && !isHabit) ||
    status == "exempt"
  ) {
    taskConditionalStyle = {
      backgroundColor: ColorState?.DarkBlue,
      opacity: 0.55,
    };
  } else {
    taskConditionalStyle = {
      backgroundColor: ColorState?.DarkBlue,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
      elevation: 8, // For Android
    };
  }

  // override dueDate with dueTimeOverride if dueTimeOverride is defined!!
  var correctDueDateTime;
  if (dueTimeOverride != null && dueTimeOverride != undefined) {
    // console.log("overriding due time!!")
    // console.log(new Date(dueTimeOverride))
    // console.log(dueDate)
    correctDueDateTime = new Date(dueTimeOverride);
  } else {
    correctDueDateTime = new Date(dueDate);
  }

  if (showDueTime) {
    dueDateTimeInfo = (
      <View style={styles.dateTimeInfoContainer}>
        <StyledH4
          text={correctDueDateTime.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
          style={styles.currentDate}
        />
      </View>
    );
  } else if (showDueDate) {
    dueDateTimeInfo = (
      <View style={styles.dateTimeInfoContainer}>
        <StyledH4
          text={correctDueDateTime.toLocaleDateString()}
          style={styles.currentDate}
        />
      </View>
    );
  } else {
    dueDateTimeInfo = <View></View>;
  }

  if (isHabit) {
    // UPDATE UI FOR HABIT
    // console.log({habitStatsEntry})
    var streak;
    if (habitStatsEntry == undefined) {
      streak = 0;
    } else {
      streak = habitStatsEntry.streak;
    }

    // from 1 to 50
    // goal is multiple of 5
    // from 50 to 100
    // goal is multiple of 20
    // from 100+
    // goal is multiple of 50

    let goal;
    if (streak >= 0 && streak <= 50) {
      goal = 5 * Math.floor(streak / 5) + 5;
    } else if (streak >= 50 && streak <= 100) {
      goal = 20 * Math.floor(streak / 20) + 20;
    } else {
      goal = 50 * Math.floor(streak / 50) + 50;
    }

    const progressBarMaxWidth = 200;
    const fireIconSize = 35;

    let progressBarWidth = (streak / goal) * progressBarMaxWidth;
    if (progressBarWidth < fireIconSize) {
      progressBarWidth = fireIconSize / 2 + 7;
    }

    const conditionalStyling = {
      width: progressBarWidth,
    };

    habitBar = (
      <View style={styles.progressBar}>
        <View style={[styles.progressBarFilled, conditionalStyling]}>
          <Fire
            size={fireIconSize}
            weight="fill"
            color="#750909"
            style={styles.fireIcon}
          />
        </View>
      </View>
    );

    habitInfoText = (
      <View style={styles.habitInfoText}>
        <StyledH4
          text={`${streak} streaks (goal: ${goal})`}
          style={{ marginRight: 10 }}
        />
      </View>
    );

    // console.log("repeat days: "+repeatDays)
    const daysOfWeek = ["M", "T", "W", "Th", "F", "S", "Su"];
    var repeatDaysStr = "";
    for (var i = 0; i < daysOfWeek.length; i++) {
      if (repeatDays[i]) {
        repeatDaysStr += daysOfWeek[i] + " ";
      }
    }

    // remove last char from string
    repeatDaysStr = repeatDaysStr.substring(0, repeatDaysStr.length - 1);

    if (repeatDaysStr == "S Su") repeatDaysStr = "weekends";
    if (repeatDaysStr == "M T W Th F") repeatDaysStr = "weekdays";
    if (repeatDaysStr == "M T W Th F S Su") repeatDaysStr = "daily";

    repeatDetail = (
      <View style={styles.repeatDetail}>
        <Repeat
          size={20}
          weight="fill"
          color={ColorState?.Blue}
          style={styles.repeatIcon}
        />
        <StyledH4
          text={"repeats: " + repeatDaysStr}
          style={{ color: ColorState?.Gray }}
        />
      </View>
    );
  } else {
    habitBar = <View></View>;
    habitInfoText = <View></View>;
    repeatDetail = <View></View>;
  }

  return (
    <View style={[styles.task, taskConditionalStyle]}>
      <BlurView style={styles.blurView} intensity={3} />
      {accent}
      <View style={[styles.taskContent]}>
        {isOverdue && (
          <View style={styles.warningBox}>
            <StyledH3 text={"overdue"} style={styles.overdueText} />
            <TouchableOpacity
              disabled={disabled}
              onPress={() => {
                !disabled &&
                  onChange(
                    taskId,
                    isHabit,
                    habitHistoryEntry,
                    "incomplete_ignored"
                  );
              }}
            >
              <View style={styles.warningIgnoreButton}>
                <StyledH3
                  text={"ignore"}
                  style={[styles.ignoreText, { color: "black" }]}
                />
              </View>
            </TouchableOpacity>
          </View>
        )}

        <StyledH2 text={text} weight="regular" style={styles.title} />

        {description != "" ? (
          <StyledH4 text={description} style={styles.description} />
        ) : null}

        {habitBar}
        {habitInfoText}

        <View style={styles.taskDetails}>
          <View style={styles.timeDetail}>
            <Clock
              size={20}
              weight="fill"
              color={ColorState?.RedAccent}
              style={styles.clockIcon}
            />
            <StyledH4 text={`${duration} hours`} style={styles.timeText} />
          </View>
          <View style={styles.importanceDetail}>
            <WarningCircle
              size={20}
              weight="fill"
              color={ColorState?.ThemeAccent}
              style={styles.clockIcon}
            />
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
        {(isRecommendation && !isRecAdded) &&
        
        <TouchableOpacity style={styles.addRecIcon} onPress={() => {onAddTaskRec(taskId)}}>
          <PlusSquare size={45} color={ColorState?.GreenAccent} weight="fill" />
        </TouchableOpacity>
        }

      {(isRecommendation && isRecAdded) &&
        <TouchableOpacity style={styles.addRecIcon}>
          <Checks size={45} color={ColorState?.GreenAccent} weight="regular" />
        </TouchableOpacity>
        }

        {!isRecommendation && (
          <TaskCheckBox
            disabled={disabled}
            size={45}
            onChange={onChange}
            taskId={taskId}
            isHabit={isHabit}
            habitHistoryEntry={habitHistoryEntry}
            status={status}
          />
        )}
      </View>
    </View>
  );
};

const getDynamicStyles = (ColorState) => ({
  addRecIcon: {

  },
  habitInfoText: {
    flexDirection: "row",
    marginTop: 10,
  },
  timeInfo: {
    flexDirection: "row",
  },
  repeatIcon: {
    marginRight: 6,
  },
  currentDate: {
    color: ColorState?.Gray,
  },
  progressBar: {
    height: 24,
    width: 200,
    backgroundColor: ColorState?.StreaksBarBg,
    marginTop: 12,
    borderRadius: 30,
  },
  progressBarFilled: {
    height: 24,
    width: 50,
    backgroundColor: ColorState?.StreaksBar,
    borderRadius: 30,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  fireIcon: {
    position: "absolute",
    right: -10,
  },
  title: {
    flex: 1,
    flexWrap: "wrap",
  },
  description: {
    color: ColorState?.Gray,
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
    color: ColorState?.Gray,
  },
  importanceText: {
    color: ColorState?.Gray,
  },
  taskDetails: {
    flexDirection: "row",
    marginTop: 10,
  },
  pointsText: {
    margin: 0,
    color: ColorState?.LightBlue,
  },
  lowPriorityAccent: {
    width: 13,
    height: "100%",
    backgroundColor: ColorState?.GreenAccent,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  mediumPriorityAccent: {
    width: 13,
    height: "100%",
    backgroundColor: ColorState?.BlueAccent,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  highPriorityAccent: {
    width: 13,
    height: "100%",
    backgroundColor: ColorState?.RedAccent,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  blurView: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  task: {
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    // marginTop: 5,
    marginBottom: 15,
    // marginTop: 10,
  },
  taskContent: {
    flexDirection: "column",
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
    backgroundColor: ColorState?.DateTimeInfoContainer,
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
    backgroundColor: ColorState?.Red,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "flex-start",
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
    backgroundColor: ColorState?.Task?.IgnoreButton,
    borderRadius: 8,
    borderWidth: 2,
    marginVertical: 1,
  },
  overdueText: {
    color: ColorState?.Task?.OverdueText,
    marginHorizontal: 5,
  },
  ignoreText: {
    marginHorizontal: 5,
  },
});

export default Task;
