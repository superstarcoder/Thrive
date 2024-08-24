import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import React from "react";
import { useColorsStateContext } from "../../ColorContext";
import BottomSheet from "../../FormComponents/BottomSheet";
import { ScrollView } from "react-native-gesture-handler";
import Color from "../../../assets/themes/Color";
import Task from "./Task";
import { getEndOfDay } from "../../../utils/DateHelper";
import { StyledH1, StyledH2, StyledH4 } from "../../text/StyledText";
import { XCircle } from "phosphor-react-native";
import { supabaseInsertTask } from "../TasksPageSupabase";

const TaskRecommendationsModal = forwardRef(({session, setTaskItems, taskItems}, ref) => {
  const heightPercent = 1;
  const bottomSheetRef = useRef(null);
  const { ColorState, setColorState } = useColorsStateContext();
  const [taskRecommendations, setTaskRecommendations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const styles = getDynamicStyles(ColorState);
  scrollingEnabled = true;

  // to uncomment:
  useEffect(() => {
    hideModal()
  }, []);

  useImperativeHandle(ref, () => ({
    showRecommendationsModal({ taskRecommendationsArg, selectedDateArg }) {
      bottomSheetRef?.current?.scrollTo(heightPercent);
      setTaskRecommendations(taskRecommendationsArg);
      setSelectedDate(selectedDateArg);
    },
  }));

  const hideModal = async() => {
      bottomSheetRef?.current?.scrollTo(0);
  }

  const onAddTaskRec = async (taskId) => {
    let taskToAdd = taskRecommendations.find((x) => x.id == taskId);

    console.log({ taskToAdd });

    let newTaskSetting = {
      isHabit: false,
      title: taskToAdd.title,
      duration: taskToAdd.duration,
      importance: taskToAdd.importance,
      dueDate: getEndOfDay(selectedDate),
      status: "incomplete",
      repeat_days_edited_date: new Date(),
      description: "",
    };

    // habitHistory, setHabitHistory, habitStats, setHabitStats passed in as null
    await supabaseInsertTask(
      session,
      newTaskSetting,
      setTaskItems,
      taskItems,
      null,
      null,
      null,
      null
    );

    const updatedItems = taskRecommendations.map((task) =>
      task.id === taskId ? { ...task, isRecAdded: true } : task
    );

    setTaskRecommendations(updatedItems);
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      customStyle={styles.taskMenuModal}
      clamps={[0, heightPercent]}
      scrollingEnabled={scrollingEnabled}
    >
      <View style={styles.recsTitleContainer}>
        <StyledH1
          text={"Thrive AI's recommendations:"}
          style={styles.recsTitle}
        />
        <StyledH4
          text={"If you'd like to add a task, press '+'"}
          style={styles.recsSubtitle}
        />
      </View>
      <View style={styles.taskRecsContainer}>
        <ScrollView>
          {taskRecommendations.map((task, index) => {
            return (
              <Task
                isRecAdded={task.isRecAdded}
                text={task.title}
                key={task.id}
                priority={task.importance}
                duration={task.duration}
                taskId={task.id}
                onAddTaskRec={onAddTaskRec}
                dueDate={getEndOfDay(selectedDate)}
                selectedDate={selectedDate}
                showDueTime={true}
                isHabit={false}
                status={"incomplete"}
                habitStatsEntry={undefined}
                habitHistoryEntry={undefined}
                habitHistory={undefined}
                habitInitDate={undefined}
                repeatDays={undefined}
                description={""}
                onChange={() => {}}
                isRecommendation={true}
              />
            );
          })}
        </ScrollView>
      </View>
      <View style={styles.modalButtons}>
        <View style={styles.cancelButtonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={hideModal}>
            <XCircle
              size={30}
              weight="bold"
              color={ColorState?.IconColor}
              style={styles.buttonIcon}
            />
            <StyledH2 text={"Cancel"} style={styles.cancelButtonText} />
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
});

export default TaskRecommendationsModal;

const getDynamicStyles = (ColorState) => ({
  recsTitleContainer: {
    alignSelf: "center",
    alignItems: "center",
  },
  cancelButtonContainer: {
    position: "relative",
    bottom: 0,
    width: "100%",
    // backgroundColor: "lightblue"
    marginBottom: 160,
  },
  taskMenuModal: {
    backgroundColor: ColorState?.GrayBlue,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.74,
    shadowRadius: 20, // Adjusted to give a similar effect
    elevation: 24, // For Android shadow (optional, based on testing)
    // paddingHorizontal: 20,
    flexDirection: "column",
    gap: 20,
    justifyContent: "flex-start",
    display: "flex",
    flex: 1,
  },
  taskRecsContainer: {
    // backgroundColor: ColorState?.DarkestBlue,
    flex: 1,
    padding: 10,
    width: "100%",
    flexShrink: 0,
    borderColor: "black",
    paddingBottom: 0,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
  },
  cancelButton: {
    flexDirection: "row",
    gap: 6,
    backgroundColor: ColorState?.CancelButton,
    borderRadius: 12,
    marginRight: 20,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  recsTitle: {
    color: ColorState?.TextColor,
  },
  recsSubtitle: {
    color: ColorState?.TextColor,
  },
  cancelButtonText: {
    color: "black",
    textAlignVertical: "center",
  },
});

const stylesHelper = StyleSheet.create({
  taskMenuModal: {
    backgroundColor: Color.GrayBlue,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.74,
    shadowRadius: 20, // Adjusted to give a similar effect
    elevation: 24, // For Android shadow (optional, based on testing)
  },
});
