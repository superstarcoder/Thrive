import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import {
  CaretRight,
  CaretLeft,
  Eye,
  Funnel,
  ArrowsDownUp,
  Trophy,
  Fire,
} from "phosphor-react-native";
import {
  StyledH1,
  StyledH2,
  StyledH3,
  StyledH4,
  fontStyles,
} from "../../text/StyledText";
import DateTimePickerModal from "react-native-modal-datetime-picker";
// import AddTasksButton from "./AddTasksButton";
import DropDown from "../../FormComponents/DropDown";
import {
  TASKS_PAGE_SORT_MODES,
  TASKS_PAGE_VIEW_MODES,
} from "../../../utils/AppConstants";
import { Switch } from "react-native-elements/dist/switch/switch";
import { useColorsStateContext } from "../../ColorContext";
import { color } from "react-native-elements/dist/helpers";
import { toDateOnly } from "../../../utils/DateHelper";
import Svg, { Circle, Rect } from 'react-native-svg';

import FlameIcon from "../../../assets/flame_icon.svg"
/**
 *
 * @param {ReactState} viewMode
 * @param {ReactState} setViewMode
 * @returns
 */
const TaskHeader = ({
  onAddTask,
  onAddHabit,
  goToPreviousDay,
  showDatePicker,
  dateText,
  goToNextDay,
  isDatePickerVisible,
  handleConfirm,
  hideDatePicker,
  selectedDate,
  viewMode,
  setViewMode,
  sortModeJournalView,
  setSortModeJournalView,
  sortModeAllTasksView,
  setSortModeAllTasksView,
  emberStats,
}) => {
  const [loadingItemIndex, setLoadingItemIndex] = useState();
  const [isAscending, setIsAscending] = useState(false);
  const sortButtonRef = useRef();
  const { ColorState, setColorState } = useColorsStateContext();
  const styles = getDynamicStyles(ColorState);
  const [earnedEmbers, setEarnedEmbers] = useState();
  const [maxEmbers, setMaxEmbers] = useState();

  const viewButton = (
    <View style={styles.viewButton}>
      <Eye
        size={30}
        weight="duotone"
        color={ColorState?.TasksHeader?.IconColor}
      />
    </View>
  );
  const sortButton = (
    <View style={styles.sortButton}>
      <ArrowsDownUp
        size={30}
        weight="duotone"
        color={ColorState?.TasksHeader?.IconColor}
      />
    </View>
  );
  const onViewModeChanged = (selectedItem, index) => {
    if (selectedItem == viewMode) return; // if view mode didn't actually change

    setLoadingItemIndex(index);
    setViewMode(selectedItem);

    let sortMode = getCurrSortMode(selectedItem);
    let myIndex = TASKS_PAGE_SORT_MODES.indexOf(sortMode[0]);
    sortButtonRef?.current?.selectIndex(myIndex);

    setIsAscending(sortMode[1]);
  };
  const onSortModeChanged = (selectedItem, index) => {
    if (viewMode == "Journal View (Default)") {
      if (selectedItem == sortModeJournalView[0]) return; // if sort mode didn't actually change
      setSortModeJournalView([selectedItem, isAscending]);
    } else if (viewMode == "All Tasks View") {
      if (selectedItem == sortModeAllTasksView[0]) return; // if sort mode didn't actually change
      setSortModeAllTasksView([selectedItem, isAscending]);
    }
  };
  const isAscendingChanged = () => {
    setIsAscending((prevState) => {
      if (viewMode == "Journal View (Default)") {
        console.log(
          `inside of journal view: [${sortModeJournalView[0]}, ${!prevState}]`
        );
        setSortModeJournalView([sortModeJournalView[0], !prevState]);
        return !prevState;
      } else if (viewMode == "All Tasks View") {
        console.log(
          `inside of all tasks view: [${
            sortModeAllTasksView[0]
          }, ${!prevState}]`
        );
        setSortModeAllTasksView([sortModeAllTasksView[0], !prevState]);
        return !prevState;
      }
    });
  };

  const getCurrSortMode = (myViewMode) => {
    console.log("getting default value!!!");
    console.log({ myViewMode });
    if (myViewMode == "Journal View (Default)") {
      console.log(sortModeJournalView[0]);
      return sortModeJournalView;
    }
    if (myViewMode == "All Tasks View") {
      console.log(sortModeAllTasksView[0]);
      return sortModeAllTasksView;
    }
  };

  const sortByHeadingComponent = (
    <View style={{ ...styles.dropDownHeadingStyle }}>
      <View style={styles.ascendingSwitchContainer}>
        {isAscending && (
          <Text style={[fontStyles.styledH4, styles.ascendingSwitchText]}>
            Ascending{" "}
          </Text>
        )}
        {!isAscending && (
          <Text style={[fontStyles.styledH4, styles.ascendingSwitchText]}>
            Descending{" "}
          </Text>
        )}
        <Switch
          style={styles.ascendingSwitch}
          onValueChange={isAscendingChanged}
          value={isAscending}
          trackColor={{
            false: ColorState?.GrayOnBg,
            true: ColorState?.DarkBlue,
          }}
        />
      </View>
      <Text style={[fontStyles.styledH4, styles.dropDownHeadingTextStyle]}>
        Sort By:{" "}
      </Text>
    </View>
  );

  const progressBarMaxWidth = 170;
  const fireIconSize = 35;

  // console.log(toDateOnly(selectedDate))


  // let earnedEmbers = 0;
  // let maxEmbers = 5;
  useEffect(() => {
    if (emberStats[toDateOnly(selectedDate)]) {
      setEarnedEmbers(emberStats[toDateOnly(selectedDate)].earned)
      setMaxEmbers(emberStats[toDateOnly(selectedDate)].max)
      // console.log("embers stats:");
      // console.log(earnedEmbers);
      // console.log(maxEmbers);
    }    
  }, [emberStats, selectedDate])

  let progressBarWidth = (earnedEmbers / maxEmbers) * progressBarMaxWidth;
  if (progressBarWidth == 0) {
    progressBarWidth = 10;
  }
  // if (progressBarWidth < fireIconSize) {
  //   progressBarWidth = fireIconSize / 10;
  // }
  const progressBarWidthStyle = {
    width: progressBarWidth,
  };

  return (
    <View>
      <View style={styles.datePicker}>
        <View style={styles.dateSettings}>
          {/* <TouchableOpacity style={styles.viewButton}>
						<Eye size={30} weight="duotone" />
					</TouchableOpacity> */}
          <DropDown
            buttonComponent={viewButton}
            dropDownOptions={TASKS_PAGE_VIEW_MODES}
            onSelect={onViewModeChanged}
            loadingItemIndex={loadingItemIndex}
            defaultValue={"Journal View (Default)"}
          />

          {viewMode == "Journal View (Default)" && (
            <>
              <View style={styles.currentDateContainer}>
                <TouchableOpacity
                  style={styles.caretLeftContainer}
                  onPress={goToPreviousDay}
                >
                  <CaretLeft
                    size={25}
                    weight="fill"
                    color={ColorState?.Blue}
                    style={styles.caretLeft}
                  />
                </TouchableOpacity>

                <TouchableOpacity onPress={showDatePicker}>
                  <StyledH2 text={dateText} style={styles.currentDate} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.caretRightContainer}
                  onPress={goToNextDay}
                >
                  <CaretRight
                    size={25}
                    weight="fill"
                    color={ColorState?.Blue}
                    style={styles.caretRight}
                  />
                </TouchableOpacity>

                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  display="inline"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                  date={selectedDate}
                />
              </View>
            </>
          )}

          {viewMode == "All Tasks View" && (
            <View style={styles.pageViewHeadingContainer}>
              <StyledH2 text={"All Tasks"} style={styles.currentDate} />
            </View>
          )}

          <DropDown
            headingComponent={sortByHeadingComponent}
            buttonComponent={sortButton}
            dropDownOptions={TASKS_PAGE_SORT_MODES}
            position="left"
            hasHeading={true}
            headingIndex={0}
            onSelect={onSortModeChanged}
            sortButtonRef={sortButtonRef}
            defaultValue={"Importance"}
          />
        </View>
      </View>
      <View style={styles.addButtons}>
        <TouchableOpacity onPress={onAddTask} style={styles.addButton}>
          <StyledH3 text={"+ Add Task"} weight="regular" />
        </TouchableOpacity>

        <TouchableOpacity onPress={onAddHabit} style={styles.addButton}>
          <StyledH3 text={"+ Add Habit"} weight="regular" />
        </TouchableOpacity>
      </View>
      <View style={styles.flameBarContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressBarFilled, progressBarWidthStyle]}>
            {/* <Fire
              size={fireIconSize}
              weight="fill"
              color="#730d0d"
              style={styles.fireIcon}
            /> */}

          <FlameIcon width={fireIconSize} height={fireIconSize} style={styles.fireIcon}/>
          </View>
        </View>
        <View style={styles.embersTextContainer}>
          <Text style={styles.embersText}>
            {earnedEmbers} / {maxEmbers} embers
          </Text>
        </View>
      </View>
    </View>
  );
};

