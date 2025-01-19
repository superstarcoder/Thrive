import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useColorsStateContext } from "../ColorContext";
import BottomSheet from "../FormComponents/BottomSheet";
import { Trash, XCircle } from "phosphor-react-native";
import { fontStyles, StyledH2, StyledH3, StyledH4 } from "../text/StyledText";
import MyTextInput from "../FormComponents/MyTextInput";
import { ScrollView } from "react-native-gesture-handler";
import CheckBox from "../FormComponents/CheckBox";
import { isIntegerInRange } from "../../utils/OtherHelpers";
import { supabaseAddReward } from "./RewardsPageSupabase";

const RewardSettingsModal = forwardRef(({ rewardItems, user }, ref) => {
  const bottomSheetRef = useRef(null);
  const { ColorState, setColorState } = useColorsStateContext();
  const styles = getDynamicStyles(ColorState);
  const [rewardSettings, setRewardSettings] = useState({ title: "", embers_cost: "", recurring: false });
  const [formError, setFormError] = useState("");

  useImperativeHandle(ref, () => ({
    showAddRewardModal() {
      bottomSheetRef?.current?.scrollTo(1);
      setFormError("");
    },
    showEditTaskModal(myRewardSettings) {
      bottomSheetRef?.current?.scrollTo(1);
    },
  }));

  useEffect(() => {
    bottomSheetRef?.current?.scrollTo(0);
  }, []);

  const onSavePress = async () => {
    if (!isIntegerInRange(rewardSettings.embers_cost, 10, 1000)) {
      setFormError("Please enter a valid embers cost (any integer within the range from 10 to 1000)");
      return;
    }
    await supabaseAddReward({newRewardSettings: rewardSettings, user_uid: user?.id})
    bottomSheetRef?.current?.scrollTo(0);
  };
  const onCancelPress = () => {
    bottomSheetRef?.current?.scrollTo(0);
  };
  const onDeletePress = () => {
    bottomSheetRef?.current?.scrollTo(0);
  };

  const updateTitle = (newTitle) => setRewardSettings((prev) => ({ ...prev, title: newTitle }));
  const updateEmbersCost = (new_embers_cost) => setRewardSettings((prev) => ({ ...prev, embers_cost: new_embers_cost }));
  const updateRecurring = (new_recurring) => setRewardSettings((prev) => ({ ...prev, recurring: new_recurring }));

  return (
    <BottomSheet ref={bottomSheetRef} customStyle={styles.addRewardModal} clamps={[0, 0.5, 1]} scrollingEnabled={false}>
      <ScrollView style={styles.addRewardModalSettings}>
        {/* Title Box */}
        <View style={styles.titleBox}>
          <StyledH3 text={"Title"} style={{ color: ColorState?.TextColorOnBg }} />
          <MyTextInput placeholderText={"Eg: water the plants"} onChangeText={updateTitle} text={rewardSettings.title} />
        </View>
        {/* Embers Cost */}
        <View style={styles.titleBox}>
          <StyledH3 text={"Embers Cost (10 - 1000)"} style={{ color: ColorState?.TextColorOnBg }} />
          <MyTextInput placeholderText={"Eg: 55"} onChangeText={updateEmbersCost} text={rewardSettings.embers_cost} />
        </View>
        {/* Recurring Box */}
        <View style={styles.recurringBox}>
          <StyledH2 text={"Is recurring:"} style={styles.inputTitle} />
          <CheckBox onChange={updateRecurring} checked={rewardSettings.recurring} />
        </View>
        {formError && <StyledH2 text={formError} style={styles.formErrorText} />}
        {/* */}
      </ScrollView>

      {/* modal buttons */}
      <View style={styles.rewardModalButtons}>
        <TouchableOpacity onPress={onSavePress}>
          <View style={styles.saveRewardButton}>
            <Text style={[fontStyles.styledH1, styles.buttonText]}>Save</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={onCancelPress}>
          <View style={styles.cancelRewardButton}>
            <XCircle size={30} weight="bold" color={ColorState?.IconColor} style={styles.buttonIcon} />
          </View>
        </TouchableOpacity>

        {/* only display this if we are in edit mode */}
        <TouchableOpacity onPress={onDeletePress}>
          <View style={styles.deleteRewardButton}>
            <Trash size={30} weight="bold" color={ColorState?.IconColor} style={styles.buttonIcon} />
          </View>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
});

export default RewardSettingsModal;

const getDynamicStyles = (ColorState) => ({
  formErrorText: {
    color: ColorState?.RedAccent,
  },
  addRewardModal: {
    backgroundColor: ColorState?.GrayBlue,
  },
  addRewardModalSettings: {
    flexDirection: "column",
    paddingHorizontal: 30,
  },

  // recurring box
  recurringBox: {
    backgroundColor: ColorState?.DarkestBlue,
    borderRadius: 12,
    paddingHorizontal: 27,
    paddingVertical: 20,
    flexDirection: "row",
    marginBottom: 22,
    alignItems: "center",
  },
  inputTitle: {
    marginRight: 10,
  },

  // title box
  titleBox: {
    backgroundColor: ColorState?.DarkestBlue,
    borderRadius: 12,
    paddingHorizontal: 27,
    paddingVertical: 22,
    marginBottom: 25,
  },

  // modal buttons

  rewardModalButtons: {
    backgroundColor: ColorState?.GrayBlue,
    height: 90,
    marginBottom: 95,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    // position: "absolute",
    alignSelf: "center",
    bottom: 25,
    width: "100%",
    marginTop: 25,
    shadowColor: "black",
    shadowOpacity: 0.2,
    paddingBottom: 10,
  },
  saveRewardButton: {
    backgroundColor: ColorState?.GreenAccent,
    width: 100,
    height: 45,
    borderRadius: 12,
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  buttonText: {
    color: ColorState?.IconColor,
  },
  cancelRewardButton: {
    backgroundColor: ColorState?.CancelButton,
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    marginRight: 20,
    alignItems: "center",
  },
  deleteRewardButton: {
    backgroundColor: ColorState?.RedAccent,
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