const getDynamicStyles = (ColorState) => ({
  fireIcon: {
    position: "absolute",
    right: -10,
    top: -6,
  },
  flameBarContainer: {
    // marginVertical: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  embersTextContainer: {
    backgroundColor: ColorState?.DarkBlue,
    height: 24,
    borderRadius: 10,
    paddingHorizontal: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  embersText: {
    color: "white",
  },
  progressBar: {
    height: 24,
    width: 170,
    backgroundColor: ColorState?.StreaksBarBg,
    // marginTop: 12,
    borderRadius: 30,
    marginVertical: 10,
  },
  progressBarFilled: {
    height: 24,
    width: 50,
    backgroundColor: "#ffad00",
    borderRadius: 30,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  ascendingSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  ascendingSwitchText: {
    fontSize: 15,
    color: ColorState?.GrayOnBg,
  },
  ascendingSwitchContainer: {
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
  },
  dropDownHeadingTextStyle: {
    fontSize: 18,
    color: ColorState?.GrayOnBg,
  },
  dropDownHeadingStyle: {
    backgroundColor: ColorState?.DarkestBlue,
    flexDirection: "column",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 0.5,
  },
  viewButton: {
    backgroundColor: ColorState?.DarkBlue,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  sortButton: {
    backgroundColor: ColorState?.DarkBlue,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  addButton: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ColorState?.DarkBlue,
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 25,
  },
  addButtons: {
    flexDirection: "row",
    gap: 20,
    alignSelf: "center",
    // marginVertical: 10,
    marginTop: 5,
  },
  dateSettings: {
    // backgroundColor: Color.Blue,
    paddingHorizontal: 10,
    bottom: 12,
    gap: 10,
    // alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingTop: 70,
  },

  caretLeft: {
    marginHorizontal: 14,
    marginLeft: 20,
    marginVertical: 8,
  },
  caretRight: {
    marginHorizontal: 14,
    marginRight: 20,
    marginVertical: 8,
  },
  datePicker: {
    top: 0,
    // height: 110,
    width: "100%",
    backgroundColor: ColorState?.DarkestBlue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
    borderBottomColor: "black",
  },
  currentDateContainer: {
    flexDirection: "row",
    backgroundColor: ColorState?.DarkBlue,
    borderRadius: 8,
    paddingHorizontal: 0,
    alignItems: "center",
  },
  pageViewHeadingContainer: {
    flexDirection: "row",
    backgroundColor: ColorState?.DarkBlue,
    borderRadius: 8,
    paddingHorizontal: 35,
    paddingVertical: 4,
    alignItems: "center",
  },
});

export default TaskHeader;
